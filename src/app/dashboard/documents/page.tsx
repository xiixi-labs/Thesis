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

  // Search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFolder, setFilterFolder] = useState<string>("all");

  // Document actions
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Upload progress
  const [uploadProgress, setUploadProgress] = useState<{
    fileName: string;
    progress: number;
    status: 'uploading' | 'processing' | 'complete' | 'error';
    error?: string;
  } | null>(null);

  // Helper functions
  const formatFileSize = (sizeStr: string) => {
    const bytes = parseInt(sizeStr);
    if (isNaN(bytes)) return sizeStr;
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

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

  // Filter documents based on search and folder filter
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = filterFolder === 'all' || doc.folderName === filterFolder;
    return matchesSearch && matchesFolder;
  });

  // Document action handlers
  const handleDelete = async (doc: Doc) => {
    if (!confirm(`Delete "${doc.name}"?`)) return;

    setDeletingDocId(doc.id);
    try {
      // Delete from storage
      const filePath = `${activeUserId}/${doc.name}`;
      await supabase.storage.from('documents').remove([filePath]);

      // Refresh list (the document will be gone from storage)
      await fetchDocs();
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document. Please try again.');
    } finally {
      setDeletingDocId(null);
    }
  };

  const handleDownload = async (doc: Doc) => {
    try {
      const filePath = `${activeUserId}/${doc.name}`;
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 60);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to download document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

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
    setUploadProgress({
      fileName: file.name,
      progress: 0,
      status: 'uploading'
    });

    try {
      // 1. Client-Side Upload to Supabase Storage
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${activeUserId}/${Date.now()}_${safeName}`;

      // Simulate progress for demonstration (Supabase doesn't expose upload progress in JS client)
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (progress <= 90) {
          setUploadProgress(prev => prev ? { ...prev, progress } : null);
        }
      }, 200);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        });

      clearInterval(progressInterval);

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // Update to processing state
      setUploadProgress({
        fileName: file.name,
        progress: 100,
        status: 'processing'
      });

      // 2. Register Metadata via Server Action
      const formData = new FormData();
      formData.append("userId", activeUserId);
      formData.append("folderId", selectedFolderId);
      formData.append("fileName", file.name);
      formData.append("filePath", filePath);
      formData.append("fileSize", file.size.toString());
      formData.append("mimeType", file.type);

      await registerDocument(formData);

      // Complete
      setUploadProgress({
        fileName: file.name,
        progress: 100,
        status: 'complete'
      });

      // Refresh list
      await fetchDocs();

      // Clear progress after 2 seconds
      setTimeout(() => {
        setUploadProgress(null);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setUploadProgress({
        fileName: file.name,
        progress: 0,
        status: 'error',
        error: err.message
      });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Drag and Drop handlers
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

      {/* Upload Progress Indicator */}
      {uploadProgress && (
        <div className="mb-6 rounded-lg border border-black/5 bg-white/60 p-4 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {uploadProgress.status === 'uploading' && (
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
              )}
              {uploadProgress.status === 'processing' && (
                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse flex-shrink-0" />
              )}
              {uploadProgress.status === 'complete' && (
                <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {uploadProgress.status === 'error' && (
                <svg className="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-sm font-medium text-zinc-900 truncate">
                {uploadProgress.fileName}
              </span>
            </div>
            <span className="text-xs text-zinc-500 ml-2 flex-shrink-0">
              {uploadProgress.status === 'uploading' && `${uploadProgress.progress}%`}
              {uploadProgress.status === 'processing' && 'Processing...'}
              {uploadProgress.status === 'complete' && 'Complete!'}
              {uploadProgress.status === 'error' && 'Failed'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${uploadProgress.status === 'error' ? 'bg-red-500' :
                  uploadProgress.status === 'complete' ? 'bg-green-500' :
                    uploadProgress.status === 'processing' ? 'bg-yellow-500' :
                      'bg-blue-500'
                }`}
              style={{ width: `${uploadProgress.progress}%` }}
            />
          </div>

          {uploadProgress.error && (
            <p className="mt-2 text-xs text-red-600">{uploadProgress.error}</p>
          )}
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="search"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-lg border border-zinc-200 bg-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <select
          value={filterFolder}
          onChange={(e) => setFilterFolder(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-w-[200px]"
        >
          <option value="all">All Notebooks</option>
          {accessibleFolders.map(f => (
            <option key={f.id} value={f.name}>{f.name}</option>
          ))}
        </select>
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
            <thead>
              <tr className="border-b border-black/5 bg-zinc-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Notebook</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Size</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Uploaded</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-zinc-500">
                    Loading documents...
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    {documents.length === 0 ? (
                      <div>
                        <p className="text-sm font-medium text-zinc-900">No documents yet</p>
                        <p className="text-xs text-zinc-500 mt-1">Upload your first document above</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-zinc-600">No documents match your search</p>
                        <button
                          onClick={() => { setSearchQuery(''); setFilterFolder('all'); }}
                          className="mt-2 text-xs text-indigo-600 hover:underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-zinc-900">{doc.name}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{doc.folderName}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{formatFileSize(doc.size)}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">{formatDate(doc.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                          title="Download"
                        >
                          <svg className="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          disabled={deletingDocId === doc.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingDocId === doc.id ? (
                            <svg className="h-4 w-4 text-zinc-600 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div >
    </div >
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


