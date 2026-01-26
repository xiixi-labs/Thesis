
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai = new OpenAI({
    apiKey: apiKey || "dummy-key", // Prevent crash on build if missing, but will fail request
});

export async function generateEmbedding(text: string) {
    if (!apiKey) {
        // Fallback for testing without key
        console.warn("No OpenAI Key found. Returning zero vector.");
        return new Array(1536).fill(0);
    }

    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text.replace(/\n/g, " "),
    });
    return response.data[0].embedding;
}
