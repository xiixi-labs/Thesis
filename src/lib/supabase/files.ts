/**
 * Supabase API - Files
 * Handles file upload, download, and management
 */

import { createClient } from '@/lib/supabase';

export type FileRecord = {
    id: string;
    folder_id: string;
    name: string;
    type: string;
    size: number;
    storage_path: string;
    url: string | null;
    uploaded_by: string;
    uploaded_at: string;
    metadata: Record<string, any>;
};

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
    folderId: string,
    file: File,
    onProgress?: (progress: number) => void
): Promise<FileRecord> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Create storage path: userId/folderId/filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${user.id}/${folderId}/${timestamp}_${sanitizedName}`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('thesis-files')
        .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('thesis-files')
        .getPublicUrl(storagePath);

    // Create database record
    const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
            folder_id: folderId,
            name: file.name,
            type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
            size: file.size,
            storage_path: storagePath,
            url: publicUrl,
            uploaded_by: user.id,
            metadata: {
                original_name: file.name,
                mime_type: file.type,
            },
        })
        .select()
        .single();

    if (dbError) {
        // Rollback: delete uploaded file
        await supabase.storage.from('thesis-files').remove([storagePath]);
        console.error('Error creating file record:', dbError);
        throw dbError;
    }

    return fileRecord;
}

/**
 * Get all files in a folder
 */
export async function getFolderFiles(folderId: string): Promise<FileRecord[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('folder_id', folderId)
        .order('uploaded_at', { ascending: false });

    if (error) {
        console.error('Error fetching files:', error);
        throw error;
    }

    return data || [];
}

/**
 * Delete a file
 */
export async function deleteFile(fileId: string): Promise<void> {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get file record first
    const { data: file, error: fetchError } = await supabase
        .from('files')
        .select('storage_path')
        .eq('id', fileId)
        .eq('uploaded_by', user.id)
        .single();

    if (fetchError) {
        console.error('Error fetching file:', fetchError);
        throw fetchError;
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
        .from('thesis-files')
        .remove([file.storage_path]);

    if (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Continue anyway to delete DB record
    }

    // Delete database record
    const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)
        .eq('uploaded_by', user.id);

    if (dbError) {
        console.error('Error deleting file record:', dbError);
        throw dbError;
    }
}

/**
 * Download a file
 */
export async function downloadFile(storagePath: string): Promise<Blob> {
    const supabase = createClient();

    const { data, error } = await supabase.storage
        .from('thesis-files')
        .download(storagePath);

    if (error) {
        console.error('Error downloading file:', error);
        throw error;
    }

    return data;
}

/**
 * Get file metadata
 */
export async function getFileMetadata(fileId: string): Promise<FileRecord | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching file metadata:', error);
        throw error;
    }

    return data;
}
