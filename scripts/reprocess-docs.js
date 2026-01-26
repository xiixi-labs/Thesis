
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// 1. Env Setup
function parseEnv(path) {
    try {
        const content = fs.readFileSync(path, 'utf8');
        const env = {};
        content.split('\n').forEach(line => {
            if (line.trim().startsWith('#')) return;
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let value = parts.slice(1).join('=').trim();
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                env[key] = value;
            }
        });
        return env;
    } catch (e) {
        return {};
    }
}

const env = parseEnv('.env.local');
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const googleKey = env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;

if (!supabaseUrl || !supabaseKey || !googleKey) {
    console.error('Missing env vars', { url: !!supabaseUrl, key: !!supabaseKey, google: !!googleKey });
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(googleKey);

// 2. Helpers
async function generateEmbedding(text) {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

function splitText(text, chunkSize = 1000, overlap = 200) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start += chunkSize - overlap;
    }
    return chunks;
}

// 3. Main
async function run() {
    console.log('Fetching all documents...');
    const { data: docs, error } = await supabase.from('documents').select('*');
    if (error) throw error;

    for (const doc of docs) {
        console.log(`Checking doc: ${doc.name} (${doc.id})`);

        // Check content
        if (!doc.content || doc.content.startsWith('No extractable text')) {
            console.log('  -> Skipping due to missing/invalid content.');
            continue;
        }

        // Check existing chunks
        const { count, error: countError } = await supabase
            .from('document_chunks')
            .select('*', { count: 'exact', head: true })
            .eq('document_id', doc.id);

        if (countError) {
            console.error('  -> Error checking chunks:', countError);
            continue;
        }

        if (count > 0 && doc.name !== 'gemini_verify.txt') { // Force re-process verify.txt
            console.log(`  -> Has ${count} chunks. Skipping.`);
            continue;
        }

        console.log('  -> Generating chunks...');
        const chunks = splitText(doc.content);
        let inserted = 0;

        for (const chunk of chunks) {
            if (chunk.length < 10) continue; // New limit
            try {
                const embedding = await generateEmbedding(chunk);
                await supabase.from('document_chunks').insert({
                    document_id: doc.id,
                    content: chunk,
                    embedding
                });
                inserted++;
                // Rate limit handling crude
                await new Promise(r => setTimeout(r, 500));
            } catch (e) {
                console.error('  -> Embedding error:', e.message);
            }
        }
        console.log(`  -> Inserted ${inserted} chunks.`);
    }
}

run();
