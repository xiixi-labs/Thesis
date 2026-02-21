
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { getUser, getAccessibleFolders } from "@/lib/workspace";
import { generateEmbedding, generateAnswer, contextualizeQuery } from "@/lib/gemini";

/** Escape SQL LIKE/ILIKE wildcards so user input is treated as literal text. */
function escapeLikePattern(input: string): string {
    return input.replace(/[%_\\]/g, (ch) => `\\${ch}`);
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = getUser(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
        const { message, messages, folderIds, conversationId: reqConversationId } = await req.json();

        let query = "";
        let history: any[] = [];

        if (messages && Array.isArray(messages) && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            query = lastMsg.content;
            history = messages.slice(0, -1);
        } else if (message) {
            query = message;
        }

        if (!query) {
            return NextResponse.json({ error: "Message required" }, { status: 400 });
        }

        // 1. Contextualize Query (Rewrite based on history)
        const searchSocket = await contextualizeQuery(query, history);
        // console.log(`Rewritten Query: "${searchSocket}" (Original: "${query}")`);

        // Initialize Conversation Persistence (Optional - gracefully fails if tables don't exist)
        let conversationId = reqConversationId;
        try {
            if (!conversationId) {
                const title = query.slice(0, 40) + (query.length > 40 ? "..." : "");
                const { data: conv, error } = await supabaseAdmin
                    .from("conversations")
                    .insert({ user_id: userId, title })
                    .select('id')
                    .single();

                if (!error && conv) {
                    conversationId = conv.id;
                }
            }

            // Save User Message
            if (conversationId) {
                await supabaseAdmin.from("messages").insert({
                    conversation_id: conversationId,
                    role: "user",
                    content: query
                });
            }
        } catch (persistError) {
            // Silently fail persistence - chat will still work without history
            console.warn("Chat persistence unavailable:", persistError);
        }

        // 2. Validate Scope
        const accessible = getAccessibleFolders(user);
        const accessibleIds = new Set(accessible.map(f => f.id));

        let targetFolderIds: string[] = [];
        if (!folderIds || (Array.isArray(folderIds) && folderIds.length === 0)) {
            targetFolderIds = Array.from(accessibleIds);
        } else {
            targetFolderIds = folderIds.filter((id: string) => accessibleIds.has(id));
        }

        // 3. Perform Retrieval via Gemini Embeddings
        let results: any[] = [];

        try {
            // Use the rewritten query for embedding generation
            const embedding = await generateEmbedding(searchSocket);

            const { data: vectorResults, error } = await supabase.rpc('match_documents', {
                query_embedding: embedding,
                match_threshold: 0.5, // Safe threshold
                match_count: 50, // Maximizing context window capability
                allowed_folder_ids: targetFolderIds
            });

            if (error) {
                console.error("Vector search error:", error);
            } else if (vectorResults) {
                results = vectorResults;
            }
        } catch (embeddingError) {
            console.warn("Embedding/vector search failed, falling back to keyword search:", embeddingError);
        }

        // Fallback if empty (keyword search)
        if (!results || results.length === 0) {
            // console.log("Using keyword fallback search for:", query);
            const { data: textResults } = await supabase
                .from('documents')
                .select('id, name, content')
                .in('folder_id', targetFolderIds)
                .ilike('content', `%${escapeLikePattern(query)}%`)
                .limit(10);

            if (textResults && textResults.length > 0) {
                results = textResults.map((doc: any) => ({
                    id: doc.id,
                    document_id: doc.id,
                    content: doc.content,
                    similarity: 0
                }));
            }
        }

        // Hydrate doc names
        const finalResults = [];
        if (results && results?.length > 0) {
            const docIds = results.map((r: any) => r.document_id);
            const { data: docMetas } = await supabase.from('documents').select('id, name').in('id', docIds);

            finalResults.push(...results.map((r: any) => {
                const meta = docMetas?.find((d: any) => d.id === r.document_id);
                return { ...r, doc_name: meta?.name ?? "Unknown" };
            }));
        }

        // 4. Generate Answer via Gemini
        let answer = "";
        try {
            if (finalResults.length === 0) {
                answer = await generateAnswer("No relevant documents found.", query, history);
            } else {
                const context = finalResults.map((r: any) =>
                    `Document: ${r.doc_name}\nContent: ${r.content}`
                ).join("\n\n");

                answer = await generateAnswer(context, query, history);
            }
        } catch (aiError: any) {
            console.error("AI generation failed:", aiError);
            answer = `I apologize, but I'm having trouble generating a response right now. Error: ${aiError.message || 'Unknown error'}`;
        }

        // 5. Format Citations
        const citations = finalResults.map((r: any, i: number) => ({
            id: `cit_${i}`,
            source: r.doc_name,
            page: "Page 1",
            snippet: r.content.substring(0, 100)
        }));

        // 6. Save Assistant Message (Optional)
        try {
            if (conversationId) {
                await supabaseAdmin.from("messages").insert({
                    conversation_id: conversationId,
                    role: "assistant",
                    content: answer,
                    citations: citations
                });

                // Update conversation timestamp
                await supabaseAdmin.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
            }
        } catch (persistError) {
            console.warn("Failed to save assistant message:", persistError);
        }

        return NextResponse.json({
            role: "assistant",
            content: answer,
            citations,
            conversationId
        });

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message || "Internal Server Error", details: JSON.stringify(e) }, { status: 500 });
    }
}
