"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/Modal";

export default function FolderPage() {
  const params = useParams<{ folderId: string }>();
  const { accessibleFolders, org } = useWorkspace();
  const [isDragOver, setIsDragOver] = useState(false);
  const [notes, setNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "">("");

  const folderId = params.folderId;
  const folder = accessibleFolders.find((f) => f.id === folderId);

  // Load notes from localStorage on mount
  useEffect(() => {
    if (folderId) {
      const savedNotes = localStorage.getItem(`folder-notes-${folderId}`);
      if (savedNotes) {
        setNotes(savedNotes);
      }
    }
  }, [folderId]);

  // Auto-save notes with debouncing
  useEffect(() => {
    if (!folderId) return;

    setSaveStatus("saving");
    const timeoutId = setTimeout(() => {
      localStorage.setItem(`folder-notes-${folderId}`, notes);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [notes, folderId]);

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    title: string;
    size: string;
    uploaded: string;
    type: string;
  }>>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string>("");

  // File upload handler
  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only PDF, DOCX, and PPTX files are supported");
      setTimeout(() => setUploadError(""), 3000);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setUploadError("File size must be less than 50MB");
      setTimeout(() => setUploadError(""), 3000);
      return;
    }

    // Simulate upload with progress
    setUploadProgress(0);
    setUploadError("");

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate async upload
    setTimeout(() => {
      const newFile = {
        id: Math.random().toString(36).substr(2, 9),
        title: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploaded: "Just now",
        type: file.name.split('.').pop()?.toUpperCase() || "FILE"
      };

      setUploadedFiles((prev) => [newFile, ...prev]);
      setUploadProgress(null);
    }, 2000);
  }, []);

  // Mock docs + uploaded files
  const docs = [
    ...uploadedFiles,
    { id: "1", title: "Q3 Financial Report.pdf", size: "2.4 MB", uploaded: "2h ago", type: "PDF" },
    { id: "2", title: "Project Alpha Specs.docx", size: "1.1 MB", uploaded: "5h ago", type: "DOC" },
  ];

  if (!folder) {
    return (
      <div className="rounded-[2rem] border border-black/5 bg-white/60 p-12 text-center shadow-sm backdrop-blur-xl">
        <h1 className="text-xl font-semibold text-zinc-950">Folder not found</h1>
        <p className="mt-2 text-zinc-600">You do not have access to this folder, or it does not exist.</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-full bg-zinc-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Folder management state
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [childFolders, setChildFolders] = useState<Array<{
    id: string;
    name: string;
    description: string;
  }>>([]);

  // Load child folders
  useEffect(() => {
    const children = accessibleFolders.filter(f => (f as any).parentId === folderId);
    setChildFolders(children.map(f => ({
      id: f.id,
      name: f.name,
      description: f.description || ""
    })));
  }, [folderId, accessibleFolders]);

  // Create folder handler
  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim()) return;

    const newFolder = {
      id: `fld_${Math.random().toString(36).substr(2, 9)}`,
      name: newFolderName.trim(),
      description: `Sub-folder of ${folder?.name}`
    };

    setChildFolders(prev => [newFolder, ...prev]);
    setNewFolderName("");
    setShowCreateFolder(false);
  }, [newFolderName, folder]);

  // Determine theme based on org (simulating personalization)
  const isStudent = org.name.includes("University");
  const coverGradient = isStudent
    ? "from-indigo-100 via-purple-50 to-white"
    : "from-zinc-100 via-zinc-50 to-white";

  return (
    <div className="space-y-6">
      {/* Top Row: Header (75%) + Quick Notes (25%) */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Header - 75% width, reduced height */}
        <div className={`lg:w-[75%] relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${coverGradient} border border-black/5 p-4 md:p-5 shadow-sm`}>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-black/40 mb-3">
            <span>{org.name.includes("University") ? "Classes" : "Workspace"}</span>
            <ChevronRightIcon className="h-3 w-3" />
            <span>{folder.teamIds[0].replace('team_', '').toUpperCase()}</span>
            <ChevronRightIcon className="h-3 w-3" />
            <span className="text-black/80">{folder.name}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">{folder.name}</h1>
              <p className="mt-1.5 text-sm text-zinc-600 max-w-xl line-clamp-1">
                {folder.description || "Collection of documents and resources."}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-zinc-500">
                <span className="flex items-center gap-1 bg-white/60 px-2 py-1 rounded-md border border-black/5">
                  <DocumentIcon className="h-3 w-3" /> {docs.length} files
                </span>
                <span className="flex items-center gap-1 bg-white/60 px-2 py-1 rounded-md border border-black/5">
                  Updated 2h ago
                </span>
              </div>
            </div>

            <Link
              href={`/dashboard/thea?folder=${folder.id}`}
              className="relative isolate overflow-hidden flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition transform active:scale-95"
            >
              {/* Animated gradient blobs background */}
              <div className="absolute inset-0 -z-10 bg-white motion-safe:animate-spin motion-safe:[animation-duration:20s]">
                <div className="absolute -top-[10%] -left-[10%] h-[70%] w-[70%] rounded-full bg-cyan-500 blur-md opacity-100" />
                <div className="absolute -bottom-[10%] -right-[10%] h-[70%] w-[70%] rounded-full bg-rose-500 blur-md opacity-100" />
                <div className="absolute -bottom-[5%] -left-[5%] h-[60%] w-[60%] rounded-full bg-amber-500 blur-md opacity-90" />
                <div className="absolute -top-[5%] -right-[5%] h-[60%] w-[60%] rounded-full bg-indigo-600 blur-md opacity-80" />
                <div className="absolute top-[20%] left-[30%] h-[50%] w-[50%] rounded-full bg-pink-500 blur-md opacity-70" />
              </div>
              <SparklesIcon className="h-4 w-4 text-white relative z-10" />
              <span className="relative z-10">Ask Thea</span>
            </Link>
          </div>
        </div>

        {/* Quick Notes - 25% width */}
        <div className="lg:w-[25%]">
          <div className="h-full rounded-[2rem] border border-yellow-200/50 bg-yellow-50/50 p-5 shadow-sm backdrop-blur-xl relative overflow-hidden group min-h-[140px]">
            <div className="absolute top-0 right-0 p-3 opacity-50">
              <NoteIcon className="h-20 w-20 text-yellow-500/10 rotate-12" />
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-yellow-900 flex items-center gap-2">
                  <PencilIcon className="h-4 w-4" /> Quick Notes
                </h3>
                {saveStatus && (
                  <span className="text-xs text-yellow-700 italic">
                    {saveStatus === "saving" ? "Saving..." : "Saved ✓"}
                  </span>
                )}
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Click to add a note or description for this folder..."
                className="flex-1 text-sm text-yellow-900 bg-transparent border-none outline-none resize-none placeholder:italic placeholder:text-yellow-900/60 focus:placeholder:text-yellow-900/40"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Documents & Upload */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFileUpload(e.dataTransfer.files);
            }}
            onClick={() => document.getElementById('file-upload')?.click()}
            className={`group relative flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed p-10 text-center transition-all duration-300 cursor-pointer ${isDragOver ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]" :
              uploadError ? "border-red-300 bg-red-50/50" :
                "border-zinc-200 bg-white/40 hover:border-zinc-300 hover:bg-white/60"
              }`}
          >
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.pptx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />

            {uploadProgress !== null ? (
              <>
                <div className="w-full max-w-xs">
                  <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-zinc-700">Uploading... {uploadProgress}%</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 group-hover:scale-110 transition">
                  <PlusIcon className="h-6 w-6 text-zinc-600" />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-zinc-900">
                    {uploadError || "Upload documents"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {uploadError ? "Please try again" : "PDF, DOCX, PPTX supported"}
                  </p>
                </div>
              </>
            )}
          </div>


          {/* Folders Section */}
          <div>
            <div className="flex items-center justify-between ml-2 mb-3">
              <h3 className="text-sm font-semibold text-zinc-900">Folders</h3>
              <button
                onClick={() => setShowCreateFolder(true)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition"
              >
                + New Folder
              </button>
            </div>
            {childFolders.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 mb-6">
                {childFolders.map(child => (
                  <Link
                    key={child.id}
                    href={`/dashboard/folders/${child.id}`}
                    className="group flex items-center gap-3 rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition"
                  >
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition">
                      <FolderIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-zinc-900 truncate">{child.name}</div>
                      <div className="text-[10px] text-zinc-500 truncate">{child.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-xs text-zinc-400 mb-6">
                No sub-folders. Click "+ New Folder" to create one.
              </div>
            )}
          </div>

          {/* File List */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 ml-2 mb-3">Files</h3>
            <div className="rounded-[2rem] border border-black/5 bg-white/70 shadow-sm backdrop-blur-xl overflow-hidden">
              {docs.length > 0 ? (
                <div className="divide-y divide-zinc-100">
                  {docs.map((doc, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 hover:bg-white/80 transition cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-black/5 shadow-sm text-xs font-bold uppercase tracking-wider text-zinc-500">
                          {doc.type}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">{doc.title}</div>
                          <div className="text-xs text-zinc-500 mt-0.5"> Added {doc.uploaded} • {doc.size}</div>
                        </div>
                      </div>
                      <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition">
                        <EllipsisIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-zinc-500 text-sm">No files uploaded yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Quick Widgets */}
        <div className="space-y-6">

          {/* Quick Links Widget */}
          <div className="rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <LinkIcon className="h-4 w-4" /> Quick Links
            </h3>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-black/5 hover:bg-white hover:shadow-sm transition group">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <span className="text-xs font-bold">Z</span>
                </div>
                <span className="text-sm text-zinc-700 font-medium group-hover:text-blue-600">Zoom Room</span>
                <ArrowUpRightIcon className="h-3 w-3 ml-auto text-zinc-400" />
              </a>
              <button className="w-full py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 border border-dashed border-zinc-300 rounded-xl hover:bg-white/50 transition">
                + Add Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      <Modal
        isOpen={showCreateFolder}
        onClose={() => {
          setShowCreateFolder(false);
          setNewFolderName("");
        }}
        title="Create New Folder"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
              }}
              placeholder="Enter folder name..."
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setShowCreateFolder(false);
                setNewFolderName("");
              }}
              className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Folder
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// --- Icons ---

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;
}

function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>;
}

function EllipsisIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>;
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
}

function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>;
}

function NoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3Zm-8.25 14.25a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75Zm4.5 0a.75.75 0 0 1-.75-.75v-8.25a.75.75 0 0 1 1.5 0v8.25a.75.75 0 0 1-.75.75Z" /></svg> // Simplified
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
}

function ArrowUpRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
}

