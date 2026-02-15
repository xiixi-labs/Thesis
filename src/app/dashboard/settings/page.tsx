"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import Toggle from "@/components/ui/Toggle";

type Preferences = {
  emailNotifications: boolean;
  desktopNotifications: boolean;
  defaultFolder: string;
  theme: 'light' | 'dark' | 'system';
};

export default function SettingsPage() {
  const { user: clerkUser } = useUser();
  const { accessibleFolders } = useWorkspace();
  const { signOut } = useClerk();

  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    desktopNotifications: false,
    defaultFolder: '',
    theme: 'system',
  });

  const [documentCount, setDocumentCount] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('thesis-preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse preferences:', e);
      }
    }
  }, []);

  // Fetch document count
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/documents');
        if (res.ok) {
          const data = await res.json();
          setDocumentCount(data.documents?.length || 0);
        }
      } catch (e) {
        console.error('Failed to fetch stats:', e);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Save preference to localStorage
  const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    localStorage.setItem('thesis-preferences', JSON.stringify(updated));
  };

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      signOut();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Settings</h1>
        <p className="mt-2 text-base text-zinc-600">
          Manage your profile and application preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Profile */}
        <div className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Profile</h2>

          <div className="flex items-center gap-4 mb-6">
            {clerkUser?.imageUrl ? (
              <img
                src={clerkUser.imageUrl}
                alt={clerkUser.fullName || 'User'}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-md"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                {clerkUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}

            <div className="flex-1">
              <div className="text-sm font-medium text-zinc-500">Name</div>
              <div className="text-base font-semibold text-zinc-900">
                {clerkUser?.fullName || clerkUser?.firstName || 'User'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="pt-4 border-t border-zinc-100">
              <div className="text-sm font-medium text-zinc-500">Email</div>
              <div className="text-base text-zinc-900 mt-1">
                {clerkUser?.primaryEmailAddress?.emailAddress || 'N/A'}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <div className="text-sm font-medium text-zinc-500">User ID</div>
              <div className="text-xs font-mono text-zinc-600 mt-1 break-all">
                {clerkUser?.id}
              </div>
            </div>
          </div>

          <button
            onClick={() => window.open('https://accounts.thesis.app/user', '_blank')}
            className="mt-6 w-full px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition"
          >
            Manage Account
          </button>
        </div>

        {/* App Preferences */}
        <div className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Preferences</h2>

          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium text-zinc-900">Email Notifications</div>
                <div className="text-xs text-zinc-500">Receive updates about documents and chats</div>
              </div>
              <Toggle
                checked={preferences.emailNotifications}
                onChange={(checked) => updatePreference('emailNotifications', checked)}
              />
            </div>

            {/* Desktop Notifications */}
            <div className="flex items-center justify-between py-3 border-t border-zinc-100">
              <div>
                <div className="text-sm font-medium text-zinc-900">Desktop Notifications</div>
                <div className="text-xs text-zinc-500">Push notifications for new activity</div>
              </div>
              <Toggle
                checked={preferences.desktopNotifications}
                onChange={(checked) => updatePreference('desktopNotifications', checked)}
              />
            </div>

            {/* Default Upload Folder */}
            <div className="py-3 border-t border-zinc-100">
              <label className="text-sm font-medium text-zinc-900 mb-2 block">
                Default Upload Folder
              </label>
              <select
                value={preferences.defaultFolder}
                onChange={(e) => updatePreference('defaultFolder', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Ask each time</option>
                {accessibleFolders.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            {/* Theme Preference */}
            <div className="py-3 border-t border-zinc-100">
              <label className="text-sm font-medium text-zinc-900 mb-2 block">
                Theme
              </label>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map(theme => (
                  <button
                    key={theme}
                    onClick={() => updatePreference('theme', theme)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${preferences.theme === theme
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      }`}
                  >
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Theme preference saved (visual changes coming soon)
              </p>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="rounded-2xl border border-black/5 bg-white/60 p-6 shadow-sm backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Usage</h2>

          {isLoadingStats ? (
            <div className="text-center py-8 text-sm text-zinc-500">Loading stats...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-zinc-50">
                  <div className="text-2xl font-bold text-zinc-900">{documentCount}</div>
                  <div className="text-xs text-zinc-500 mt-1">Documents</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-zinc-50">
                  <div className="text-2xl font-bold text-zinc-900">{accessibleFolders.length}</div>
                  <div className="text-xs text-zinc-500 mt-1">Notebooks</div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <div className="text-sm text-zinc-600">
                  Member since {clerkUser?.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  }) : 'N/A'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h2>
          <p className="text-sm text-red-600 mb-4">
            Irreversible actions that affect your account
          </p>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-white border border-red-300 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-50 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
