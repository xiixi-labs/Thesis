export type Role = "admin" | "manager" | "member";

export type Org = { id: string; name: string };
export type Team = { id: string; orgId: string; name: string };

// A folder is the unit of visibility for both Documents and Thea.
// Access is granted by team membership plus optional per-user approvals.
export type Folder = {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  teamIds: string[]; // teams that can see this folder by default
  allowedUserIds?: string[]; // explicit approvals (cross-team)
  parentId?: string; // For nesting
};

export type User = {
  id: string;
  orgId: string;
  name: string;
  role: Role;
  teamIds: string[];
};

export const mockWorkspace = (() => {
  const orgs: Org[] = [
    { id: "org_acme", name: "Acme Co" },
    { id: "org_uni", name: "East University" }
  ];

  const teams: Team[] = [
    { id: "team_sales", orgId: "org_acme", name: "Sales" },
    { id: "team_marketing", orgId: "org_acme", name: "Marketing" },
    { id: "team_cs101", orgId: "org_uni", name: "CS 101" },
    { id: "team_hist202", orgId: "org_uni", name: "History 202" },
  ];

  const folders: Folder[] = [
    {
      id: "fld_sales_playbook",
      orgId: "org_acme",
      name: "Sales Playbook",
      description: "Pitch, objection handling, and talk tracks.",
      teamIds: ["team_sales"],
    },
    {
      id: "fld_sales_pricing",
      orgId: "org_acme",
      name: "Pricing and Packaging",
      description: "Plans, pricing, discounts, and approvals.",
      teamIds: ["team_sales"],
    },
    {
      id: "fld_mkt_campaigns",
      orgId: "org_acme",
      name: "Campaign Briefs",
      description: "Messaging, positioning, and launch plans.",
      teamIds: ["team_marketing"],
    },
    {
      id: "fld_company_overview",
      orgId: "org_acme",
      name: "Company Overview",
      description: "Shared context for everyone.",
      teamIds: ["team_sales", "team_marketing"],
    },
    // Student Folders
    {
      id: "fld_cs101_notes",
      orgId: "org_uni",
      name: "Lecture Notes",
      description: "Daily transcriptions and slides.",
      teamIds: ["team_cs101"],
    },
    {
      id: "fld_cs101_labs",
      orgId: "org_uni",
      name: "Lab Assignments",
      description: "Code snippets and requirements.",
      teamIds: ["team_cs101"],
    },
    {
      id: "fld_cs101_week1",
      orgId: "org_uni",
      name: "Week 1: Intro",
      description: "Introduction to algorithms.",
      teamIds: ["team_cs101"],
      parentId: "fld_cs101_notes"
    },
    {
      id: "fld_hist_essays",
      orgId: "org_uni",
      name: "Essays & Sources",
      description: "Primary sources for final paper.",
      teamIds: ["team_hist202"],
    },
  ];

  // Personas to simulate permissions until Clerk org/roles are enforced.
  const users: User[] = [
    {
      id: "usr_sales",
      orgId: "org_acme",
      name: "Sam (Sales)",
      role: "member",
      teamIds: ["team_sales"],
    },
    {
      id: "usr_marketing",
      orgId: "org_acme",
      name: "Morgan (Marketing)",
      role: "member",
      teamIds: ["team_marketing"],
    },
    {
      id: "usr_admin",
      orgId: "org_acme",
      name: "Alex (Admin)",
      role: "admin",
      teamIds: ["team_sales", "team_marketing"],
    },
    {
      id: "usr_student",
      orgId: "org_uni",
      name: "Casey (Student)",
      role: "member",
      teamIds: ["team_cs101", "team_hist202"],
    },
  ];

  // Example of a cross-team approval: Marketing user can see Pricing.
  folders.find((f) => f.id === "fld_sales_pricing")!.allowedUserIds = ["usr_marketing"];

  return { orgs, teams, folders, users } as const;
})();

export function getOrg(orgId: string): Org | undefined {
  return mockWorkspace.orgs.find((o) => o.id === orgId);
}

export function getUser(userId: string): User | undefined {
  return mockWorkspace.users.find((u) => u.id === userId);
}

export function getTeamsForOrg(orgId: string): Team[] {
  return mockWorkspace.teams.filter((t) => t.orgId === orgId);
}

export function getTeamsForUser(user: User): Team[] {
  const set = new Set(user.teamIds);
  return mockWorkspace.teams.filter((t) => set.has(t.id));
}

export function canUserAccessFolder(user: User, folder: Folder): boolean {
  if (user.role === "admin") return folder.orgId === user.orgId;
  if (folder.orgId !== user.orgId) return false;
  if (folder.allowedUserIds?.includes(user.id)) return true;
  return folder.teamIds.some((tid) => user.teamIds.includes(tid));
}

export function getAccessibleFolders(user: User, opts?: { teamId?: string }): Folder[] {
  const all = mockWorkspace.folders.filter((f) => canUserAccessFolder(user, f));
  return opts?.teamId ? all.filter((f) => f.teamIds.includes(opts.teamId!)) : all;
}

