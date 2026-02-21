"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  canUserAccessFolder,
  mockWorkspace,
  type Folder,
  type User,
} from "@/lib/workspace";

type WorkspaceState = {
  user: User;
  accessibleFolders: Folder[];
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
        userId: clerkUser.id,
        name: params.name,
        description: params.description,
        parentId: params.parentId,
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
    [clerkUser]
  );

  const value = useMemo<WorkspaceState>(() => {
    // Create workspace user from Clerk data
    if (!isLoaded || !clerkUser) {
      // Return placeholder or completely empty structure while loading/unauthenticated
      return {
        user: { id: "loading_user", name: "Loading..." },
        accessibleFolders: [],
        activeFolderId: null,
        setActiveFolderId,
        createNotebook,
        activeUserId: "loading_user", // Fallback during loading
      };
    }

    const user: User = {
      id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress || "User",
    };

    const allFolders = [...mockWorkspace.folders, ...customFolders];
    const accessibleFolders = allFolders.filter((f) => canUserAccessFolder(user, f));

    // Keep active folder valid
    const activeFolderStillVisible =
      !activeFolderId || accessibleFolders.some((f) => f.id === activeFolderId);

    return {
      user,
      accessibleFolders,
      activeFolderId: activeFolderStillVisible ? activeFolderId : null,
      setActiveFolderId,
      createNotebook,
      activeUserId: user.id, // Expose Clerk user ID for API calls
    };
  }, [activeFolderId, clerkUser, isLoaded, customFolders, createNotebook, setActiveFolderId]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}

