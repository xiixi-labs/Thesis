
import { mockWorkspace, Folder, User } from "@/lib/workspace";

// --- Types for our Simulated Database ---

export type Document = {
    id: string;
    folderId: string;
    uploaderId: string;
    name: string;
    size: string; // e.g. "2.4 MB"
    mimeType: string;
    createdAt: string; // ISO string
    content: string; // The raw text text extracted (simulated)
};

export type DocumentChunk = {
    id: string;
    documentId: string;
    text: string;
    // In a real app, this would be vector(1536).
    // Here we just store the text for simple keyword matching simulation.
    embedding: number[];
};

// --- In-Memory Store (Global Singleton) ---

class MockDatabase {
    private documents: Document[] = [];
    private chunks: DocumentChunk[] = [];

    constructor() {
        // Seed with initial data if empty
        if (this.documents.length === 0) {
            this.seed();
        }
    }

    seed() {
        // Add some initial documents to match the mock data
        this.addDocument({
            id: "doc_1",
            folderId: "fld_sales_pricing", // Finance/Pricing
            uploaderId: "usr_admin",
            name: "Q3 Financial Report.pdf",
            size: "2.4 MB",
            mimeType: "application/pdf",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
            content: "Q3 Financial Results: Revenue is up 20% YoY. Operating margin increased to 15%. Focus on enterprise sales for Q4."
        });

        this.addDocument({
            id: "doc_2",
            folderId: "fld_sales_playbook",
            uploaderId: "usr_sales",
            name: "Sales Playbook v2.docx",
            size: "1.1 MB",
            mimeType: "application/docx",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            content: "Sales Playbook: 1. Build Rapport. 2. Identify Pain. 3. Propose Solution. 4. Close. Handling objections: If price is too high, emphasize value."
        });
    }

    addDocument(doc: Document) {
        this.documents.push(doc);
        // Simulate chunking immediately
        const docChunks = this.chunkText(doc.content, doc.id);
        this.chunks.push(...docChunks);
        return doc;
    }

    getDocuments() {
        return this.documents;
    }

    getDocumentsForFolder(folderId: string) {
        return this.documents.filter(d => d.folderId === folderId);
    }

    // RAG Search Simulation
    // Finds chunks that match the query keywords
    search(query: string, allowedFolderIds: string[]): { chunk: DocumentChunk, doc: Document, score: number }[] {
        const terms = query.toLowerCase().split(" ");

        // Filter chunks by folder permission first
        const allowedDocs = new Set(this.documents.filter(d => allowedFolderIds.includes(d.folderId)).map(d => d.id));

        const candidateChunks = this.chunks.filter(c => allowedDocs.has(c.documentId));

        // Simple keyword scoring
        const results = candidateChunks.map(chunk => {
            let score = 0;
            const text = chunk.text.toLowerCase();
            for (const term of terms) {
                if (text.includes(term)) score += 1;
            }
            return {
                chunk,
                doc: this.documents.find(d => d.id === chunk.documentId)!,
                score
            };
        });

        // Sort by score
        return results.filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
    }

    // --- Helpers ---
    private chunkText(text: string, docId: string): DocumentChunk[] {
        // Very naive chunking by sentence/period
        const sentences = text.split(". ");
        return sentences.map((s, i) => ({
            id: `${docId}_chk_${i}`,
            documentId: docId,
            text: s,
            embedding: []
        }));
    }
}

// Global Singleton to persist across hot reloads
const globalForDb = globalThis as unknown as { mockDb: MockDatabase };

export const db = globalForDb.mockDb || new MockDatabase();

if (process.env.NODE_ENV !== "production") globalForDb.mockDb = db;
