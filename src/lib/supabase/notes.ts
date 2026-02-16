/**
 * Supabase API - Folder Notes
 * Handles CRUD operations for folder notes
 */

import { createClient } from '@/lib/supabase';

export type FolderNote = {
    id: string;
    folder_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
};

/**
 * Get notes for a specific folder
 */
export async function getFolderNotes(folderId: string, accessToken?: string): Promise<string> {
    const supabase = createClient(accessToken);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('folder_notes')
        .select('content')
        .eq('folder_id', folderId)
        .eq('user_id', user.id)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching notes:', error);
        throw error;
    }

    return data?.content || '';
}

/**
 * Save or update notes for a folder
 */
export async function saveFolderNotes(folderId: string, content: string, accessToken?: string): Promise<void> {
    const supabase = createClient(accessToken);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('folder_notes')
        .upsert({
            folder_id: folderId,
            user_id: user.id,
            content,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'folder_id,user_id'
        });

    if (error) {
        console.error('Error saving notes:', error);
        throw error;
    }
}

/**
 * Delete notes for a folder
 */
export async function deleteFolderNotes(folderId: string, accessToken?: string): Promise<void> {
    const supabase = createClient(accessToken);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('folder_notes')
        .delete()
        .eq('folder_id', folderId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error deleting notes:', error);
        throw error;
    }
}
