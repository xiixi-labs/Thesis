
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Use environment variables or placeholders for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

// Admin client for server-side operations (bypasses RLS)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = serviceRoleKey
    ? createSupabaseClient(supabaseUrl, serviceRoleKey)
    : supabase; // Fallback (though ideally should fail if missing on server)

// Export createClient function for API compatibility
export function createClient(accessToken?: string) {
    const options = accessToken
        ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
        : {};

    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
        options
    );
}
