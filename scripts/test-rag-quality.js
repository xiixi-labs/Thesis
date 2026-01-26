const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// ============================================================
// ENV SETUP
// ============================================================
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
const googleKey = env.GOOGLE_API_KEY;

if (!supabaseUrl || !supabaseKey || !googleKey) {
    console.error('❌ Missing environment variables!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(googleKey);

// ============================================================
// HELPERS
// ============================================================
async function generateEmbedding(text) {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

function printHeader(title) {
    console.log('\n' + '='.repeat(60));
    console.log(`  ${title}`);
    console.log('='.repeat(60));
}

function printSection(title) {
    console.log('\n' + '-'.repeat(60));
    console.log(`  ${title}`);
    console.log('-'.repeat(60));
}

// ============================================================
// DIAGNOSTICS
// ============================================================

async function checkDatabaseState() {
    printHeader('1. DATABASE STATE CHECK');

    // Check documents
    printSection('Documents Table');
    const { data: docs, error: docError } = await supabase
        .from('documents')
        .select('id, name, content, folder_id');

    if (docError) {
        console.log('❌ Error fetching documents:', docError.message);
        return { docs: [], chunks: [] };
    }

    console.log(`✅ Found ${docs.length} documents:`);
    for (const doc of docs) {
        const hasContent = doc.content && doc.content !== 'No extractable text found.';
        const contentPreview = hasContent
            ? doc.content.substring(0, 50).replace(/\n/g, ' ')
            : 'NO CONTENT';
        console.log(`   ${hasContent ? '✓' : '✗'} ${doc.name}`);
        console.log(`      ID: ${doc.id}`);
        console.log(`      Preview: "${contentPreview}..."`);
    }

    // Check chunks
    printSection('Document Chunks Table');
    const { data: chunks, error: chunkError } = await supabase
        .from('document_chunks')
        .select('id, document_id, content, embedding');

    if (chunkError) {
        console.log('❌ Error fetching chunks:', chunkError.message);
        return { docs, chunks: [] };
    }

    console.log(`✅ Found ${chunks.length} total chunks`);

    // Group chunks by document
    const chunksByDoc = {};
    let embeddedCount = 0;
    let missingEmbeddingCount = 0;

    for (const chunk of chunks) {
        if (!chunksByDoc[chunk.document_id]) {
            chunksByDoc[chunk.document_id] = [];
        }
        chunksByDoc[chunk.document_id].push(chunk);

        if (chunk.embedding) {
            embeddedCount++;
        } else {
            missingEmbeddingCount++;
        }
    }

    console.log(`   ✓ ${embeddedCount} chunks have embeddings`);
    if (missingEmbeddingCount > 0) {
        console.log(`   ✗ ${missingEmbeddingCount} chunks MISSING embeddings!`);
    }

    console.log('\nChunks per document:');
    for (const doc of docs) {
        const docChunks = chunksByDoc[doc.id] || [];
        const withEmbedding = docChunks.filter(c => c.embedding).length;
        console.log(`   ${doc.name}: ${docChunks.length} chunks (${withEmbedding} embedded)`);
    }

    return { docs, chunks, chunksByDoc };
}

async function testVectorSearch(testQueries) {
    printHeader('2. VECTOR SEARCH QUALITY TEST');

    const thresholds = [0.1, 0.2, 0.3, 0.4, 0.5];

    for (const query of testQueries) {
        printSection(`Query: "${query.question}"`);
        console.log(`Expected to find: ${query.expectedDoc || 'any relevant doc'}`);

        // Generate query embedding
        console.log('\nGenerating query embedding...');
        let queryEmbedding;
        try {
            queryEmbedding = await generateEmbedding(query.question);
            console.log(`✓ Embedding generated (${queryEmbedding.length} dimensions)`);
        } catch (e) {
            console.log(`✗ Error generating embedding: ${e.message}`);
            continue;
        }

        // Test different thresholds
        console.log('\nTesting different similarity thresholds:');
        for (const threshold of thresholds) {
            const { data: results, error } = await supabase.rpc('match_documents', {
                query_embedding: queryEmbedding,
                match_threshold: threshold,
                match_count: 5,
                allowed_folder_ids: ['fld_sales_playbook', 'fld_pricing_packaging', 'fld_company_overview']
            });

            if (error) {
                console.log(`  ✗ Threshold ${threshold}: Error - ${error.message}`);
                continue;
            }

            if (results && results.length > 0) {
                console.log(`  ✓ Threshold ${threshold}: Found ${results.length} results`);

                // Show top 3 results
                for (let i = 0; i < Math.min(3, results.length); i++) {
                    const r = results[i];
                    // Get document name
                    const { data: docData } = await supabase
                        .from('documents')
                        .select('name')
                        .eq('id', r.document_id)
                        .single();

                    const similarity = (r.similarity * 100).toFixed(1);
                    const preview = r.content.substring(0, 40).replace(/\n/g, ' ');
                    console.log(`     #${i + 1}: ${docData?.name || 'Unknown'} (${similarity}% similar)`);
                    console.log(`         "${preview}..."`);
                }
            } else {
                console.log(`  ✗ Threshold ${threshold}: No results`);
            }
        }

        // Test keyword fallback
        console.log('\nTesting keyword fallback:');
        const { data: keywordResults } = await supabase
            .from('documents')
            .select('id, name, content')
            .in('folder_id', ['fld_sales_playbook', 'fld_pricing_packaging', 'fld_company_overview'])
            .ilike('content', `%${query.question}%`)
            .limit(5);

        if (keywordResults && keywordResults.length > 0) {
            console.log(`  ✓ Keyword search found ${keywordResults.length} documents`);
            for (const doc of keywordResults) {
                console.log(`     - ${doc.name}`);
            }
        } else {
            console.log(`  ✗ Keyword search found nothing`);
        }
    }
}

async function testEndToEnd() {
    printHeader('3. END-TO-END RAG SIMULATION');

    const testQuestion = "What is the secret password?";

    console.log(`\nSimulating chat query: "${testQuestion}"`);
    console.log('(Using current threshold: 0.3)');

    // Step 1: Generate embedding
    console.log('\n1. Generating query embedding...');
    let embedding;
    try {
        embedding = await generateEmbedding(testQuestion);
        console.log(`   ✓ Success (${embedding.length} dims)`);
    } catch (e) {
        console.log(`   ✗ Error: ${e.message}`);
        return;
    }

    // Step 2: Vector search
    console.log('\n2. Running vector search...');
    const { data: vectorResults, error: vectorError } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: 5,
        allowed_folder_ids: ['fld_sales_playbook', 'fld_pricing_packaging', 'fld_company_overview']
    });

    if (vectorError) {
        console.log(`   ✗ Vector search error: ${vectorError.message}`);
    } else if (!vectorResults || vectorResults.length === 0) {
        console.log(`   ✗ No results from vector search!`);
    } else {
        console.log(`   ✓ Found ${vectorResults.length} chunks`);

        // Get doc names
        const docIds = vectorResults.map(r => r.document_id);
        const { data: docMetas } = await supabase
            .from('documents')
            .select('id, name')
            .in('id', docIds);

        for (let i = 0; i < vectorResults.length; i++) {
            const r = vectorResults[i];
            const meta = docMetas?.find(d => d.id === r.document_id);
            const similarity = (r.similarity * 100).toFixed(1);
            console.log(`      #${i + 1}: ${meta?.name || 'Unknown'} (${similarity}%)`);
            console.log(`          "${r.content.substring(0, 50)}..."`);
        }
    }

    // Step 3: Build context
    let context = '';
    if (vectorResults && vectorResults.length > 0) {
        console.log('\n3. Building context for LLM...');
        const { data: docMetas } = await supabase
            .from('documents')
            .select('id, name')
            .in('id', vectorResults.map(r => r.document_id));

        context = vectorResults.map(r => {
            const meta = docMetas?.find(d => d.id === r.document_id);
            return `Document: ${meta?.name}\nContent: ${r.content}`;
        }).join('\n\n');

        console.log(`   ✓ Context built (${context.length} chars)`);
    } else {
        console.log('\n3. No context available (no results)');
        context = 'No relevant documents found.';
    }

    // Step 4: Generate answer
    console.log('\n4. Generating answer with Gemini...');
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const prompt = `You are a helpful AI assistant named Thea. Use the following context to answer the user's question. If the answer is not in the context, say so.
  
Context:
${context}
  
Question: ${testQuestion}
`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();

        console.log(`   ✓ Answer generated:\n`);
        console.log('   ' + '─'.repeat(50));
        console.log(`   ${answer}`);
        console.log('   ' + '─'.repeat(50));
    } catch (e) {
        console.log(`   ✗ Error: ${e.message}`);
    }
}

async function generateRecommendations(diagnosticData) {
    printHeader('4. RECOMMENDATIONS');

    const { docs, chunks, chunksByDoc } = diagnosticData;

    const issues = [];
    const recommendations = [];

    // Check for missing content
    const docsWithoutContent = docs.filter(d => !d.content || d.content === 'No extractable text found.');
    if (docsWithoutContent.length > 0) {
        issues.push(`${docsWithoutContent.length} documents have no extractable content`);
        recommendations.push(`Re-upload these documents:\n${docsWithoutContent.map(d => `     - ${d.name}`).join('\n')}`);
    }

    // Check for missing embeddings
    const totalChunks = chunks.length;
    const embeddedChunks = chunks.filter(c => c.embedding).length;
    if (embeddedChunks < totalChunks) {
        issues.push(`${totalChunks - embeddedChunks} chunks are missing embeddings`);
        recommendations.push('Run: node scripts/reprocess-docs.js');
    }

    // Check for orphaned documents (no chunks)
    const docsWithoutChunks = docs.filter(d => {
        const hasContent = d.content && d.content !== 'No extractable text found.';
        const hasChunks = chunksByDoc[d.id]?.length > 0;
        return hasContent && !hasChunks;
    });

    if (docsWithoutChunks.length > 0) {
        issues.push(`${docsWithoutChunks.length} documents have content but no chunks`);
        recommendations.push('These documents need to be re-processed');
    }

    if (issues.length === 0) {
        console.log('\n✅ DATABASE HEALTH: GOOD');
        console.log('   All documents have content and embeddings.');
    } else {
        console.log('\n⚠️  ISSUES FOUND:');
        issues.forEach((issue, i) => {
            console.log(`   ${i + 1}. ${issue}`);
        });

        console.log('\n📋 RECOMMENDED ACTIONS:');
        recommendations.forEach((rec, i) => {
            console.log(`   ${i + 1}. ${rec}`);
        });
    }

    console.log('\n💡 RETRIEVAL TUNING:');
    console.log('   - Current threshold: 0.3 (30% similarity required)');
    console.log('   - If queries are failing, try lowering to 0.2 or 0.15');
    console.log('   - Location: src/app/api/chat/route.ts line 42');
    console.log('   - Change: match_threshold: 0.3 → match_threshold: 0.2');
}

// ============================================================
// MAIN
// ============================================================
async function main() {
    console.log('🔍 RAG QUALITY DIAGNOSTIC TOOL');
    console.log('Testing retrieval system end-to-end...\n');

    try {
        // 1. Check database state
        const diagnosticData = await checkDatabaseState();

        // 2. Test vector search with various queries
        await testVectorSearch([
            {
                question: "What is the secret password?",
                expectedDoc: "gemini_verify.txt"
            },
            {
                question: "Tell me about Mars",
                expectedDoc: "gemini_final_fact.txt"
            },
            {
                question: "pricing information",
                expectedDoc: "any pricing doc"
            }
        ]);

        // 3. Full end-to-end test
        await testEndToEnd();

        // 4. Generate recommendations
        await generateRecommendations(diagnosticData);

        console.log('\n' + '='.repeat(60));
        console.log('✅ Diagnostic complete!');
        console.log('='.repeat(60) + '\n');

    } catch (e) {
        console.error('\n❌ Fatal error:', e.message);
        console.error(e.stack);
        process.exit(1);
    }
}

main();
