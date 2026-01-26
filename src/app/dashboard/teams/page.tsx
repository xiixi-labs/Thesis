"use client";

import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export default function TeamsPage() {
  const { user, teamsInOrg, userTeams } = useWorkspace();
  const teams = user.role === "admin" ? teamsInOrg : userTeams;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Teams</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Teams define who can see which folders.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((t) => (
          <div
            key={t.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-xl transition hover:shadow-md hover:bg-white/80"
          >
            <div className="absolute right-0 top-0 -mt-6 -mr-6 h-20 w-20 rounded-full bg-zinc-900/5 group-hover:bg-indigo-500/10 transition-colors" />

            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5">
                <span className="font-bold text-zinc-900">{t.name.substring(0, 2).toUpperCase()}</span>
              </div>
              <div className="text-lg font-semibold text-zinc-950">{t.name}</div>
              <div className="mt-1 text-sm text-zinc-600">
                Folder visibility is granted to this team.
              </div>
            </div>

            <div className="mt-6 flex items-center -space-x-2 overflow-hidden py-1">
              <div className="h-6 w-6 rounded-full border-2 border-white bg-zinc-200" />
              <div className="h-6 w-6 rounded-full border-2 border-white bg-zinc-300" />
              <div className="h-6 w-6 rounded-full border-2 border-white bg-zinc-400" />
              <div className="ml-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 cursor-pointer">Manage members →</div>
            </div>
          </div>
        ))}

        <button className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/30 p-6 text-center transition hover:border-zinc-400 hover:bg-white/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5">
            <PlusIcon className="h-5 w-5 text-zinc-600" />
          </div>
          <div className="mt-3 font-medium text-zinc-900">Create New Team</div>
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-6 text-sm text-zinc-600 shadow-sm backdrop-blur-xl">
        Managers/Admins will be able to create teams and approve cross-team access here.
      </div>
    </div>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

