
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
            console.log(`[Gemini] Generated embeddings successfully. dimensions: ${result.embedding.values.length}`);
            return result.embedding.values;
        } catch (error: any) {
            const isRateLimit = error?.status === 503 || error?.status === 429 || error?.message?.includes("overloaded") || error?.message?.includes("quota");

            if (isRateLimit && i < retries - 1) {
                // Linear backoff instead of failing silently for 60s
                const waitTime = (i + 1) * 1000;
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

    return `You are a helpful, professional AI enterprise knowledge assistant named Thea by XII.XI Labs. Your primary purpose is to help users synthesize, find, and understand information from their document library.

STRICT GUARDRAILS:
1. NO CODING: You are strictly forbidden from writing, generating, designing, or architecting software code, HTML, CSS, JavaScript, application structures, or websites.
2. REFUSAL SCRIPT: If a user asks you to write code, build an app, or act as a software engineer, you must politely but firmly decline. State clearly: "I am an enterprise knowledge assistant. I cannot write software code, design websites, or build applications. Please refer these requests to a dedicated software engineer."
3. USE CONTEXT: Primarily rely on the provided Context to answer the user's question.
4. OUTSIDE RESEARCH & PRO UPGRADE: If a user asks you to research topics or find information completely outside of their provided Thesis knowledge base (uploaded docs), you MUST state that you cannot do so on the current tier. Keep it punchy and straight to the point: tell them that researching outside the personal knowledge base requires an upgrade to "Thesis Pro".
5. UPGRADE BUTTON TAG: Whenever you pitch the "Thesis Pro" upgrade (due to outside research requests), you MUST include the exact text string "[UPGRADE_BUTTON]" somewhere in your response. The system will automatically convert this text tag into a clickable upgrade button.
6. OUT-OF-CONTEXT POLICY: If the answer isn't in the provided context, but it's general conversational knowledge (not deep external research), you may use your general knowledge, but you MUST mention that the information is not sourced from the user's documents.
7. BE HELPFUL: Maintain a conversational, intelligent, and helpful tone while strictly adhering to these constraints.

Conversation History:
${historyText}

Retrieved Context:
${context}

Current Question: ${question}
`;
}

export async function generateAnswer(context: string, question: string, history: { role: string, content: string }[] = [], isProModel: boolean = false, retries = 5) {
    if (!apiKey) {
        return "I cannot answer because the GOOGLE_API_KEY is missing.";
    }

    const modelName = isProModel ? "gemini-1.5-pro" : "gemini-2.0-flash";
    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = buildAnswerPrompt(context, question, history);

    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            const isRateLimit = error?.status === 503 || error?.status === 429 || error?.message?.includes("overloaded") || error?.message?.includes("quota");

            if (isRateLimit && i < retries - 1) {
                const waitTime = (i + 1) * 1000;
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
    isProModel: boolean = false,
    retries = 5
): AsyncGenerator<string> {
    if (!apiKey) {
        yield "I cannot answer because the GOOGLE_API_KEY is missing.";
        return;
    }

    const modelName = isProModel ? "gemini-1.5-pro" : "gemini-2.0-flash";
    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = buildAnswerPrompt(context, question, history);

    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContentStream(prompt);
            console.log(`[Gemini] Stream connected for model: ${modelName}`);
            for await (const chunk of result.stream) {
                const text = chunk.text();
                // console.log(`[Gemini] Received chunk: ${text?.substring(0, 20)}...`);
                if (text) yield text;
            }
            console.log(`[Gemini] Stream completed successfully.`);
            return;
        } catch (error: any) {
            const isRateLimit = error?.status === 503 || error?.status === 429 || error?.message?.includes("overloaded") || error?.message?.includes("quota");

            if (isRateLimit && i < retries - 1) {
                const waitTime = (i + 1) * 1000;
                console.log(`Stream generation rate limit (attempt ${i + 1}/${retries}), retrying in ${waitTime}ms...`);
                await delay(waitTime);
            } else {
                throw error;
            }
        }
    }

    throw new Error("Failed to generate answer stream after retries (Rate Limit Exceeded)");
}
