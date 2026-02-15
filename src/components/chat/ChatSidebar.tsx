
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getConversations, deleteConversation, updateConversationTitle, type ChatSession } from "@/app/actions/chat";

export function ChatSidebar({
    onSelect,
    activeId,
    onNewChat,
    className
}: {
    onSelect: (id: string) => void,
    activeId: string | null,
    onNewChat: () => void,
    className?: string
}) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

    const refreshSessions = async () => {
        const data = await getConversations();
        setSessions(data);
    };

    useEffect(() => {
        refreshSessions();
    }, [activeId]); // Refresh when active ID changes (e.g. new chat created)

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Delete this conversation?")) return;
        await deleteConversation(id);
        if (activeId === id) onNewChat();
        refreshSessions();
    };

    const startEdit = (e: React.MouseEvent, session: ChatSession) => {
        e.stopPropagation();
        setEditingId(session.id);
        setEditTitle(session.title);
    };

    const saveEdit = async () => {
        if (!editingId) return;
        await updateConversationTitle(editingId, editTitle);
        setEditingId(null);
        refreshSessions();
    };

    return (
        <div className={`flex w-[260px] flex-col border-r border-black/5 bg-zinc-50/80 pt-4 hidden md:flex h-full backdrop-blur-xl ${className || ''}`}>
            <div className="px-3 mb-2">
                <button
                    onClick={onNewChat}
                    className="group flex w-full items-center gap-3 rounded-lg bg-white border border-black/5 px-3 py-2.5 text-sm font-medium text-zinc-600 shadow-sm transition hover:border-black/10 hover:shadow-md hover:text-zinc-900"
                >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-zinc-500 group-hover:text-zinc-900 transition">
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                    <span>New Chat</span>
                </button>
            </div>

            <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">History</h3>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-zinc-200">
                {sessions.map((s) => (
                    <div
                        key={s.id}
                        onClick={() => onSelect(s.id)}
                        className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition cursor-pointer ${activeId === s.id
                            ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/5 font-medium"
                            : "text-zinc-600 hover:bg-black/5 hover:text-zinc-900"
                            }`}
                    >
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 flex-shrink-0 ${activeId === s.id ? "text-indigo-500" : "text-zinc-400"}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                        </svg>

                        {editingId === s.id ? (
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={saveEdit}
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                autoFocus
                                className="w-full bg-transparent outline-none ring-1 ring-indigo-500 rounded px-1 -ml-1"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span className="truncate flex-1">{s.title || "Untitled Chat"}</span>
                        )}

                        {activeId === s.id && !editingId && (
                            <div className="absolute right-2 flex opacity-0 group-hover:opacity-100 transition duration-200 bg-white/50 backdrop-blur-sm rounded-md shadow-sm border border-black/5">
                                <button
                                    onClick={(e) => startEdit(e, s)}
                                    className="p-1 text-zinc-400 hover:text-zinc-600"
                                    title="Rename"
                                >
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /></svg>
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, s.id)}
                                    className="p-1 text-zinc-400 hover:text-red-500"
                                    title="Delete"
                                >
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {sessions.length === 0 && (
                    <div className="px-4 py-8 text-center text-xs text-zinc-400 italic">
                        No conversations yet
                    </div>
                )}
            </div>
        </div>
    );
}
