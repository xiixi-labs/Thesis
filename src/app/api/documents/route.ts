
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getUser, getAccessibleFolders } from "@/lib/workspace";

export async function GET(req: NextRequest) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = getUser(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Get folders valid for this user
    const folders = getAccessibleFolders(user);
    const folderIds = folders.map(f => f.id);

    // 2. Fetch from Supabase
    const { data: docs, error } = await supabase
        .from('documents')
        .select(`
      id,
      name,
      size,
      mime_type,
      created_at,
      folder_id,
      folders (
        name
      )
    `)
        .in('folder_id', folderIds)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Supabase fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. Transform
    const enriched = docs.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        size: doc.size,
        mimeType: doc.mime_type,
        createdAt: doc.created_at,
        folderId: doc.folder_id,
        folderName: doc.folders?.name ?? "Unknown"
    }));

    return NextResponse.json({ documents: enriched });
}
