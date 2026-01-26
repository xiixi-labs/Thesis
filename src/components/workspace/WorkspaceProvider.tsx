"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import {
  getAccessibleFolders,
  getOrg,
  getTeamsForOrg,
  getTeamsForUser,
  getUser,
  mockWorkspace,
  type Folder,
  type Org,
  type Team,
  type User,
} from "@/lib/workspace";

type WorkspaceState = {
  org: Org;
  user: User;
  teamsInOrg: Team[];
  userTeams: Team[];
  accessibleFolders: Folder[];
  activeTeamId: string | null;
  setActiveTeamId: (id: string | null) => void;
  activeFolderId: string | null;
  setActiveFolderId: (id: string | null) => void;
  // Temporary until real auth/roles are wired.
  personas: User[];
  activeUserId: string;
  setActiveUserId: (id: string) => void;
};

const Ctx = createContext<WorkspaceState | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [activeOrgId] = useState(mockWorkspace.orgs[0].id);
  const [activeUserId, setActiveUserId] = useState(mockWorkspace.users[0].id);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const value = useMemo<WorkspaceState>(() => {
    const user = getUser(activeUserId)!;
    const org = getOrg(user.orgId)!;

    const teamsInOrg = getTeamsForOrg(activeOrgId);
    const userTeams = getTeamsForUser(user);

    const accessibleFolders = getAccessibleFolders(user, {
      teamId: activeTeamId ?? undefined,
    });

    // Keep active folder valid when switching team/persona.
    const activeFolderStillVisible =
      !activeFolderId || accessibleFolders.some((f) => f.id === activeFolderId);

    return {
      org,
      user,
      teamsInOrg,
      userTeams,
      accessibleFolders,
      activeTeamId,
      setActiveTeamId,
      activeFolderId: activeFolderStillVisible ? activeFolderId : null,
      setActiveFolderId,
      personas: mockWorkspace.users as unknown as User[],
      activeUserId,
      setActiveUserId,
    };
  }, [activeFolderId, activeOrgId, activeTeamId, activeUserId]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}

