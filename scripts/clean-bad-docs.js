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

async function cleanBadDocs() {
    console.log('Cleaning up documents with no extractable content...\n');

    // Find all documents with no content
    const { data: badDocs, error } = await supabase
        .from('documents')
        .select('id, name, content')
        .or('content.is.null,content.eq.No extractable text found.');

    if (error) {
        console.error('Error finding bad docs:', error);
        return;
    }

    console.log(`Found ${badDocs.length} documents with no content:`);
    for (const doc of badDocs) {
        console.log(`  - ${doc.name} (${doc.id})`);
    }

    if (badDocs.length === 0) {
        console.log('\n✅ No cleanup needed!');
        return;
    }

    console.log('\nDeleting...');

    for (const doc of badDocs) {
        // Delete chunks first
        const { error: chunkError } = await supabase
            .from('document_chunks')
            .delete()
            .eq('document_id', doc.id);

        if (chunkError) {
            console.log(`  ✗ Error deleting chunks for ${doc.name}:`, chunkError.message);
            continue;
        }

        // Delete document
        const { error: docError } = await supabase
            .from('documents')
            .delete()
            .eq('id', doc.id);

        if (docError) {
            console.log(`  ✗ Error deleting ${doc.name}:`, docError.message);
        } else {
            console.log(`  ✓ Deleted ${doc.name}`);
        }
    }

    console.log('\n✅ Cleanup complete!');
}

cleanBadDocs();
