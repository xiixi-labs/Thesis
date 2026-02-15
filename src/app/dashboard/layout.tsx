"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  WorkspaceProvider,
} from "@/components/workspace/WorkspaceProvider";
import { EnhancedSidebar } from "@/components/navigation/EnhancedSidebar";

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

  const topTitle = useMemo(() => {
    if (pathname === "/dashboard") return "Home";
    if (pathname.startsWith("/dashboard/thea")) return "Thea";
    if (pathname.startsWith("/dashboard/documents")) return "Documents";
    if (pathname.startsWith("/dashboard/folders")) return "Notebook";
    if (pathname.startsWith("/dashboard/settings")) return "Settings";
    return "Thesis";
  }, [pathname]);

  const ShellSidebar = <EnhancedSidebar onMobileClose={() => setMobileOpen(false)} isMobile={true} />;

  return (
    <div className="relative min-h-screen bg-[#fbfbfd] text-zinc-900">
      {/* Unified dashboard background (shared across all /dashboard routes) */}
      <div className="fixed inset-0 z-0 bg-[#fbfbfd] overflow-hidden">
        <div
          className="pointer-events-none absolute left-[-25%] top-[-20%] h-[60rem] w-[60rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.5),rgba(255,255,255,0)_65%)] blur-[120px]"
          style={{ animation: "blob-float 25s ease-in-out infinite" }}
        />
        <div
          className="pointer-events-none absolute left-[5%] top-[15%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.48),rgba(255,255,255,0)_65%)] blur-[110px]"
          style={{ animation: "blob-float-alt 20s ease-in-out infinite 2s" }}
        />
        <div
          className="pointer-events-none absolute right-[-25%] top-[-10%] h-[55rem] w-[55rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.45),rgba(255,255,255,0)_65%)] blur-[110px]"
          style={{ animation: "blob-float 22s ease-in-out infinite 4s" }}
        />
        <div
          className="pointer-events-none absolute bottom-[-25%] right-[5%] h-[58rem] w-[58rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.4),rgba(255,255,255,0)_65%)] blur-[115px]"
          style={{ animation: "blob-float-alt 28s ease-in-out infinite 1s" }}
        />
        <div
          className="pointer-events-none absolute left-[10%] bottom-[-20%] h-[45rem] w-[45rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.38),rgba(255,255,255,0)_65%)] blur-[105px]"
          style={{ animation: "blob-float 24s ease-in-out infinite 6s" }}
        />
        <div
          className="pointer-events-none absolute right-[20%] top-[35%] h-[35rem] w-[35rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.35),rgba(255,255,255,0)_65%)] blur-[100px]"
          style={{ animation: "blob-float-alt 26s ease-in-out infinite 3s" }}
        />


        {/* Salt-and-pepper grain texture overlay (matches public pages) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='2' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0 0 1 1 1 0 0 0'/%3E%3C/feComponentTransfer%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='discrete' tableValues='0 1'/%3E%3CfeFuncG type='discrete' tableValues='0 1'/%3E%3CfeFuncB type='discrete' tableValues='0 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden md:block sticky top-0 h-screen">
          <EnhancedSidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute inset-y-0 left-0 h-full shadow-2xl">
              {ShellSidebar}
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

