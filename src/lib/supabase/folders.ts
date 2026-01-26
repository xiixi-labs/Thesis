/**
 * Supabase API - Folders
 * Handles CRUD operations for folders
 */

import { createClient } from '@/lib/supabase';

export type Folder = {
    id: string;
    name: string;
    description: string | null;
    parent_id: string | null;
    user_id: string;
    team_id: string | null;
    color: string | null;
    icon: string | null;
    created_at: string;
    updated_at: string;
};

/**
 * Get all folders for the current user
 */
export async function getUserFolders(): Promise<Folder[]> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching folders:', error);
        throw error;
    }

    return data || [];
}

/**
 * Get a specific folder by ID
 */
export async function getFolder(folderId: string): Promise<Folder | null> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('id', folderId)
        .eq('user_id', user.id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('Error fetching folder:', error);
        throw error;
    }

    return data;
}

/**
 * Create a new folder
 */
export async function createFolder(params: {
    name: string;
    description?: string;
    parent_id?: string;
    team_id?: string;
    color?: string;
    icon?: string;
}): Promise<Folder> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('folders')
        .insert({
            ...params,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating folder:', error);
        throw error;
    }

    return data;
}

/**
 * Update a folder
 */
export async function updateFolder(
    folderId: string,
    updates: Partial<Pick<Folder, 'name' | 'description' | 'color' | 'icon'>>
): Promise<Folder> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('folders')
        .update(updates)
        .eq('id', folderId)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating folder:', error);
        throw error;
    }

    return data;
}

/**
 * Delete a folder
 */
export async function deleteFolder(folderId: string): Promise<void> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error deleting folder:', error);
        throw error;
    }
}

/**
 * Get child folders of a parent
 */
export async function getChildFolders(parentId: string): Promise<Folder[]> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('parent_id', parentId)
        .eq('user_id', user.id)
        .order('name');

    if (error) {
        console.error('Error fetching child folders:', error);
        throw error;
    }

    return data || [];
}
