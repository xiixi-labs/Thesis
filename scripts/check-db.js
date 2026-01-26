
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDocs() {
    console.log('--- Documents ---');
    const { data: docs, error: docError } = await supabase
        .from('documents')
        .select('id, name, content');

    if (docError) {
        console.error('Error fetching docs:', docError);
    } else {
        console.log(`Found ${docs.length} documents.`);
        docs.forEach(doc => {
            console.log(`- [${doc.id}] ${doc.name}: "${doc.content ? doc.content.substring(0, 30).replace(/\n/g, ' ') : 'NULL'}..."`);
        });
    }

    console.log('\n--- Document Chunks ---');
    const { data: chunks, error: chunkError } = await supabase
        .from('document_chunks')
        .select('id, document_id, content, embedding')
        .limit(5);

    if (chunkError) {
        console.error('Error fetching chunks:', chunkError);
    } else {
        console.log(`Found ${chunks.length} chunks (showing first 5).`);
        chunks.forEach(c => {
            const hasEmbedding = !!c.embedding;
            console.log(`- [${c.id}] Doc: ${c.document_id} HasEmbedding: ${hasEmbedding} Content: "${c.content.substring(0, 30).replace(/\n/g, ' ')}..."`);
        });
    }
}

checkDocs();
