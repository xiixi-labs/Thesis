"use client";

import { useEffect, useState, useRef } from "react";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { Folder } from "@/lib/workspace";
import { registerDocument } from "@/app/actions/documents";
import { supabase } from "@/lib/supabase";

type Doc = {
  id: string;
  name: string;
  size: string;
  createdAt: string; // ISO
  folderName: string;
  mimeType: string;
};

export default function DocumentsPage() {
  const { activeUserId, accessibleFolders } = useWorkspace();
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize selected folder to first available
  useEffect(() => {
    if (accessibleFolders.length > 0 && !selectedFolderId) {
      setSelectedFolderId(accessibleFolders[0].id);
    }
  }, [accessibleFolders, selectedFolderId]);

  // Fetch Docs
  const fetchDocs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/documents", {
        headers: { "x-user-id": activeUserId },
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [activeUserId]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!selectedFolderId) {
      alert("Please select a folder first.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Client-Side Upload to Supabase Storage
      // Use a standard path structure: userId/timestamp_filename
      const fileExt = file.name.split('.').pop();
      // Sanitize filename
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${activeUserId}/${Date.now()}_${safeName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // 2. Register Metadata via Server Action
      const formData = new FormData();
      formData.append("userId", activeUserId);
      formData.append("folderId", selectedFolderId);
      formData.append("fileName", file.name);
      formData.append("filePath", filePath);
      formData.append("fileSize", file.size.toString());
      formData.append("mimeType", file.type);

      await registerDocument(formData);

      // Refresh list
      await fetchDocs();
      alert("Document uploaded successfully! Text extraction complete. Embeddings are being generated in the background and will be ready for search shortly.");
    } catch (err: any) {
      console.error(err);
      alert(`Failed to upload document: ${err.message}`);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Drag and Drop
  const [isDragging, setIsDragging] = useState(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Documents</h1>
          <p className="mt-2 text-base text-zinc-600">
            Manage your knowledge base for <strong>Thea</strong>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 active:scale-[0.98] transition disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "+ Upload Document"}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Upload Area */}
      <div className="mb-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          <label className="text-sm font-medium text-zinc-700">Upload destination:</label>
          <select
            value={selectedFolderId}
            onChange={(e) => setSelectedFolderId(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {accessibleFolders.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all ${isDragging
            ? "border-indigo-500 bg-indigo-50/50"
            : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 hover:border-zinc-300"
            }`}
        >
          <div className="rounded-full bg-white p-4 shadow-sm ring-1 ring-black/5 transition group-hover:scale-110">
            <UploadIcon className="h-8 w-8 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm font-medium text-zinc-900">
              Click to upload <span className="text-zinc-500">or drag and drop</span>
            </div>
            <div className="mt-1 text-xs text-zinc-500">PDF, DOCX, TXT up to 50MB</div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-950">All Documents</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-black/5 bg-white/60 shadow-sm backdrop-blur-xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 bg-white/50 text-xs font-medium uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Folder</th>
                <th className="px-6 py-3">Size</th>
                <th className="px-6 py-3 text-right">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 italic">
                    {isLoading ? "Loading..." : "No documents found."}
                  </td>
                </tr>
              ) : (
                documents.map((doc, i) => (
                  <tr key={doc.id} className="group hover:bg-white/60 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5">
                          <FileIcon className="h-4 w-4 text-zinc-500" />
                        </div>
                        <span className="font-medium text-zinc-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center rounded-full border border-black/5 bg-black/5 px-2 py-0.5 text-xs font-medium text-zinc-600">
                        {doc.folderName}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-zinc-500">{doc.size}</td>
                    <td className="px-6 py-3 text-right text-zinc-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  );
}


