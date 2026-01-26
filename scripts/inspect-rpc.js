
const { createClient } = require("@supabase/supabase-js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Read .env.local manually
let supabaseUrl, supabaseKey, apiKey;
try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');

    // Simple regex parsing
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const keyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/) || envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
    const apiMatch = envContent.match(/GOOGLE_API_KEY=(.*)/) || envContent.match(/GEMINI_API_KEY=(.*)/);

    if (urlMatch) supabaseUrl = urlMatch[1].trim();
    if (keyMatch) supabaseKey = keyMatch[1].trim();
    if (apiMatch) apiKey = apiMatch[1].trim();
} catch (e) {
    console.error("Could not read .env.local:", e.message);
}

if (!supabaseUrl || !supabaseKey || !apiKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(apiKey);

async function inspectRPC() {
    console.log("Generating embedding for 'Sheet Pan Tilapia and Vegetable Medley'...");

    // Generate embedding
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent("Sheet Pan Tilapia and Vegetable Medley ingredients");
    const embedding = result.embedding.values;

    console.log("Calling match_documents with different thresholds...");

    const thresholds = [0.1, 0.5, 0.8];

    for (const t of thresholds) {
        const { data, error } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: t,
            match_count: 5,
            allowed_folder_ids: [] // Empty might mean all, or none depending on logic. Usually logic handles empty check manually.
            // Wait, looking at route.ts logic: "if !folderIds ... targetFolderIds = accessibleIds".
            // The RPC probably expects specific IDs.
            // Let's assume we need to filter by folder where the doc exists.
            // I'll fetch the folder ID of the doc first.
        });

        // Actually, let's just pass null or handled logic?
        // If strict, I need accurate valid folder IDs.
        // Let's query the document's folder ID first.
    }
}

async function run() {
    // Get folder ID for the cookbook
    const { data: docs } = await supabase.from("documents").select("folder_id").ilike("name", "%Cookbook%").limit(1);
    if (!docs || !docs.length) { console.log("Doc not found"); return; }
    const folderId = docs[0].folder_id;
    console.log(`Using folder ID: ${folderId}`);

    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent("Sheet Pan Tilapia and Vegetable Medley ingredients");
    const embedding = result.embedding.values;

    const thresholds = [0.0, 0.1, 0.2, 0.5, 0.8];
    for (const t of thresholds) {
        const { data, error } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: t,
            match_count: 5,
            allowed_folder_ids: [folderId]
        });

        if (error) {
            console.log(`Threshold ${t}: ERROR ${error.message}`);
        } else {
            console.log(`Threshold ${t}: Found ${data.length} matches`);
            if (data.length > 0) {
                // data[0].similarity would confirm the logic
                // but data structure depends on RPC return
                console.log(`   Top match similarity: ${data[0].similarity || 'N/A'}`);
            }
        }
    }
}

run();
