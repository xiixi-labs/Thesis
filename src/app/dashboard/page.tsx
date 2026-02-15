"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { TheaMark } from "@/components/TheaMark";
import { Modal } from "@/components/Modal";

export default function DashboardPage() {
  const router = useRouter();
  const { user, accessibleFolders, createNotebook } = useWorkspace();

  const [showCreateNotebook, setShowCreateNotebook] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState("");
  const [libraryQuery, setLibraryQuery] = useState("");

  // Document counts
  const [documentCount, setDocumentCount] = useState(0);
  const [folderDocCounts, setFolderDocCounts] = useState<Record<string, number>>({});
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  const handleCreateNotebook = useCallback(() => {
    if (!newNotebookName.trim()) return;
    const folder = createNotebook({
      name: newNotebookName.trim(),
      description: "Collection of documents, links, and notes.",
    });
    setNewNotebookName("");
    setShowCreateNotebook(false);
    router.push(`/dashboard/folders/${folder.id}`);
  }, [createNotebook, newNotebookName, router]);

  // Get time of day for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const filteredFolders = accessibleFolders.filter((f) => {
    const q = libraryQuery.trim().toLowerCase();
    if (!q) return true;
    return f.name.toLowerCase().includes(q);
  });

  // Fetch documents for counts
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoadingDocs(true);
      try {
        const res = await fetch("/api/documents", {
          headers: { "x-user-id": user.id },
        });
        if (res.ok) {
          const data = await res.json();
          const docs = data.documents || [];
          setDocumentCount(docs.length);

          // Calculate counts per folder
          const counts: Record<string, number> = {};
          docs.forEach((doc: { folderName: string }) => {
            const folder = accessibleFolders.find(f => f.name === doc.folderName);
            if (folder) {
              counts[folder.id] = (counts[folder.id] || 0) + 1;
            }
          });
          setFolderDocCounts(counts);
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setIsLoadingDocs(false);
      }
    };

    if (user.id) {
      fetchDocuments();
    }
  }, [user.id, accessibleFolders]);

  return (
    <div className="relative max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-0"
        style={{ animation: 'fade-in 0.8s ease-out 0.2s forwards' }}
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            {greeting}, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-base text-zinc-500">
            Your library is ready. Open a notebook or ask Thea about something you are learning.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-3 py-1.5 bg-white/70 backdrop-blur-xl text-zinc-600 rounded-full border border-black/10 shadow-sm">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Hero Section: Primary Action & Stats */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-0"
        style={{ animation: 'slide-up 0.9s ease-out 0.4s forwards' }}
      >
        {/* Main Action: Ask Thea (Spans 2 columns) - Futuristic AI Glassmorphism */}
        <Link
          href="/dashboard/thea"
          className="group relative isolate lg:col-span-2 overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 shadow-md backdrop-blur-3xl transition-all hover:shadow-lg hover:scale-[1.002]"
        >
          <div className="relative z-20 flex h-full flex-col justify-between p-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Ask Thea anything.
              </h2>
              <p className="mt-2 text-zinc-600 max-w-md font-medium">
                Ask questions about your documents, get explanations and summaries, and explore ideas grounded in your own sources.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-end">
              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all group-hover:bg-zinc-800 group-hover:shadow-lg">
                <span>Ask Thea</span>
                <ArrowRightIcon className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Thea Mark (neutral, subtle) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 right-6 z-10 opacity-25 drop-shadow-xl transition duration-500 group-hover:opacity-40 group-hover:scale-110"
          >
            <TheaMark className="h-32 w-32 text-zinc-950/90" />
          </div>
        </Link>

        {/* Side Column: Quick Stats / Secondary Actions */}
        <div className="flex flex-col gap-4">
          {/* Upload Card */}
          <Link
            href="/dashboard/documents"
            className="group flex-1 relative overflow-hidden rounded-2xl border border-black/10 bg-white/75 backdrop-blur-3xl p-6 shadow-md transition-all hover:shadow-lg hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold text-zinc-900">Upload</div>
                <p className="text-sm text-zinc-500">Add PDFs to your library</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition">
                <UploadIcon className="h-5 w-5 text-zinc-600" />
              </div>
            </div>
          </Link>

          {/* Mini Stats Grid */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/75 border border-black/10 p-5 flex flex-col justify-center items-center text-center shadow-md backdrop-blur-3xl hover:shadow-lg transition-all">
              <span className="text-3xl font-bold text-zinc-900">{accessibleFolders.length}</span>
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Notebooks</span>
            </div>
            <div className="rounded-2xl bg-white/75 border border-black/10 p-5 flex flex-col justify-center items-center text-center shadow-md backdrop-blur-3xl hover:shadow-lg transition-all">
              <span className="text-3xl font-bold text-zinc-900">{isLoadingDocs ? "..." : documentCount}</span>
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Documents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Folders & Activity */}
      <div
        className="opacity-0"
        style={{ animation: 'fade-in 0.8s ease-out 0.7s forwards' }}
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">My Library</h2>
            <p className="mt-1 text-sm text-zinc-500">Your notebooks and saved sources.</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={libraryQuery}
              onChange={(e) => setLibraryQuery(e.target.value)}
              placeholder="Search notebooks"
              className="w-full sm:w-64 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>
        </div>


        {accessibleFolders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-white/40 backdrop-blur-xl p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2-456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">
              Welcome to Thesis! 🎉
            </h3>
            <p className="text-sm text-zinc-600 max-w-md mx-auto mb-6">
              Create your first notebook to organize documents and start chatting with Thea about your sources.
            </p>
            <button
              onClick={() => setShowCreateNotebook(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-full hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Your First Notebook
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFolders.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-zinc-200 bg-white/40 p-8 text-center">
                <div className="text-sm font-semibold text-zinc-900">No notebooks found</div>
                <div className="mt-1 text-sm text-zinc-500">Try a different search.</div>
              </div>
            ) : null}

            {filteredFolders.map((f) => (
              <Link
                key={f.id}
                href={`/dashboard/folders/${f.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/10 bg-white/75 backdrop-blur-3xl p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
              >
                <div>
                  <div className="flex items-start justify-between">
                    {/* Neutral Icon Tile (no purple outline) */}
                    <div className="relative h-14 w-14 rounded-2xl border border-black/10 bg-white/70 shadow-sm backdrop-blur-xl group-hover:bg-white transition-colors">
                      <div className="h-full w-full rounded-2xl bg-zinc-100/80 flex items-center justify-center">
                        <FolderIcon className="h-7 w-7 text-zinc-600" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="text-lg font-semibold text-zinc-900 group-hover:text-zinc-950 transition-colors">{f.name}</div>
                    <div className="mt-1 line-clamp-2 text-sm text-zinc-500">
                      {f.description ?? "Collection of documents, links, and notes."}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    {folderDocCounts[f.id] || 0} {(folderDocCounts[f.id] || 0) === 1 ? 'document' : 'documents'}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-zinc-600 transition-colors group-hover:text-zinc-900">
                    Open notebook <ArrowRightIcon className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}

            {/* Add New Notebook Ghost Card */}
            <button
              onClick={() => setShowCreateNotebook(true)}
              className="group flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-zinc-200 bg-transparent p-6 text-center hover:border-zinc-300 hover:bg-zinc-50/50 transition"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-400 group-hover:bg-white group-hover:shadow-sm transition">
                <span className="text-xl">+</span>
              </div>
              <span className="mt-3 text-sm font-medium text-zinc-600">Create new notebook</span>
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreateNotebook}
        onClose={() => {
          setShowCreateNotebook(false);
          setNewNotebookName("");
        }}
        title="Create notebook"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Notebook name</label>
            <input
              type="text"
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateNotebook();
              }}
              placeholder="e.g. Cognitive science"
              className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setShowCreateNotebook(false);
                setNewNotebookName("");
              }}
              className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNotebook}
              disabled={!newNotebookName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
  );
}


