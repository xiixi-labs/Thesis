
const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');
const path = require('path');

// Read .env.local manually
let supabaseUrl, supabaseKey;
try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');

    // Simple regex parsing
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const keyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/) || envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

    if (urlMatch) supabaseUrl = urlMatch[1].trim();
    if (keyMatch) supabaseKey = keyMatch[1].trim();
} catch (e) {
    console.error("Could not read .env.local:", e.message);
}

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectChunks() {
    // Document ID from previous run: 5baddfce-89ea-43fc-94e9-bbc630afb4eb
    const documentId = "5baddfce-89ea-43fc-94e9-bbc630afb4eb";
    console.log(`Searching chunks for document ${documentId}...`);

    // We can't fetch all chunks efficiently if there are many, but let's try searching text
    const { data: chunks, error } = await supabase
        .from("document_chunks")
        .select("id, content")
        .eq("document_id", documentId)
        .ilike("content", "%Sheet Pan Tilapia%")
        .limit(10);

    if (error) {
        console.error("Error fetching chunks:", error);
        return;
    }

    console.log(`Found ${chunks.length} chunks containing "Sheet Pan Tilapia"`);

    chunks.forEach((chunk, i) => {
        console.log(`\n--- Chunk ${i + 1} (ID: ${chunk.id}) ---`);
        console.log(chunk.content);
        console.log("-----------------------------------");
    });

    // Also try to find "Ingredients" near "Tilapia" if possible, or just dump the content found.
}

inspectChunks();
