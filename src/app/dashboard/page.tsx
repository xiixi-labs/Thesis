"use client";

import Link from "next/link";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { TheaMark } from "@/components/TheaMark";

export default function DashboardPage() {
  const { user, accessibleFolders, userTeams, teamsInOrg } = useWorkspace();

  const teamsCount = user.role === "admin" ? teamsInOrg.length : userTeams.length;
  const docsCount = 12; // Placeholder or derived if available

  // Get time of day for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            {greeting}, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-base text-zinc-500">
            Ready to research? Your knowledge base is active.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full border border-black/5">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <div className="rounded-full border border-teal-200 bg-teal-50 text-teal-700 px-3 py-1 text-xs font-medium shadow-sm">
            {user.role === "admin" ? "Admin Workspace" : "Member Workspace"}
          </div>
        </div>
      </div>

      {/* Hero Section: Primary Action & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Action: Ask Thea (Spans 2 columns) */}
        <Link
          href="/dashboard/thea"
          className="group relative lg:col-span-2 overflow-hidden rounded-[2rem] bg-zinc-900 p-8 shadow-xl transition hover:shadow-2xl hover:scale-[1.005]"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black" />
          <div className="absolute right-[-10%] top-[-20%] h-[300px] w-[300px] rounded-full bg-indigo-500/20 blur-[80px] transition group-hover:bg-indigo-500/30" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[200px] w-[200px] rounded-full bg-fuchsia-500/10 blur-[60px] transition group-hover:bg-fuchsia-500/20" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md">
                <SparklesIcon className="h-3 w-3" />
                <span>AI Research Assistant</span>
              </div>
              <h2 className="mt-4 text-3xl font-semibold text-white">Ask Thea anything.</h2>
              <p className="mt-2 text-zinc-400 max-w-md">
                Synthesize answers from your {docsCount} documents, generate summaries, or draft content with cited sources.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center -space-x-3">
                {/* Fake "Recent Users" piles or just placeholder avatars */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-950 shadow-lg group-hover:bg-indigo-50 group-hover:scale-110 transition">
                <ArrowRightIcon className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Giant Thea Mark Decoration */}
          <div className="absolute right-6 bottom-6 opacity-20 grayscale transition group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 duration-500">
            <TheaMark className="h-32 w-32" />
          </div>
        </Link>

        {/* Side Column: Quick Stats / Secondary Actions */}
        <div className="flex flex-col gap-4">
          {/* Upload Card */}
          <Link
            href="/dashboard/documents"
            className="group flex-1 relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-xl transition hover:bg-white/80"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold text-zinc-900">Upload</div>
                <p className="text-sm text-zinc-500">Add PDFs to your knowledge base</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition">
                <UploadIcon className="h-5 w-5 text-zinc-600" />
              </div>
            </div>
            <div className="mt-8">
              <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                <div className="h-full bg-emerald-500 w-[65%]" />
              </div>
              <div className="mt-2 flex justify-between text-xs text-zinc-400">
                <span>Storage used</span>
                <span>65%</span>
              </div>
            </div>
          </Link>

          {/* Mini Stats Grid */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="rounded-[1.5rem] bg-white/50 border border-black/5 p-4 flex flex-col justify-center items-center text-center shadow-sm backdrop-blur-md">
              <span className="text-2xl font-semibold text-zinc-900">{accessibleFolders.length}</span>
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Folders</span>
            </div>
            <div className="rounded-[1.5rem] bg-white/50 border border-black/5 p-4 flex flex-col justify-center items-center text-center shadow-sm backdrop-blur-md">
              <span className="text-2xl font-semibold text-zinc-900">{teamsCount}</span>
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Teams</span>
            </div>
          </div>
        </div>
      </div>

      {/* Folders & Activity */}
      <div>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-semibold text-zinc-950">Your Knowledge Base</h2>
          <Link href="/dashboard/teams" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition">
            View all teams →
          </Link>
        </div>

        {accessibleFolders.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-zinc-300 p-12 text-center bg-white/30">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
              <FolderIcon className="h-6 w-6 text-zinc-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-zinc-900">No folders configured</h3>
            <p className="mt-1 text-sm text-zinc-500">Join a team or create a folder to start uploading.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accessibleFolders.map((f) => (
              <Link
                key={f.id}
                href={`/dashboard/folders/${f.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-xl transition hover:shadow-md hover:bg-white/90"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-black/5 text-indigo-600 group-hover:scale-105 transition-transform">
                      <FolderIcon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      {f.teamIds[0].replace('team_', '')}
                    </span>
                  </div>
                  <div className="mt-6">
                    <div className="text-lg font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">{f.name}</div>
                    <div className="mt-1 line-clamp-2 text-sm text-zinc-500">
                      {f.description ?? "Team documents and knowledge base."}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2].map(i => (
                      <div key={i} className="h-6 w-6 rounded-full ring-2 ring-white bg-zinc-200" />
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Documents <ArrowRightIcon className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}

            {/* Add New Folder Ghost Card */}
            <button className="group flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-zinc-200 bg-transparent p-6 text-center hover:border-zinc-300 hover:bg-zinc-50/50 transition">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-400 group-hover:bg-white group-hover:shadow-sm transition">
                <span className="text-xl">+</span>
              </div>
              <span className="mt-3 text-sm font-medium text-zinc-600">Create new folder</span>
            </button>
          </div>
        )}
      </div>
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

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
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


