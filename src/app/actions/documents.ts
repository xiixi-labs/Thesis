
"use server";

import { supabase } from "@/lib/supabase";
import { getUser, canUserAccessFolder, mockWorkspace } from "@/lib/workspace";
import { revalidatePath } from "next/cache";
import { generateEmbedding } from "@/lib/gemini"; // Switched to Gemini
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);


// Simple text splitter
function splitText(text: string, chunkSize = 1000, overlap = 200) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start += chunkSize - overlap;
    }
    return chunks;
}

export async function registerDocument(formData: FormData) {
    const userId = formData.get("userId") as string;
    const user = getUser(userId);

    if (!user) {
        throw new Error("User not found or unauthorized");
    }

    const folderId = formData.get("folderId") as string;
    const fileName = formData.get("fileName") as string;
    const filePath = formData.get("filePath") as string;
    const fileSize = formData.get("fileSize") as string;
    const mimeType = formData.get("mimeType") as string;

    if (!folderId || !fileName || !filePath) {
        throw new Error("Missing metadata");
    }

    const folder = mockWorkspace.folders.find((f) => f.id === folderId);
    if (!folder) throw new Error("Folder not found");
    if (!canUserAccessFolder(user, folder)) throw new Error("Permission denied");

    try {
        // 2. Download File
        const { data: fileBlob, error: downloadError } = await supabase.storage
            .from('documents')
            .download(filePath);

        if (downloadError || !fileBlob) throw new Error("Failed to download file");

        const arrayBuffer = await fileBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3. Extract Text
        let fullText = "";

        if (mimeType === "application/pdf") {
            try {
                // pdf2json works in Node.js without workers (unlike pdf-parse v2)
                const PDFParser = require("pdf2json");

                const pdfParser = new PDFParser(null, 1); // raw text mode

                // Parse the PDF
                await new Promise((resolve, reject) => {
                    pdfParser.on("pdfParser_dataReady", () => {
                        resolve(null);
                    });
                    pdfParser.on("pdfParser_dataError", (err: any) => {
                        reject(err);
                    });
                    pdfParser.parseBuffer(buffer);
                });

                // Extract text from parsed data
                const rawText = pdfParser.getRawTextContent();
                fullText = rawText || "";

                // console.log(`PDF parsed: ${fileName}, extracted ${fullText.length} chars`);
            } catch (e: any) {
                console.error("PDF Parsing Error:", e?.message || e);
                fullText = "";
            }
        } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            try {
                const result = await mammoth.extractRawText({ buffer });
                fullText = result.value;
            } catch (e) {
                console.error(e);
                fullText = "";
            }
        } else {
            fullText = buffer.toString("utf-8");
        }

        // Clean text
        fullText = fullText.replace(/\s+/g, " ").trim();
        if (!fullText) fullText = "No extractable text found.";

        // 4. Save Metadata
        const { data: doc, error: dbError } = await supabase
            .from("documents")
            .insert({
                folder_id: folderId,
                uploader_id: user.id,
                name: fileName,
                size: `${(parseInt(fileSize) / 1024).toFixed(1)} KB`,
                mime_type: mimeType,
                content: fullText.substring(0, 50000)
            })
            .select()
            .single();

        if (dbError) throw new Error(`DB insert failed: ${dbError.message}`);

        // 5. Save chunks WITHOUT embeddings first (fast)
        const chunks = splitText(fullText);
        // console.log(`Saving ${chunks.length} chunks for ${fileName}...`);

        const chunkPromises = [];
        for (const chunk of chunks) {
            if (chunk.length < 10) continue;

            chunkPromises.push(
                supabase.from("document_chunks").insert({
                    document_id: doc.id,
                    content: chunk,
                    embedding: null, // Will be filled in background
                })
            );
        }

        await Promise.all(chunkPromises);
        // console.log(`✓ Saved ${chunks.length} chunks. Starting background embedding...`);

        // 6. Generate embeddings in background (async, non-blocking)
        // This runs after the server action returns
        (async () => {
            try {
                const { data: savedChunks } = await supabase
                    .from("document_chunks")
                    .select("id, content")
                    .eq("document_id", doc.id)
                    .is("embedding", null);

                if (!savedChunks || savedChunks.length === 0) {
                    // console.log("No chunks need embedding");
                    return;
                }

                // console.log(`Background: Processing ${savedChunks.length} embeddings for ${fileName}...`);

                // Process in batches to avoid rate limits
                const BATCH_SIZE = 10;
                const BATCH_DELAY = 5000; // 5 seconds between batches
                const CHUNK_DELAY = 500; // 500ms between chunks

                for (let i = 0; i < savedChunks.length; i += BATCH_SIZE) {
                    const batch = savedChunks.slice(i, i + BATCH_SIZE);
                    // console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(savedChunks.length / BATCH_SIZE)}: ${batch.length} chunks`);

                    for (const chunk of batch) {
                        try {
                            const embedding = await generateEmbedding(chunk.content);

                            await supabase
                                .from("document_chunks")
                                .update({ embedding })
                                .eq("id", chunk.id);

                            await new Promise(resolve => setTimeout(resolve, CHUNK_DELAY));
                        } catch (err: any) {
                            console.error(`  ✗ Chunk ${chunk.id}:`, err.message);
                        }
                    }

                    // Longer delay between batches
                    if (i + BATCH_SIZE < savedChunks.length) {
                        // console.log(`  Waiting ${BATCH_DELAY / 1000}s...`);
                        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
                    }
                }

                // console.log(`✓ Background embedding complete for ${fileName}`);
            } catch (err: any) {
                console.error(`Background embedding error for ${fileName}:`, err.message);
            }
        })();

        revalidatePath("/dashboard/documents");
        return { success: true };

    } catch (e: any) {
        console.error("Register Document Error:", e);
        throw new Error(e.message || "Internal Server Error");
    }
}
