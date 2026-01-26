
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDocs() {
    const { data, error } = await supabase
        .from('documents')
        .select('id, name, content, embedding');

    if (error) {
        console.error('Error fetching docs:', error);
        return;
    }

    console.log(`Found ${data.length} documents:`);
    data.forEach(doc => {
        console.log(`- [${doc.id}] Name: "${doc.name}" Content: "${doc.content.substring(0, 50)}..." HasEmbedding: ${!!doc.embedding}`);
    });
}

checkDocs();
