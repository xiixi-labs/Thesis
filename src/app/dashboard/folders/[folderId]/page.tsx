"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Modal } from "@/components/Modal";
import { getFolderNotes, saveFolderNotes } from "@/lib/supabase/notes";
import { downloadFile, getFolderFiles, uploadFile } from "@/lib/supabase/files";

type QuickLink = {
  id: string;
  title: string;
  url: string;
};

const QUICK_LINKS_STORAGE_PREFIX = "thesis.quickLinks.v1.";

type UploadedDoc = {
  id: string;
  title: string;
  size: string;
  uploaded: string;
  type: string;
  url: string | null;
  storagePath: string;
};

function prettyDocType(raw: string): string {
  const t = (raw || "").toUpperCase();
  if (t.includes("PDF")) return "PDF";
  if (t.includes("WORD") || t.includes("DOCX")) return "DOCX";
  if (t.includes("PRESENTATION") || t.includes("PPTX")) return "PPTX";
  if (t.length <= 8 && /^[A-Z0-9]+$/.test(t)) return t;
  return "FILE";
}

function safeParseQuickLinks(raw: string | null): QuickLink[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is QuickLink => {
      if (!x || typeof x !== "object") return false;
      const obj = x as Record<string, unknown>;
      return typeof obj.id === "string" && typeof obj.title === "string" && typeof obj.url === "string";
    });
  } catch {
    return [];
  }
}

function makeQuickLinkId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `lnk_${crypto.randomUUID()}`;
  return `lnk_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const asIs = new URL(trimmed);
    return asIs.toString();
  } catch {
    try {
      const withHttps = new URL(`https://${trimmed}`);
      return withHttps.toString();
    } catch {
      return null;
    }
  }
}

function safeUrlHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default function FolderPage() {
  const params = useParams<{ folderId: string }>();
  const router = useRouter();
  const { accessibleFolders, createNotebook } = useWorkspace();
  const { getToken } = useAuth();
  const [isDragOver, setIsDragOver] = useState(false);
  const [notes, setNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "">("");
  const clearSaveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const folderId = params.folderId;
  const folder = accessibleFolders.find((f) => f.id === folderId);

  // Quick links (client-side persistence)
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const normalizedNewLinkUrl = useMemo(() => normalizeUrl(newLinkUrl), [newLinkUrl]);

  useEffect(() => {
    if (!folderId) return;
    Promise.resolve().then(() => {
      const raw = localStorage.getItem(`${QUICK_LINKS_STORAGE_PREFIX}${folderId}`);
      setQuickLinks(safeParseQuickLinks(raw));
    });
  }, [folderId]);

  useEffect(() => {
    if (!folderId) return;
    localStorage.setItem(`${QUICK_LINKS_STORAGE_PREFIX}${folderId}`, JSON.stringify(quickLinks));
  }, [folderId, quickLinks]);

  const handleAddLink = useCallback(() => {
    const url = normalizeUrl(newLinkUrl);
    if (!url) return;

    const title = newLinkTitle.trim() || new URL(url).host;
    const created: QuickLink = { id: makeQuickLinkId(), title, url };
    setQuickLinks((prev) => [created, ...prev]);
    setShowAddLink(false);
    setNewLinkTitle("");
    setNewLinkUrl("");
  }, [newLinkTitle, newLinkUrl]);

  const handleRemoveLink = useCallback((id: string) => {
    setQuickLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  // Load notes from Supabase on mount
  useEffect(() => {
    async function loadNotes() {
      if (!folderId) return;
      try {
        const token = await getToken({ template: "supabase" });
        const content = await getFolderNotes(folderId, token || undefined);
        if (content) setNotes(content);
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    }
    loadNotes();
  }, [folderId, getToken]);

  // Auto-save notes to Supabase with debouncing
  useEffect(() => {
    if (!folderId) return;

    if (clearSaveStatusTimeoutRef.current) {
      clearTimeout(clearSaveStatusTimeoutRef.current);
      clearSaveStatusTimeoutRef.current = null;
    }

    const timeoutId = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const token = await getToken({ template: "supabase" });
        await saveFolderNotes(folderId, notes, token || undefined);
        setSaveStatus("saved");
        clearSaveStatusTimeoutRef.current = setTimeout(() => setSaveStatus(""), 2000);
      } catch (error) {
        console.error("Error saving notes:", error);
        setSaveStatus("");
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [notes, folderId]);

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDoc[]>([]);
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

    setUploadProgress(0);
    setUploadError("");

    try {
      // Upload to Supabase Storage
      const token = await getToken({ template: "supabase" });
      const fileRecord = await uploadFile(folderId!, file, (progress) => {
        setUploadProgress(progress);
      }, token || undefined);

      // Transform record for display
      const newFile = {
        id: fileRecord.id,
        title: fileRecord.name,
        size: `${(fileRecord.size / (1024 * 1024)).toFixed(1)} MB`,
        uploaded: 'Just now',
        type: fileRecord.type,
        url: fileRecord.url,
        storagePath: fileRecord.storage_path
      };

      setUploadedFiles((prev) => [newFile, ...prev]);
      setUploadProgress(null);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError("Upload failed. Please try again.");
      setUploadProgress(null);
    }
  }, [folderId, getToken]);

  // Load files from Supabase
  useEffect(() => {
    async function loadFiles() {
      if (!folderId) return;
      try {
        const token = await getToken({ template: "supabase" });
        const files = await getFolderFiles(folderId, token || undefined);
        setUploadedFiles(files.map(f => ({
          id: f.id,
          title: f.name,
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
          uploaded: new Date(f.uploaded_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          type: f.type,
          url: f.url,
          storagePath: f.storage_path
        })));
      } catch (error) {
        console.error("Error loading files:", error);
      }
    }
    loadFiles();
  }, [folderId, getToken]);


  // Combined docs list (only uploaded files for now)
  const docs = uploadedFiles;

  const handleOpenDoc = useCallback(
    async (doc: UploadedDoc) => {
      if (doc.url) {
        window.open(doc.url, "_blank", "noopener,noreferrer");
        return;
      }

      if (!doc.storagePath) return;

      try {
        const token = await getToken({ template: "supabase" });
        const blob = await downloadFile(doc.storagePath, token || undefined);
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, "_blank", "noopener,noreferrer");
        // Best-effort cleanup after the browser has had time to load
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      } catch (error) {
        console.error("Open file error:", error);
        setUploadError("Could not open file. Please try again.");
        setTimeout(() => setUploadError(""), 3000);
      }
    },
    [getToken]
  );

  // Folder management state
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const existingChildFolders = useMemo(() => {
    return accessibleFolders
      .filter((f) => f.parentId === folderId)
      .map((f) => ({
        id: f.id,
        name: f.name,
        description: f.description || "",
      }));
  }, [accessibleFolders, folderId]);

  const childFolders = existingChildFolders;

  // Create folder handler
  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim()) return;
    const created = createNotebook({
      name: newFolderName.trim(),
      description: `Sub-notebook of ${folder?.name ?? "Notebook"}`,
      parentId: folderId,
    });

    setNewFolderName("");
    setShowCreateFolder(false);
    router.push(`/dashboard/folders/${created.id}`);
  }, [createNotebook, folder?.name, folderId, newFolderName, router]);

  if (!folder) {
    return (
      <div className="rounded-[2rem] border border-black/5 bg-white/60 p-12 text-center shadow-sm backdrop-blur-xl">
        <h1 className="text-xl font-semibold text-zinc-950">Notebook not found</h1>
        <p className="mt-2 text-zinc-600">You do not have access to this notebook, or it does not exist.</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-full bg-zinc-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Header */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-md backdrop-blur-3xl p-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-4 overflow-x-auto scrollbar-hide">
            <span className="whitespace-nowrap">My Library</span>
            <ChevronRightIcon className="h-3 w-3 flex-shrink-0 text-zinc-400" />
            <span className="text-zinc-900 whitespace-nowrap">{folder.name}</span>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-950">{folder.name}</h1>
              <p className="mt-2 text-sm text-zinc-600 max-w-2xl">
                {folder.description || "Collection of documents, links, and notes."}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-zinc-500">
                <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/70 px-3 py-1 shadow-sm backdrop-blur-xl">
                  <DocumentIcon className="h-3 w-3" /> {docs.length} documents
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
              <Link
                href={`/dashboard/thea?folder=${folder.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-zinc-800 active:scale-[0.98] w-full sm:w-auto min-h-[44px]"
              >
                <span>Ask Thea</span>
                <ArrowUpRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-[2rem] border border-black/10 bg-white/60 shadow-md backdrop-blur-3xl p-6 relative overflow-hidden min-h-[180px]">
          <div className="absolute top-0 right-0 p-4 opacity-40">
            <NoteIcon className="h-20 w-20 text-zinc-950/10 rotate-12" />
          </div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <PencilIcon className="h-4 w-4 text-zinc-600" /> Notes
              </h3>
              {saveStatus && (
                <span className="text-xs text-zinc-500">
                  {saveStatus === "saving" ? "Saving…" : "Saved"}
                </span>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes for this notebook…"
              className="flex-1 text-sm text-zinc-900 bg-transparent border-none outline-none resize-none placeholder:text-zinc-400 min-h-[120px]"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Documents & Upload */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload */}
          <div className="rounded-[2rem] border border-black/10 bg-white/60 shadow-md backdrop-blur-3xl p-6">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => document.getElementById("file-upload")?.click()}
              className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer min-h-[140px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 ${isDragOver
                ? "border-zinc-400 bg-white/70"
                : uploadError
                  ? "border-rose-300 bg-rose-50/50"
                  : "border-zinc-200 bg-white/40 hover:border-zinc-300 hover:bg-white/60"
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
                <div className="w-full max-w-xs">
                  <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-zinc-700">Uploading… {uploadProgress}%</p>
                </div>
              ) : (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 group-hover:shadow-md transition">
                    <PlusIcon className="h-6 w-6 text-zinc-600" />
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-zinc-900">{uploadError || "Upload documents"}</p>
                    <p className="text-xs text-zinc-500 mt-1">{uploadError ? "Please try again" : "PDF, DOCX, PPTX supported"}</p>
                  </div>
                </>
              )}
            </div>
          </div>


          {/* Sub-notebooks */}
          <div className="rounded-[2rem] border border-black/10 bg-white/60 shadow-md backdrop-blur-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-900">Sub-notebooks</h3>
              <button
                type="button"
                onClick={() => setShowCreateFolder(true)}
                className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur-xl hover:bg-white hover:text-zinc-900 transition"
              >
                + New
              </button>
            </div>
            {childFolders.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {childFolders.map((child) => (
                  <Link
                    key={child.id}
                    href={`/dashboard/folders/${child.id}`}
                    className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm hover:shadow-md hover:bg-white transition"
                  >
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 group-hover:bg-zinc-200 transition">
                      <FolderIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-zinc-900 truncate">{child.name}</div>
                      <div className="text-[11px] text-zinc-500 truncate">{child.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/40 p-8 text-center">
                <div className="text-sm font-semibold text-zinc-900">No sub-notebooks yet</div>
                <div className="mt-1 text-sm text-zinc-500">Create one to keep this topic organized.</div>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="rounded-[2rem] border border-black/10 bg-white/60 shadow-md backdrop-blur-3xl overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900">Documents</h3>
              <div className="text-xs text-zinc-500">{docs.length}</div>
            </div>
            {docs.length > 0 ? (
              <div className="divide-y divide-black/5">
                {docs.map((doc) => {
                  const content = (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-black/10 shadow-sm text-xs font-bold uppercase tracking-wider text-zinc-500">
                          {prettyDocType(doc.type)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-zinc-900 truncate">{doc.title}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">Added {doc.uploaded} • {doc.size}</div>
                        </div>
                      </div>
                      <ArrowUpRightIcon className="h-4 w-4 text-zinc-400 group-hover:text-zinc-700 transition" />
                    </>
                  );

                  const rowClassName =
                    "group flex items-center justify-between gap-4 px-6 py-4 hover:bg-white/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:ring-inset";

                  if (doc.url) {
                    return (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className={rowClassName}
                        title="Open document"
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => handleOpenDoc(doc)}
                      className={`${rowClassName} text-left w-full`}
                      title="Open document"
                    >
                      {content}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 text-center">
                <div className="text-sm font-semibold text-zinc-900">No documents yet</div>
                <div className="mt-1 text-sm text-zinc-500">Upload a file to start building this notebook.</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Quick Widgets */}
        <div className="space-y-6">

          {/* Quick Links Widget */}
          <div className="rounded-[2rem] border border-black/10 bg-white/60 p-6 shadow-md backdrop-blur-3xl">
            <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <LinkIcon className="h-4 w-4" /> Quick Links
            </h3>
            <div className="space-y-2">
              {quickLinks.length > 0 ? (
                quickLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-black/5 hover:bg-white hover:shadow-sm transition group"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 flex-1 min-w-0"
                      title={link.url}
                    >
                      <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                        <span className="text-xs font-bold">{(link.title || "L").slice(0, 1).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-zinc-700 font-medium truncate group-hover:text-zinc-900">{link.title}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{safeUrlHost(link.url)}</div>
                      </div>
                      <ArrowUpRightIcon className="h-3 w-3 ml-auto text-zinc-400 shrink-0" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link.id)}
                      className="text-[10px] font-medium text-zinc-400 hover:text-zinc-900 px-2 py-1 rounded-lg hover:bg-zinc-100 transition"
                      aria-label={`Remove ${link.title}`}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-center text-xs text-zinc-500 bg-white/30">
                  No links yet.
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowAddLink(true)}
                className="w-full py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 border border-dashed border-zinc-300 rounded-xl hover:bg-white/50 transition"
              >
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
        title="Create new notebook"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Notebook name
            </label>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
              }}
              placeholder="Enter notebook name..."
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300"
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
              className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create notebook
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Link Modal */}
      <Modal
        isOpen={showAddLink}
        onClose={() => {
          setShowAddLink(false);
          setNewLinkTitle("");
          setNewLinkUrl("");
        }}
        title="Add link"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">URL</label>
            <input
              type="text"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && normalizedNewLinkUrl) handleAddLink();
              }}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300"
              autoFocus
            />
            {newLinkUrl.trim() && !normalizedNewLinkUrl && (
              <div className="mt-2 text-xs text-rose-600">Please enter a valid URL.</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Title (optional)</label>
            <input
              type="text"
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && normalizedNewLinkUrl) handleAddLink();
              }}
              placeholder="e.g. Lecture notes"
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300"
            />
            <div className="mt-2 text-[11px] text-zinc-500">If you leave this blank, we’ll use the site name.</div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowAddLink(false);
                setNewLinkTitle("");
                setNewLinkUrl("");
              }}
              className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddLink}
              disabled={!normalizedNewLinkUrl}
              className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add link
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

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
}

function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>;
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

