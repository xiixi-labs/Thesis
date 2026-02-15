"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  canUserAccessFolder,
  getOrg,
  getTeamsForOrg,
  getTeamsForUser,
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

  // Notebook creation (client-side for now)
  createNotebook: (params: { name: string; description?: string; parentId?: string }) => Folder;

  // Expose user ID for API calls (Clerk user ID)
  activeUserId: string;
};

const Ctx = createContext<WorkspaceState | null>(null);

const CUSTOM_FOLDERS_STORAGE_KEY = "thesis.customFolders.v1";

function safeParseFolders(raw: string | null): Folder[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Folder[]) : [];
  } catch {
    return [];
  }
}

function makeFolderId() {
  const suffix =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2);
  return `fld_${suffix}`;
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  // Get Clerk user data
  const { user: clerkUser, isLoaded } = useUser();

  const [activeOrgId] = useState(mockWorkspace.orgs[0].id);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const [customFolders, setCustomFolders] = useState<Folder[]>(() => {
    if (typeof window === "undefined") return [];
    return safeParseFolders(window.localStorage.getItem(CUSTOM_FOLDERS_STORAGE_KEY));
  });

  const createNotebook = useCallback(
    (params: { name: string; description?: string; parentId?: string }) => {
      // User will be created dynamically from Clerk data in useMemo below
      if (!clerkUser) throw new Error("User not authenticated");

      const folder: Folder = {
        id: makeFolderId(),
        orgId: activeOrgId,
        name: params.name,
        description: params.description,
        parentId: params.parentId,
        // Make it visible to the current user under the existing access model.
        teamIds: ["team_sales"], // Default team
        allowedUserIds: [clerkUser.id],
      };

      setCustomFolders((prev) => {
        const next = [folder, ...prev];
        if (typeof window !== "undefined") {
          window.localStorage.setItem(CUSTOM_FOLDERS_STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      });

      return folder;
    },
    [clerkUser, activeOrgId]
  );

  const value = useMemo<WorkspaceState>(() => {
    // Create workspace user from Clerk data
    if (!isLoaded || !clerkUser) {
      // Return placeholder while loading
      return {
        org: mockWorkspace.orgs[0],
        user: mockWorkspace.users[0],
        teamsInOrg: [],
        userTeams: [],
        accessibleFolders: [],
        activeTeamId: null,
        setActiveTeamId,
        activeFolderId: null,
        setActiveFolderId,
        createNotebook,
        activeUserId: mockWorkspace.users[0].id, // Fallback during loading
      };
    }

    const user: User = {
      id: clerkUser.id,
      orgId: activeOrgId,
      name: clerkUser.fullName || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress || "User",
      role: "member", // Default role for now
      teamIds: ["team_sales"], // Default team
    };

    const org = getOrg(activeOrgId)!;

    const teamsInOrg = getTeamsForOrg(activeOrgId);
    const userTeams = getTeamsForUser(user);

    const allFolders = [...mockWorkspace.folders, ...customFolders];
    const visibleFolders = allFolders.filter((f) => canUserAccessFolder(user, f));
    const accessibleFolders = activeTeamId
      ? visibleFolders.filter((f) => f.teamIds.includes(activeTeamId))
      : visibleFolders;

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
      createNotebook,
      activeUserId: user.id, // Expose Clerk user ID for API calls
    };
  }, [activeFolderId, activeOrgId, activeTeamId, clerkUser, isLoaded, customFolders, createNotebook, setActiveTeamId, setActiveFolderId]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}

