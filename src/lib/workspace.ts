export type Folder = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  parentId?: string; // For nesting
};

export type User = {
  id: string;
  name: string;
};

export const mockWorkspace = (() => {
  const folders: Folder[] = [];
  const users: User[] = [];

  return { folders, users } as const;
})();

export function getUser(userId: string): User | undefined {
  return mockWorkspace.users.find((u) => u.id === userId);
}

export function canUserAccessFolder(user: User, folder: Folder): boolean {
  return folder.userId === user.id;
}

export function getAccessibleFolders(user: User): Folder[] {
  return mockWorkspace.folders.filter((f) => canUserAccessFolder(user, f));
}

