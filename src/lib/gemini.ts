
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || "dummy");

// Helper for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateEmbedding(text: string, retries = 5) {
    if (!apiKey) {
        console.warn("No Google API Key found. Returning zero vector.");
        // Gemini text-embedding-004 is 768 dimensions
        return new Array(768).fill(0);
    }

    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.embedContent(text);
            return result.embedding.values;
        } catch (error: any) {
            const isRateLimit = error?.status === 503 || error?.status === 429 || error?.message?.includes("overloaded") || error?.message?.includes("quota");

            if (isRateLimit && i < retries - 1) {
                // Exponential backoff: 2s, 4s, 8s, 16s, 32s
                const waitTime = Math.pow(2, i + 1) * 1000;
                console.log(`Embedding rate limit (attempt ${i + 1}/${retries}), retrying in ${waitTime}ms...`);
                await delay(waitTime);
            } else {
                throw error;
            }
        }
    }

    throw new Error("Failed after embeddings retries");
}

export async function contextualizeQuery(query: string, history: { role: string, content: string }[]) {
    if (!history || history.length === 0) return query;

    // Use a lightweight model for rewriting if available, or standard
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Last few messages are most relevant
    const recentHistory = history.slice(-6);
    const historyText = recentHistory.map(msg => `${msg.role === 'user' ? 'User' : 'Thea'}: ${msg.content}`).join('\n');

    const prompt = `Given the following conversation history and a follow-up question, rephrase the follow-up question to be a standalone search query.
    Resolve any pronouns (it, they, these, that) or references to previous topics.
    Do NOT answer the question. Just rewrite it for a search engine.
    If the question is already standalone, return it exactly as is.
    
    Conversation History:
    ${historyText}
    
    Follow-up Question: ${query}
    
    Standalone Query:`; // The model should complete this

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        // Remove "Standalone Query:" prefix if model hallucinated it
        return text.replace(/^Standalone Query:\s*/i, "").trim();
    } catch (e) {
        console.error("Query contextualization failed, using original:", e);
        return query;
    }
}

function buildAnswerPrompt(context: string, question: string, history: { role: string, content: string }[] = []) {
    const historyText = history.map(msg => `${msg.role === 'user' ? 'User' : 'Thea'}: ${msg.content}`).join('\n\n');

    return `You are a helpful AI assistant named Thea. You have access to the following retrieved context to answer the user's question.

INSTRUCTIONS:
1. Use the provided Context to answer the user's question.
2. If the answer isn't in the context, you can use your general knowledge but mention that it's not from the documents.
3. Be conversational and helpful.
4. Use the provided Conversation History to understand the context of follow-up questions.

Conversation History:
${historyText}

Retrieved Context:
${context}

Current Question: ${question}
`;
}

export async function generateAnswer(context: string, question: string, history: { role: string, content: string }[] = [], retries = 5) {
    if (!apiKey) {
        return "I cannot answer because the GOOGLE_API_KEY is missing.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = buildAnswerPrompt(context, question, history);

    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            const isRateLimit = error?.status === 503 || error?.status === 429 || error?.message?.includes("overloaded") || error?.message?.includes("quota");

            if (isRateLimit && i < retries - 1) {
                const waitTime = Math.pow(2, i + 1) * 1000;
                console.log(`Generation rate limit (attempt ${i + 1}/${retries}), retrying in ${waitTime}ms...`);
                await delay(waitTime);
            } else {
                throw error;
            }
        }
    }

    throw new Error("Failed to generate answer after retries (Rate Limit Exceeded)");
}

export async function* generateAnswerStream(
    context: string,
    question: string,
    history: { role: string, content: string }[] = [],
    retries = 5
): AsyncGenerator<string> {
    if (!apiKey) {
        yield "I cannot answer because the GOOGLE_API_KEY is missing.";
        return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = buildAnswerPrompt(context, question, history);

    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContentStream(prompt);
            for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) yield text;
            }
            return;
        } catch (error: any) {
            const isRateLimit = error?.status === 503 || error?.status === 429 || error?.message?.includes("overloaded") || error?.message?.includes("quota");

            if (isRateLimit && i < retries - 1) {
                const waitTime = Math.pow(2, i + 1) * 1000;
                console.log(`Stream generation rate limit (attempt ${i + 1}/${retries}), retrying in ${waitTime}ms...`);
                await delay(waitTime);
            } else {
                throw error;
            }
        }
    }

    throw new Error("Failed to generate answer stream after retries (Rate Limit Exceeded)");
}
