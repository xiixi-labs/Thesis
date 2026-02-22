import { useEffect, useRef, useState, useCallback, FormEvent } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { MicIcon, ArrowUpIcon, StopIcon } from "@/components/icons/TheaIcons";

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

function getSpeechRecognitionCtor(): SpeechRecognitionCtorLike | null {
    if (typeof window === "undefined") return null;
    const w = window as unknown as {
        SpeechRecognition?: SpeechRecognitionCtorLike;
        webkitSpeechRecognition?: SpeechRecognitionCtorLike;
    };
    return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

interface ChatInputProps {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    onSubmit: () => void;
    onStop: () => void;
    setVoiceError: (error: string | null) => void;

    // New Perplexity-style props
    isProModel: boolean;
    setIsProModel: React.Dispatch<React.SetStateAction<boolean>>;
    onScopeClick: () => void;
    scopeLabel: string;
    scopeActive: boolean;
    isPersonalPro: boolean;
}

export function ChatInput({
    input,
    setInput,
    isLoading,
    onSubmit,
    onStop,
    setVoiceError,
    isProModel,
    setIsProModel,
    onScopeClick,
    scopeLabel,
    scopeActive,
    isPersonalPro
}: ChatInputProps) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
    const isListeningRef = useRef(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-focus the input if it has content (used for fast quick-prompt auto-submission!)
    useEffect(() => {
        if (input && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [input]);

    useEffect(() => {
        isListeningRef.current = isListening;
    }, [isListening]);

    // Clean up speech recognition on mount/unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch { /* ignore */ }
            }
        };
    }, []);

    const ensureRecognition = useCallback(() => {
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
                const base = prev.trim().length > 0 ? prev.replace(/\s+$/, "") + " " : "";
                return (base + transcript).replace(/\s+$/, "");
            });
        };

        rec.onerror = (e: SpeechRecognitionErrorEventLike) => {
            setVoiceError(e?.error ? `Voice error: ${e.error}` : "Voice error");
            setIsListening(false);
        };

        rec.onend = () => {
            if (isListeningRef.current) {
                try { rec.start(); } catch { /* ignore */ }
            }
        };

        recognitionRef.current = rec;
        return rec;
    }, [setInput, setVoiceError]);

    const toggleListening = useCallback(() => {
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
            } catch { /* ignore */ }
            return next;
        });
    }, [ensureRecognition, setVoiceError]);

    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();
        if (isListening) {
            try { recognitionRef.current?.stop?.(); } catch { /* ignore */ }
            setIsListening(false);
        }
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl w-full">
            <div className="relative flex flex-col gap-3 rounded-[1.5rem] bg-zinc-50/90 border border-zinc-200/80 p-4 shadow-sm transition hover:bg-white hover:border-black/20 focus-within:bg-white focus-within:border-black/20 focus-within:ring-4 focus-within:ring-black/5 backdrop-blur-xl">

                {/* Top Row: The Text Area */}
                <div className="relative w-full">
                    {isListening && (
                        <div className="absolute -top-10 left-0 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            Listening...
                        </div>
                    )}
                    <TextareaAutosize
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        placeholder="Ask Thea anything..."
                        minRows={1}
                        maxRows={10}
                        className="w-full resize-none bg-transparent px-1 text-[17px] text-zinc-900 placeholder:text-zinc-500 focus:outline-none scrollbar-hide leading-relaxed"
                    />
                </div>

                {/* Bottom Row: Toolbar */}
                <div className="flex items-center justify-between pt-1">

                    {/* Left: Settings (Focus & Pro) */}
                    <div className="flex items-center gap-2">
                        {/* Focus Button */}
                        <button
                            type="button"
                            onClick={onScopeClick}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${scopeActive
                                ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                : "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900"
                                }`}
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span className="max-w-[10rem] truncate">{scopeActive ? scopeLabel : "Focus"}</span>
                        </button>

                        {/* Pro Toggle */}
                        <div className="relative group flex items-center">
                            <button
                                type="button"
                                disabled={!isPersonalPro}
                                onClick={() => setIsProModel(!isProModel)}
                                className={`flex items-center gap-1.5 rounded-full pl-2 pr-3 py-1.5 text-sm font-medium transition ${isProModel
                                    ? "bg-amber-100/50 text-amber-700 hover:bg-amber-100"
                                    : "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900"
                                    } ${!isPersonalPro ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-zinc-500" : ""}`}
                            >
                                <div className={`flex items-center justify-center p-0.5 rounded-full transition-colors ${isProModel ? 'bg-amber-500 text-white' : 'bg-zinc-300 text-zinc-500'}`}>
                                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                    </svg>
                                </div>
                                Pro
                            </button>

                            {/* Pro Tooltip (Only shown on hover if NOT Pro) */}
                            {!isPersonalPro && (
                                <div className="absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-50">
                                    <div className="bg-zinc-900 text-white text-xs rounded-lg p-3 shadow-xl text-center leading-relaxed">
                                        <span className="font-semibold text-amber-400 block mb-1.5">Unlock Thea Pro</span>
                                        Upgrade to a <span className="font-semibold">Personal Pro</span> membership to access reasoning models.
                                    </div>
                                    <div className="absolute top-full left-1/2 -mt-px -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Actions (Mic & Send) */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={toggleListening}
                            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:bg-zinc-200/50 ${isListening ? "animate-pulse bg-red-100 text-red-600" : "text-zinc-500"}`}
                            aria-label={isListening ? "Stop voice input" : "Start voice input"}
                        >
                            <MicIcon className="h-5 w-5" />
                        </button>

                        {isLoading ? (
                            <button
                                type="button"
                                onClick={onStop}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition-all hover:bg-red-700"
                                aria-label="Stop generating"
                            >
                                <StopIcon className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm transition-all hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400"
                            >
                                <ArrowUpIcon className="h-5 w-5 stroke-[2.5px]" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-3 text-center">
                <p className="text-[10px] text-zinc-400">
                    Thea may display inaccurate info, including about people, so double-check its responses.
                </p>
            </div>
        </form>
    );
}
