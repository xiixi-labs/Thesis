
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

async function inspectDocument() {
    console.log("Searching for document...");
    const { data: docs, error } = await supabase
        .from("documents")
        .select("id, content")
        .ilike("name", "%Cookbook%")
        .limit(1);

    if (error) {
        console.error("Error fetching document:", error);
        return;
    }

    if (!docs || docs.length === 0) {
        console.error("Document not found");
        return;
    }

    const doc = docs[0];
    console.log(`Found document ID: ${doc.id}`);

    // Look for all occurrences
    const marker = "Sheet Pan Tilapia";
    let index = doc.content.indexOf(marker);

    if (index === -1) {
        console.log(`Marker "${marker}" not found.`);
    }

    let count = 0;
    while (index !== -1) {
        count++;
        console.log(`\n--- Occurrence ${count} (Index ${index}) ---`);
        const start = Math.max(0, index - 200);
        const end = Math.min(doc.content.length, index + 2000);
        console.log(doc.content.substring(start, end));

        index = doc.content.indexOf(marker, index + 1);
    }
}

inspectDocument();
