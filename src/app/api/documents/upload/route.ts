
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getUser, canUserAccessFolder, mockWorkspace } from "@/lib/workspace";

export async function POST(req: NextRequest) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = getUser(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folderId = formData.get("folderId") as string;

        if (!file || !folderId) {
            return NextResponse.json({ error: "Missing file or folderId" }, { status: 400 });
        }

        // 1. Verify Permission
        // We still use our mock workspace logic for folder permissions until we migrate folders to DB fully
        // But we check against the DB folders if we had them synced. For now, rely on mockWorkspace check.
        const folder = mockWorkspace.folders.find(f => f.id === folderId);
        if (!folder) {
            return NextResponse.json({ error: "Folder not found" }, { status: 404 });
        }

        if (!canUserAccessFolder(user, folder)) {
            return NextResponse.json({ error: "Permission denied" }, { status: 403 });
        }

        // 2. Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}_${file.name.replace(/\s/g, '_')}`;

        // Convert to ArrayBuffer for Supabase Upload
        const fileBuffer = await file.arrayBuffer();

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, fileBuffer, {
                contentType: file.type,
            });

        if (uploadError) {
            throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        // 3. Extract Text (Simulation)
        let textContent = "";
        if (file.type === "text/plain") {
            textContent = await file.text();
        } else {
            textContent = `Simulated extracted content for ${file.name}. This is where we would use OCR/PDF parsing.`;
        }

        // 4. Insert into DB
        const { data: doc, error: dbError } = await supabase
            .from('documents')
            .insert({
                folder_id: folderId,
                uploader_id: user.id,
                name: file.name,
                size: `${(file.size / 1024).toFixed(1)} KB`,
                mime_type: file.type,
                content: textContent
            })
            .select()
            .single();

        if (dbError) {
            throw new Error(`DB insert failed: ${dbError.message}`);
        }

        // 5. Create Dummy Chunk (for RAG testing without OpenAI key yet)
        // We insert a chunk with a zero-vector so it exists, but won't be searchable without real embeddings.
        // NOTE: This assumes 'embedding' column allows nulls or we provide a valid dummy.
        // Let's just skip embeddings for now or insert text-only if possible.
        await supabase.from('document_chunks').insert({
            document_id: doc.id,
            content: textContent.substring(0, 1000), // First 1k chars
            chunk_index: 0,
            // embedding: ... (requires OpenAI key)
        });

        return NextResponse.json({ success: true, document: doc });

    } catch (e: any) {
        console.error("Upload error:", e);
        return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
    }
}
