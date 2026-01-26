
"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type ChatSession = {
    id: string;
    title: string;
    updated_at: string;
};

export type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    citations?: any[];
    created_at: string;
    feedback?: number;
};

/**
 * Lists all conversations for the current user.
 */
export async function getConversations() {
    const { userId } = await auth();
    if (!userId) return [];

    const { data, error } = await supabaseAdmin
        .from("conversations")
        .select("id, title, updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }

    return data as ChatSession[];
}

/**
 * Creates a new conversation.
 */
export async function createConversation(title = "New Chat") {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const { data, error } = await supabaseAdmin
        .from("conversations")
        .insert({ user_id: userId, title })
        .select()
        .single();

    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/thea");
    return data;
}

/**
 * Gets messages for a specific conversation.
 */
export async function getMessages(conversationId: string) {
    const { userId } = await auth();
    if (!userId) return [];

    // Verify ownership
    const { data: conv } = await supabaseAdmin
        .from("conversations")
        .select("user_id")
        .eq("id", conversationId)
        .single();

    if (!conv || conv.user_id !== userId) return [];

    const { data, error } = await supabaseAdmin
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

    if (error) return [];
    return data as ChatMessage[];
}

/**
 * Deletes a conversation.
 */
export async function deleteConversation(conversationId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await supabaseAdmin
        .from("conversations")
        .delete()
        .eq("id", conversationId)
        .eq("user_id", userId);

    revalidatePath("/dashboard/thea");
}

/**
 * Updates a conversation title.
 */
export async function updateConversationTitle(conversationId: string, title: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await supabaseAdmin
        .from("conversations")
        .update({ title })
        .eq("id", conversationId)
        .eq("user_id", userId);

    revalidatePath("/dashboard/thea");
}

/**
 * Saves a message to the database.
 */
export async function saveMessage(conversationId: string, role: string, content: string, citations?: any[]) {
    const { userId } = await auth();
    if (!userId) return null; // Background tasks might not have auth context? 
    // Actually, saveMessage usually called from Server Action which has auth context.

    // For assistant messages generated in background, we might need to bypass user check if called internally?
    // But typically we call this from the same flow.

    const { data, error } = await supabaseAdmin
        .from("messages")
        .insert({
            conversation_id: conversationId,
            role,
            content,
            citations
        })
        .select()
        .single();

    if (!error) {
        // Update conversation updated_at
        await supabaseAdmin
            .from("conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", conversationId);
    }

    return data;
}
