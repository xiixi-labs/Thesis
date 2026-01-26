"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LogoMark } from "@/components/LogoMark";
import {
  WorkspaceProvider,
  useWorkspace,
} from "@/components/workspace/WorkspaceProvider";
import { UserDropdown } from "@/components/UserDropdown";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceProvider>
      <DashboardShell>{children}</DashboardShell>
    </WorkspaceProvider>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    org,
    user,
    personas,
    activeUserId,
    setActiveUserId,
    teamsInOrg,
    userTeams,
    accessibleFolders,
    activeTeamId,
    setActiveTeamId,
    activeFolderId,
    setActiveFolderId,
  } = useWorkspace();

  const teamsToShow = useMemo(() => {
    if (user.role === "admin") return teamsInOrg;
    return userTeams;
  }, [teamsInOrg, user.role, userTeams]);

  useEffect(() => {
    const match = pathname.match(/^\/dashboard\/folders\/([^/]+)/);
    if (match?.[1]) setActiveFolderId(match[1]);
  }, [pathname, setActiveFolderId]);

  const topTitle = useMemo(() => {
    if (pathname === "/dashboard") return "Home";
    if (pathname.startsWith("/dashboard/thea")) return "Thea";
    if (pathname.startsWith("/dashboard/documents")) return "Documents";
    if (pathname.startsWith("/dashboard/teams")) return "Teams";
    if (pathname.startsWith("/dashboard/folders")) return "Folders";
    if (pathname.startsWith("/dashboard/settings")) return "Settings";
    return "Workspace";
  }, [pathname]);

  const teamLabel = org.name.includes("University") ? "Classes" : "Teams";

  const ShellSidebar = (
    <aside className="flex h-full w-[18rem] flex-col border-r border-black/5 bg-white/70 backdrop-blur-xl">
      <div className="flex items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-4 transition-opacity hover:opacity-80">
          <LogoMark className="h-7 w-7" gradientId="appShellLogo" />
          <div className="relative z-10 leading-tight">
            <div className="text-base font-semibold tracking-tight text-zinc-950">Thesis</div>
            <div className="text-xs text-zinc-500">{org.name}</div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="md:hidden rounded-lg border border-black/10 bg-white/70 px-2 py-1 text-xs text-zinc-700"
        >
          Close
        </button>
      </div>

      {/* Persona switcher (temporary) */}
      <div className="px-5 pb-4">
        <div className="text-[11px] font-medium text-zinc-500">Viewing as</div>
        <select
          value={activeUserId}
          onChange={(e) => {
            setActiveUserId(e.target.value);
            setActiveTeamId(null);
            setActiveFolderId(null);
          }}
          className="mt-2 w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm text-zinc-900 shadow-sm"
        >
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Teams/Classes */}
      <div className="px-2">
        <div className="px-3 text-[11px] font-medium uppercase tracking-wide text-zinc-500">{teamLabel}</div>
        <div className="mt-2 space-y-1">
          <button
            type="button"
            onClick={() => setActiveTeamId(null)}
            className={navRowClass(activeTeamId === null)}
          >
            <span className="text-sm">All {teamLabel.toLowerCase()}</span>
          </button>
          {teamsToShow.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTeamId(t.id)}
              className={navRowClass(activeTeamId === t.id)}
            >
              <span className="text-sm">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Folders */}
      <div className="mt-6 px-2">
        <div className="px-3 text-[11px] font-medium uppercase tracking-wide text-zinc-500">Folders</div>
        <div className="mt-2 space-y-1">
          {accessibleFolders.length === 0 ? (
            <div className="px-3 py-2 text-sm text-zinc-500">No folders available.</div>
          ) : (
            accessibleFolders.map((f) => (
              <Link
                key={f.id}
                href={`/dashboard/folders/${f.id}`}
                onClick={() => {
                  setActiveFolderId(f.id);
                  setMobileOpen(false);
                }}
                className={navRowClass(activeFolderId === f.id)}
              >
                <div className="flex items-center gap-2">
                  <FolderIcon className={`h-4 w-4 ${activeFolderId === f.id ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-900"}`} />
                  <span className="text-sm font-medium">{f.name}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Primary nav */}
      <div className="mt-6 px-2">
        <div className="px-3 text-[11px] font-medium uppercase tracking-wide text-zinc-500">Workspace</div>
        <div className="mt-2 space-y-1">
          <Link href="/dashboard" className={navRowClass(pathname === "/dashboard")}>
            <div className="flex items-center gap-2">
              <HomeIcon className={`h-4 w-4 ${pathname === "/dashboard" ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-900"}`} />
              <span className="text-sm font-medium">Home</span>
            </div>
          </Link>
          <Link href="/dashboard/thea" className={navRowClass(pathname.startsWith("/dashboard/thea"))}>
            <div className="flex items-center gap-2">
              <SparklesIcon className={`h-4 w-4 ${pathname.startsWith("/dashboard/thea") ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-900"}`} />
              <span className="text-sm font-medium">Thea</span>
            </div>
          </Link>
          <Link href="/dashboard/documents" className={navRowClass(pathname.startsWith("/dashboard/documents"))}>
            <div className="flex items-center gap-2">
              <DocumentIcon className={`h-4 w-4 ${pathname.startsWith("/dashboard/documents") ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-900"}`} />
              <span className="text-sm font-medium">Documents</span>
            </div>
          </Link>
          <Link href="/dashboard/teams" className={navRowClass(pathname.startsWith("/dashboard/teams"))}>
            <div className="flex items-center gap-2">
              <UsersIcon className={`h-4 w-4 ${pathname.startsWith("/dashboard/teams") ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-900"}`} />
              <span className="text-sm font-medium">{teamLabel}</span>
            </div>
          </Link>
          <Link href="/dashboard/settings" className={navRowClass(pathname.startsWith("/dashboard/settings"))}>
            <div className="flex items-center gap-2">
              <CogIcon className={`h-4 w-4 ${pathname.startsWith("/dashboard/settings") ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-900"}`} />
              <span className="text-sm font-medium">Settings</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-auto border-t border-black/5 px-5 py-4">
        <div className="text-xs text-zinc-500">Signed in as</div>
        <div className="mt-1 text-sm font-medium text-zinc-900">{user.name}</div>
        <div className="mt-1 text-xs text-zinc-500">{user.role}</div>
      </div>
    </aside>
  );

  return (
    <div className="relative min-h-screen bg-[#f8f9fc] text-zinc-900">
      {/* Background Ambience & Noise */}
      <div className="fixed inset-0 z-0 bg-[#f8f9fc]" />
      <div className="fixed inset-0 z-0 opacity-[0.15] bg-[radial-gradient(#a1a1aa_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Dynamic Gradients */}
      <div className="pointer-events-none fixed top-[-20%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] h-[50vh] w-[50vw] rounded-full bg-fuchsia-500/10 blur-[100px]" />
      <div className="pointer-events-none fixed top-[10%] right-[-10%] h-[40vh] w-[40vw] rounded-full bg-orange-500/10 blur-[90px]" />
      <div className="pointer-events-none fixed bottom-[10%] left-[-10%] h-[40vh] w-[40vw] rounded-full bg-cyan-500/10 blur-[90px]" />

      <div className="relative z-10 flex min-h-screen">
        {/* Desktop sidebar - Cleaner aesthetic */}
        <div className="hidden md:block">
          <aside className="sticky top-0 flex h-screen w-[18rem] flex-col border-r border-black/5 bg-white/50 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-5">
              <Link href="/" className="flex items-center gap-4 transition-opacity hover:opacity-80">
                <LogoMark className="h-7 w-7" gradientId="appShellLogo" />
                <div className="relative z-10 leading-tight">
                  <div className="text-base font-semibold tracking-tight text-zinc-950">Thesis</div>
                  <div className="text-xs text-zinc-500 font-medium">{org.name}</div>
                </div>
              </Link>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-zinc-200/50" />

            {/* Persona switcher */}
            <div className="px-6 py-6">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Viewing as</div>
              <div className="group relative mt-2">
                <select
                  value={activeUserId}
                  onChange={(e) => {
                    setActiveUserId(e.target.value);
                    setActiveTeamId(null);
                    setActiveFolderId(null);
                  }}
                  className="w-full appearance-none rounded-xl border border-black/5 bg-white px-3 py-2.5 text-sm font-medium text-zinc-700 shadow-sm outline-none ring-1 ring-transparent transition hover:border-zinc-300 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
                >
                  {personas.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1" /></svg>
                </div>
              </div>
            </div>

            {/* Scrollable Nav Area */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-zinc-200 hover:scrollbar-thumb-zinc-300">
              {/* Teams/Classes */}
              <div className="mb-8">
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{teamLabel}</div>
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => setActiveTeamId(null)}
                    className={navRowClass(activeTeamId === null)}
                  >
                    <span className="text-sm font-medium">All {teamLabel.toLowerCase()}</span>
                  </button>
                  {teamsToShow.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTeamId(t.id)}
                      className={navRowClass(activeTeamId === t.id)}
                    >
                      <span className="text-sm font-medium truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Folders */}
              <div className="mb-8">
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Folders</div>
                <div className="space-y-0.5">
                  {accessibleFolders.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-zinc-400 italic">No folders available.</div>
                  ) : (
                    accessibleFolders.map((f) => (
                      <Link
                        key={f.id}
                        href={`/dashboard/folders/${f.id}`}
                        onClick={() => setActiveFolderId(f.id)}
                        className={navRowClass(activeFolderId === f.id)}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FolderIcon className={`h-4 w-4 flex-shrink-0 ${activeFolderId === f.id ? "text-indigo-600" : "text-zinc-400"}`} />
                          <span className="text-sm font-medium truncate">{f.name}</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Primary nav - Workspace */}
              <div className="mb-8">
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Workspace</div>
                <div className="space-y-0.5">
                  <Link href="/dashboard" className={navRowClass(pathname === "/dashboard")}>
                    <div className="flex items-center gap-2.5">
                      <HomeIcon className={`h-4 w-4 ${pathname === "/dashboard" ? "text-indigo-600" : "text-zinc-400"}`} />
                      <span className="text-sm font-medium">Home</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/thea" className={navRowClass(pathname.startsWith("/dashboard/thea"))}>
                    <div className="flex items-center gap-2.5">
                      <SparklesIcon className={`h-4 w-4 ${pathname.startsWith("/dashboard/thea") ? "text-fuchsia-600" : "text-zinc-400"}`} />
                      <span className="text-sm font-medium">Thea</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/documents" className={navRowClass(pathname.startsWith("/dashboard/documents"))}>
                    <div className="flex items-center gap-2.5">
                      <DocumentIcon className={`h-4 w-4 ${pathname.startsWith("/dashboard/documents") ? "text-indigo-600" : "text-zinc-400"}`} />
                      <span className="text-sm font-medium">Documents</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/teams" className={navRowClass(pathname.startsWith("/dashboard/teams"))}>
                    <div className="flex items-center gap-2.5">
                      <UsersIcon className={`h-4 w-4 ${pathname.startsWith("/dashboard/teams") ? "text-indigo-600" : "text-zinc-400"}`} />
                      <span className="text-sm font-medium">{teamLabel}</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/settings" className={navRowClass(pathname.startsWith("/dashboard/settings"))}>
                    <div className="flex items-center gap-2.5">
                      <CogIcon className={`h-4 w-4 ${pathname.startsWith("/dashboard/settings") ? "text-indigo-600" : "text-zinc-400"}`} />
                      <span className="text-sm font-medium">Settings</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-black/5 px-3 py-3 bg-white/30 backdrop-blur-md">
              <UserDropdown userName={user.name} userRole={user.role} />
            </div>
          </aside>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute inset-y-0 left-0 bg-white h-full w-[18rem] shadow-2xl overflow-y-auto">
              <div className="p-4 flex justify-between items-center">
                <LogoMark className="h-7 w-7" />
                <button onClick={() => setMobileOpen(false)} className="p-2 text-zinc-500">Close</button>
              </div>
              {/* Simplified mobile nav content here if needed, or re-use logic */}
              <div className="px-4 py-2">Nav content...</div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Mobile Header */}
          <div className="md:hidden sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
            <button onClick={() => setMobileOpen(true)} className="text-zinc-600 font-medium">Menu</button>
            <div className="font-semibold text-zinc-900">{topTitle}</div>
          </div>

          <div className={pathname.startsWith("/dashboard/thea") ? "" : "w-full px-4 md:px-8 py-8"}>{children}</div>
        </main>
      </div>
    </div>
  );
}

function navRowClass(active: boolean) {
  return [
    "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all duration-200",
    active
      ? "bg-white shadow-sm ring-1 ring-black/5 text-zinc-900"
      : "text-zinc-600 hover:bg-black/5 hover:text-zinc-900",
  ].join(" ");
}

function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
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

function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  );
}

function CogIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.81-1.345m3.375-5.727 7.56-4.524m-13.5 6.643 6.643 6.643" />
    </svg>
  );
}

