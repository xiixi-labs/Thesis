"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { TheaMark } from "@/components/TheaMark";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { getMessages } from "@/app/actions/chat";

type Citation = {
  id: string;
  source: string;
  page: string;
  snippet?: string;
};
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
};

type SpeechRecognitionAlternativeLike = { transcript?: string };
type SpeechRecognitionResultLike = { length: number;[0]: SpeechRecognitionAlternativeLike };
type SpeechRecognitionResultListLike = { length: number;[index: number]: SpeechRecognitionResultLike };
type SpeechRecognitionEventLike = { resultIndex: number; results: SpeechRecognitionResultListLike };
type SpeechRecognitionErrorEventLike = { error?: string };
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionCtorLike = new () => SpeechRecognitionLike;

function uniq(values: string[]) {
  return Array.from(new Set(values));
}

function getSpeechRecognitionCtor(): SpeechRecognitionCtorLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtorLike;
    webkitSpeechRecognition?: SpeechRecognitionCtorLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function TheaClient() {
  const { user } = useUser();
  const userName = user?.firstName || "there";

  const timeOfDay = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  // Get activeUserId for API calls
  const { accessibleFolders, activeFolderId, activeUserId } = useWorkspace();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Load conversation when URL changes
  useEffect(() => {
    setActiveConversationId(chatId);
    if (chatId) {
      setMessages([]); // Clear before load
      getMessages(chatId).then(history => {
        const msgs = history.map(h => ({
          id: h.id,
          role: h.role,
          content: h.content,
          citations: h.citations as Citation[]
        }));
        setMessages(msgs);
      });
    } else {
      setMessages([]);
    }
  }, [chatId]);

  // Multi-folder scope is local to Thea (not global workspace state).
  const [manualSelectedFolderIds, setManualSelectedFolderIds] = useState<string[] | null>(null);
  const [scopeOpen, setScopeOpen] = useState(false);
  const scopeRef = useRef<HTMLDivElement>(null);

  // Sources panel
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [sourcesMessageId, setSourcesMessageId] = useState<string | null>(null);
  const [sourcesCitationIdx, setSourcesCitationIdx] = useState(0);

  // Chat history drawer
  const [historyOpen, setHistoryOpen] = useState(false);

  // Mobile sheet interactions (drag-to-dismiss)
  const [sheetDragY, setSheetDragY] = useState(0);
  const [sheetDragging, setSheetDragging] = useState(false);
  const sheetPointerIdRef = useRef<number | null>(null);
  const sheetStartYRef = useRef(0);

  const closeSources = useCallback(() => {
    setSourcesOpen(false);
    setSheetDragY(0);
    setSheetDragging(false);
    sheetPointerIdRef.current = null;
  }, []);

  const openSourcesFor = useCallback((messageId: string, citationIdx = 0) => {
    setSourcesOpen(true);
    setSourcesMessageId(messageId);
    setSourcesCitationIdx(citationIdx);
    setSheetDragY(0);
    setSheetDragging(false);
  }, []);

  const onSheetPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!sourcesOpen) return;
      sheetPointerIdRef.current = e.pointerId;
      sheetStartYRef.current = e.clientY;
      setSheetDragging(true);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    },
    [sourcesOpen]
  );

  const onSheetPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!sheetDragging) return;
      if (sheetPointerIdRef.current !== e.pointerId) return;
      const dy = Math.max(0, e.clientY - sheetStartYRef.current);
      setSheetDragY(dy);
    },
    [sheetDragging]
  );

  const onSheetPointerEnd = useCallback(
    (e: React.PointerEvent) => {
      if (sheetPointerIdRef.current !== e.pointerId) return;
      const dy = Math.max(0, e.clientY - sheetStartYRef.current);
      setSheetDragging(false);
      setSheetDragY(0);
      sheetPointerIdRef.current = null;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      if (dy > 120) closeSources();
    },
    [closeSources]
  );

  // Voice input
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const isListeningRef = useRef(false);

  const foldersFromUrl = useMemo(() => {
    const direct = searchParams.getAll("folder");
    const csv = searchParams.get("folders");
    const fromCsv = csv
      ? csv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      : [];
    return uniq([...direct, ...fromCsv]).filter(Boolean);
  }, [searchParams]);

  const allowedFolderIdSet = useMemo(() => {
    return new Set(accessibleFolders.map((f) => f.id));
  }, [accessibleFolders]);

  const scopeWarnings = useMemo(() => {
    const denied = foldersFromUrl.filter((id) => !allowedFolderIdSet.has(id));
    return denied.length > 0 ? "Some folders in the link are not available for this user." : null;
  }, [allowedFolderIdSet, foldersFromUrl]);

  const initialSelectedFolderIds = useMemo(() => {
    const fromUrlAllowed = foldersFromUrl.filter((id) => allowedFolderIdSet.has(id));
    if (fromUrlAllowed.length > 0) return fromUrlAllowed;
    if (activeFolderId && allowedFolderIdSet.has(activeFolderId)) return [activeFolderId];
    return [] as string[];
  }, [activeFolderId, allowedFolderIdSet, foldersFromUrl]);

  const selectedFolderIds = useMemo(() => {
    const raw = manualSelectedFolderIds ?? initialSelectedFolderIds;
    // Always enforce visibility at the UI level (server must still enforce later).
    return raw.filter((id) => allowedFolderIdSet.has(id));
  }, [allowedFolderIdSet, initialSelectedFolderIds, manualSelectedFolderIds]);

  const scopeLabel = useMemo(() => {
    if (selectedFolderIds.length === 0) return "All accessible folders";
    if (selectedFolderIds.length === 1) {
      return (
        accessibleFolders.find((f) => f.id === selectedFolderIds[0])?.name ??
        "1 folder"
      );
    }
    return `${selectedFolderIds.length} folders`;
  }, [accessibleFolders, selectedFolderIds]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!scopeOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setScopeOpen(false);
    };
    const onMouseDown = (e: MouseEvent) => {
      const el = scopeRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setScopeOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [scopeOpen]);

  useEffect(() => {
    if (!sourcesOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSources();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeSources, sourcesOpen]);

  useEffect(() => {
    // Prevent the background from scrolling when the mobile sheet is open.
    if (typeof document === "undefined" || typeof window === "undefined") return;
    if (!sourcesOpen) return;
    const isNarrow = window.matchMedia?.("(max-width: 1279px)")?.matches ?? false;
    if (!isNarrow) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sourcesOpen]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const ensureRecognition = () => {
    if (recognitionRef.current) return recognitionRef.current;
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return null;

    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event: SpeechRecognitionEventLike) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0]?.transcript ?? "";
      }
      setInput((prev) => {
        // If user already typed, append voice gently.
        const base = prev.trim().length > 0 ? prev.replace(/\s+$/, "") + " " : "";
        return (base + transcript).replace(/\s+$/, "");
      });
    };

    rec.onerror = (e: SpeechRecognitionErrorEventLike) => {
      setVoiceError(e?.error ? `Voice error: ${e.error}` : "Voice error");
      setIsListening(false);
    };

    rec.onend = () => {
      // Some browsers end recognition automatically; if user is still in "listening" mode, restart.
      if (isListeningRef.current) {
        try {
          rec.start();
        } catch {
          // ignore
        }
      }
    };

    recognitionRef.current = rec;
    return rec;
  };

  const toggleListening = () => {
    setVoiceError(null);
    const rec = ensureRecognition();
    if (!rec) {
      setVoiceError("Voice input isn't supported in this browser.");
      return;
    }
    setIsListening((v) => {
      const next = !v;
      try {
        if (next) rec.start();
        else rec.stop();
      } catch {
        // ignore
      }
      return next;
    });
  };

  const query = searchParams.get("q");
  const hasAutoSent = useRef(false);

  const submitMessage = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    if (isListening) {
      // Stop listening when user sends.
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // ignore
      }
      setIsListening(false);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend.trim(),
    };

    // Prepare history for API
    const messagesToSend = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUserId,
        },
        body: JSON.stringify({
          messages: messagesToSend,
          folderIds: selectedFolderIds,
          conversationId: activeConversationId
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();

      // If new conversation, update URL
      if (!activeConversationId && data.conversationId) {
        setActiveConversationId(data.conversationId);
        // Use replace to avoid back-nav cycles, scroll:false keeps position
        router.replace(`/dashboard/thea?chatId=${data.conversationId}`, { scroll: false });
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        citations: data.citations,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e: unknown) {
      console.error("Chat error:", e);

      // Try to get the actual error message from the API
      let errorText = "I'm having trouble connecting to your library right now. Please try again.";
      if (e instanceof Error && e.message) {
        errorText = e.message;
      }
      try {
        if (typeof e === "object" && e && "response" in e) {
          const response = (e as { response?: unknown }).response;
          if (response && typeof response === "object" && "json" in response) {
            const errorData = await (response as { json: () => Promise<unknown> }).json();
            if (typeof errorData === "object" && errorData) {
              const maybeError = (errorData as { error?: unknown; message?: unknown }).error;
              const maybeMessage = (errorData as { error?: unknown; message?: unknown }).message;
              if (typeof maybeError === "string" && maybeError) errorText = maybeError;
              else if (typeof maybeMessage === "string" && maybeMessage) errorText = maybeMessage;
            }
          }
        }
      } catch { }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorText,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-send query from URL
  useEffect(() => {
    if (query && !hasAutoSent.current && messages.length === 0) {
      hasAutoSent.current = true;
      // Small delay to ensure state matches
      setTimeout(() => {
        submitMessage(query);
      }, 500);
    }
  }, [query, messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const activeSources = useMemo(() => {
    if (!sourcesMessageId) return [] as Citation[];
    const m = messages.find((x) => x.id === sourcesMessageId);
    return m?.citations ?? [];
  }, [messages, sourcesMessageId]);

  const activeCitation = activeSources[sourcesCitationIdx] ?? null;

  const downloadBriefing = () => {
    if (messages.length === 0) return;
    const content = messages.map(m =>
      `## ${m.role === 'user' ? 'User' : 'Thea'}\n\n${m.content}\n\n` +
      (m.citations ? `**Sources:**\n${m.citations.map((c) => `- ${c.source} (${c.page})`).join('\n')}\n` : '')
    ).join('---\n\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Thea_Briefing_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] md:h-screen flex-row overflow-hidden">
      {/* Main Chat Area */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* History Drawer (inside the Thea panel, so it doesn't cover the dashboard nav) */}
        <div className={`absolute inset-0 z-30 ${historyOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
          <button
            type="button"
            aria-label="Close chats"
            onClick={() => setHistoryOpen(false)}
            className={`absolute inset-0 bg-black/15 backdrop-blur-[1px] transition-opacity ${historyOpen ? "opacity-100" : "opacity-0"}`}
          />
          <div
            className={`absolute inset-y-0 left-0 w-[20rem] max-w-[90vw] overflow-hidden border-r border-black/10 bg-white/70 shadow-xl backdrop-blur-2xl transition-transform duration-200 ${historyOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
              <div className="text-sm font-semibold text-zinc-900">Chats</div>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-black/5 hover:text-zinc-900"
                aria-label="Close"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <ChatSidebar
              onSelect={(id) => {
                setHistoryOpen(false);
                router.push(`/dashboard/thea?chatId=${id}`);
              }}
              activeId={activeConversationId}
              onNewChat={() => {
                setHistoryOpen(false);
                router.push(`/dashboard/thea`);
              }}
              className="w-full border-r-0 bg-transparent pt-3"
            />
          </div>
        </div>

        {/* Sticky Header */}
        <div className="sticky top-0 z-20 border-b border-black/5 bg-white/40 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-600 hover:bg-black/5 hover:text-zinc-900"
              >
                <SidebarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Chats</span>
              </button>

              <div className="ml-1 hidden items-center gap-2 sm:flex">
                <TheaMark className="h-5 w-5" />
                <span className="text-sm font-semibold text-zinc-900">Thea</span>
              </div>
            </div>

            <div className="relative" ref={scopeRef}>
              <button
                type="button"
                onClick={() => setScopeOpen((v) => !v)}
                className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition border ${selectedFolderIds.length > 0
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                  : "text-zinc-600 bg-transparent border-transparent hover:bg-black/5"
                  }`}
              >
                {selectedFolderIds.length > 0 && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
                <span className="max-w-[14rem] truncate">{scopeLabel}</span>
                <ChevronDownIcon className={`h-4 w-4 ${selectedFolderIds.length > 0 ? "text-indigo-400" : "text-zinc-400 group-hover:text-zinc-600"}`} />
              </button>

              {scopeOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[20rem] overflow-hidden rounded-xl border border-black/10 bg-white/95 p-1 shadow-lg ring-1 ring-black/5 backdrop-blur-xl">
                  {/* ... (scope dropdown content remains same) ... */}
                  <div className="px-3 py-2 text-xs font-semibold text-zinc-500">Search scope</div>
                  <button
                    type="button"
                    onClick={() => setManualSelectedFolderIds([])}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-900 hover:bg-black/5"
                  >
                    All accessible notebooks
                  </button>
                  <div className="my-1 h-px bg-zinc-200/50" />
                  <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200">
                    {accessibleFolders.map((f) => {
                      const checked = selectedFolderIds.includes(f.id);
                      return (
                        <label
                          key={f.id}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-800 hover:bg-black/5"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? uniq([...selectedFolderIds, f.id])
                                : selectedFolderIds.filter((id) => id !== f.id);
                              setManualSelectedFolderIds(next);
                            }}
                            className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="flex-1 truncate">{f.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={downloadBriefing}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2 text-sm font-medium text-zinc-600 shadow-sm ring-1 ring-black/5 hover:bg-white hover:text-zinc-900 transition"
                >
                  <DocumentIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-6 scrollbar-thin scrollbar-thumb-zinc-200">
          <div className="mx-auto flex min-h-full max-w-3xl flex-col">
            {/* ... (messages content) ... */}
            {scopeWarnings && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
                {scopeWarnings}
              </div>
            )}

            {voiceError && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-900">
                {voiceError}
              </div>
            )}

            {messages.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center pb-20 text-center">
                <div className="mb-4 flex justify-center">
                  <TheaMark className="h-14 w-14" />
                </div>

                <h1 className="text-4xl font-medium tracking-tight text-zinc-900 sm:text-5xl">
                  {timeOfDay}, {userName}
                </h1>
                <p className="mt-3 text-base text-zinc-500">Ask about anything in your library.</p>

                <div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { label: "Summarize this notebook" },
                    { label: "Explain a concept from my notes" },
                    { label: "Pull key claims with citations" },
                    { label: "Turn this into study notes" },
                  ].map((q) => (
                    <button
                      key={q.label}
                      onClick={() => setInput(q.label)}
                      className="group relative flex items-center justify-between gap-3 rounded-2xl bg-white/40 px-5 py-4 text-left shadow-sm ring-1 ring-black/5 transition hover:bg-white/80 hover:shadow-md"
                    >
                      <span className="text-sm font-medium text-zinc-700">{q.label}</span>
                      <span className="text-xs text-zinc-400 group-hover:text-zinc-500">↵</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 pb-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`group flex items-start gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border ${m.role === "user"
                        ? "border-black/10 bg-zinc-900 text-white"
                        : "border-black/10 bg-white/70 text-zinc-900"
                        }`}
                    >
                      {m.role === "user" ? (
                        <UserIcon className="h-4 w-4" />
                      ) : (
                        <TheaMark className="h-5 w-5" animated={false} />
                      )}
                    </div>

                    <div className={`flex max-w-[80%] flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                      <div
                        className={`rounded-2xl px-5 py-3.5 shadow-sm ${m.role === "user"
                          ? "bg-zinc-900 text-white"
                          : "border border-black/10 bg-white/70 text-zinc-800"
                          }`}
                      >
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      </div>

                      {m.role !== "user" && !!m.citations?.length && (
                        <div className="mt-2.5 flex items-center gap-2 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => openSourcesFor(m.id, 0)}
                            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition hover:bg-white hover:text-zinc-900"
                          >
                            <DocumentIcon className="h-3.5 w-3.5 opacity-60" />
                            <span>Sources</span>
                            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">{m.citations.length}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                      <TheaMark className="h-5 w-5" />
                    </div>
                    <div className="mt-2 flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"></span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.15s]"></span>
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.3s]"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input - Floating at bottom */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            {/* Clean, Simple Input Container */}
            <div className="relative flex items-center gap-3 rounded-[2rem] bg-zinc-50/80 border border-zinc-200/80 p-3 shadow-sm transition hover:bg-white hover:border-black/20 focus-within:bg-white focus-within:border-black/20 focus-within:ring-4 focus-within:ring-black/5 backdrop-blur-xl">
              <button
                type="button"
                onClick={toggleListening}
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:bg-zinc-200/50 ${isListening ? "animate-pulse bg-red-100 text-red-600" : "text-zinc-600"}`}
                aria-label={isListening ? "Stop voice input" : "Start voice input"}
              >
                <MicIcon className="h-5 w-5" />
              </button>

              <div className="relative min-w-0 flex-1 flex items-center">
                {isListening && (
                  <div className="absolute -top-8 left-0 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    Listening...
                  </div>
                )}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitMessage(); }
                  }}
                  placeholder="Ask Thea anything..."
                  rows={1}
                  // 'items-center' on parent + 'h-6' on textarea ensures vertical centering visually
                  className="max-h-32 w-full resize-none bg-transparent px-1 text-lg text-zinc-900 placeholder:text-zinc-500 focus:outline-none scrollbar-hide py-3 leading-6"
                  style={{ minHeight: '3rem' }}
                />
              </div>

              <div className="flex-shrink-0">
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm transition-all hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400"
                >
                  <ArrowUpIcon className="h-6 w-6 stroke-[2.5px]" />
                </button>
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="text-[10px] text-zinc-400">
                Thea may display inaccurate info, including about people, so double-check its responses.
              </p>
            </div>
          </form>
        </div>
      </div>


      {/* Sources - Right Sidebar */}
      {
        sourcesOpen && (
          <aside className="hidden w-[26rem] flex-shrink-0 border-l border-black/5 bg-white/50 backdrop-blur-2xl xl:block">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
                <h3 className="text-sm font-semibold text-zinc-900">Sources</h3>
                <button
                  type="button"
                  onClick={closeSources}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-black/5 hover:text-zinc-900"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6 font-sans">
                <div className="space-y-6">
                  {activeSources.map((c, idx) => (
                    <div
                      key={c.id}
                      className={`rounded-xl border p-4 shadow-sm transition ${idx === sourcesCitationIdx
                        ? "border-black/10 bg-white ring-2 ring-black/5"
                        : "border-black/5 bg-white/60 hover:bg-white"
                        }`}
                      onClick={() => setSourcesCitationIdx(idx)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-zinc-900">{c.source}</div>
                          <div className="text-xs text-zinc-500">{c.page}</div>
                        </div>
                      </div>
                      {c.snippet && (
                        <div className="mt-3 text-sm leading-relaxed text-zinc-700">
                          &ldquo;{c.snippet}&rdquo;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )
      }

      {/* Mobile Sources Bottom Sheet (mounted for smooth animation) */}
      <div className={`fixed inset-0 z-50 xl:hidden ${sourcesOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <button
          type="button"
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-200 ${sourcesOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
          onClick={closeSources}
          aria-label="Close sources"
        />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[72vh] overflow-hidden rounded-t-3xl border border-black/10 bg-white/90 shadow-2xl backdrop-blur-xl ${sourcesOpen ? "" : "pointer-events-none"}`}
          style={{
            transform: sourcesOpen ? `translateY(${sheetDragY}px)` : "translateY(100%)",
            transition: sheetDragging ? "none" : "transform 220ms ease-out",
            willChange: "transform",
          }}
        >
          <div
            className="touch-none"
            onPointerDown={onSheetPointerDown}
            onPointerMove={onSheetPointerMove}
            onPointerUp={onSheetPointerEnd}
            onPointerCancel={onSheetPointerEnd}
          >
            <div className="flex items-center justify-between border-b border-black/5 px-4 pb-3 pt-3">
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-10 rounded-full bg-zinc-200" aria-hidden />
                <div>
                  <h3 className="text-base font-semibold text-zinc-900">Sources</h3>
                  <p className="mt-0.5 text-xs text-zinc-500">Drag down to close</p>
                </div>
              </div>
              <button type="button" onClick={closeSources} className="rounded-lg p-2 text-zinc-500 hover:bg-black/5">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[72vh] overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            {activeSources.length === 0 ? (
              <p className="text-sm text-zinc-500">Select a citation.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {activeSources.map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSourcesCitationIdx(idx)}
                      className={`rounded-full px-2.5 py-1 text-xs ring-1 ring-black/5 transition ${idx === sourcesCitationIdx ? "bg-zinc-900 text-white" : "bg-white/70 text-zinc-700 hover:bg-white"}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {activeCitation && (
                  <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                    <div className="text-sm font-medium text-zinc-900">{activeCitation.source}</div>
                    <div className="text-xs text-zinc-500">{activeCitation.page}</div>
                    {activeCitation.snippet && (
                      <div className="mt-3 text-sm leading-relaxed text-zinc-700">&ldquo;{activeCitation.snippet}&rdquo;</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
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

function MicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 14.25a3 3 0 0 0 3-3V6.75a3 3 0 0 0-6 0v4.5a3 3 0 0 0 3 3Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 11.25a7.5 7.5 0 0 1-15 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v2.25" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

