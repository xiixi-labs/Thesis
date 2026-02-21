
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { getUser, getAccessibleFolders } from "@/lib/workspace";
import { generateEmbedding, generateAnswer, contextualizeQuery } from "@/lib/gemini";

// --- Types ---

type ChatMessage = { role: "user" | "assistant"; content: string };

type RetrievalResult = {
    id: string;
    document_id: string;
    content: string;
    similarity: number;
};

type HydratedResult = RetrievalResult & { doc_name: string };

type Citation = {
    id: string;
    source: string;
    page: string;
    snippet: string;
};

// --- Request Validation ---

const chatMessageSchema = z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().min(1).max(50_000),
});

const chatRequestSchema = z.object({
    message: z.string().min(1).max(50_000).optional(),
    messages: z.array(chatMessageSchema).max(100).optional(),
    folderIds: z.array(z.string()).max(50).optional(),
    conversationId: z.string().uuid().optional().nullable(),
}).refine(
    (data) => data.message || (data.messages && data.messages.length > 0),
    { message: "Either 'message' or a non-empty 'messages' array is required" }
);

// --- Per-User Rate Limiting ---

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20;  // 20 requests per minute

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(userId);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }

    if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    entry.count++;
    return true;
}

// Periodically clean up stale entries (every 5 min)
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
        if (now > entry.resetAt) rateLimitMap.delete(key);
    }
}, 5 * 60_000);

// --- Route Handler ---

export async function POST(req: NextRequest) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = getUser(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Rate limit check
    if (!checkRateLimit(userId)) {
        return NextResponse.json(
            { error: "Too many requests. Please wait a moment." },
            { status: 429 }
        );
    }

    try {
        // Validate request body
        const rawBody = await req.json();
        const parseResult = chatRequestSchema.safeParse(rawBody);
        if (!parseResult.success) {
            return NextResponse.json(
                { error: "Invalid request", details: parseResult.error.flatten() },
                { status: 400 }
            );
        }
        const { message, messages, folderIds, conversationId: reqConversationId } = parseResult.data;

        let query = "";
        let history: ChatMessage[] = [];

        if (messages && messages.length > 0) {
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

        // 1. Validate Scope
        const accessible = getAccessibleFolders(user);
        const accessibleIds = new Set(accessible.map(f => f.id));

        let targetFolderIds: string[] = [];
        if (!folderIds || folderIds.length === 0) {
            targetFolderIds = Array.from(accessibleIds);
        } else {
            targetFolderIds = folderIds.filter((id) => accessibleIds.has(id));
        }

        // 2. Perform Retrieval via Gemini Embeddings
        let results: RetrievalResult[] = [];

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
                results = vectorResults as RetrievalResult[];
            }
        } catch (embeddingError) {
            console.warn("Embedding/vector search failed, falling back to keyword search:", embeddingError);
        }

        // Fallback if empty (keyword search)
        if (!results || results.length === 0) {
            const { data: textResults } = await supabase
                .from('documents')
                .select('id, name, content')
                .in('folder_id', targetFolderIds)
                .ilike('content', `%${query}%`)
                .limit(10);

            if (textResults && textResults.length > 0) {
                results = textResults.map((doc: { id: string; name: string; content: string }) => ({
                    id: doc.id,
                    document_id: doc.id,
                    content: doc.content,
                    similarity: 0
                }));
            }
        }

        // Hydrate doc names
        const finalResults: HydratedResult[] = [];
        if (results && results.length > 0) {
            const docIds = results.map((r) => r.document_id);
            const { data: docMetas } = await supabase.from('documents').select('id, name').in('id', docIds);

            finalResults.push(...results.map((r) => {
                const meta = docMetas?.find((d: { id: string; name: string }) => d.id === r.document_id);
                return { ...r, doc_name: meta?.name ?? "Unknown" };
            }));
        }

        // 3. Generate Answer via Gemini
        let answer = "";
        try {
            if (finalResults.length === 0) {
                answer = await generateAnswer("No relevant documents found.", query, history);
            } else {
                const context = finalResults.map((r) =>
                    `Document: ${r.doc_name}\nContent: ${r.content}`
                ).join("\n\n");

                answer = await generateAnswer(context, query, history);
            }
        } catch (aiError: unknown) {
            const errMsg = aiError instanceof Error ? aiError.message : "Unknown error";
            console.error("AI generation failed:", aiError);
            answer = `I apologize, but I'm having trouble generating a response right now. Error: ${errMsg}`;
        }

        // 4. Format Citations
        const citations: Citation[] = finalResults.map((r, i) => ({
            id: `cit_${i}`,
            source: r.doc_name,
            page: "Page 1",
            snippet: r.content.substring(0, 100)
        }));

        // 5. Save Assistant Message (Optional)
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
            role: "assistant" as const,
            content: answer,
            citations,
            conversationId
        });

    } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : "Internal Server Error";
        console.error(e);
        return NextResponse.json({ error: errMsg }, { status: 500 });
    }
}
