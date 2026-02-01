"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { TheaMark } from '@/components/TheaMark';

// --- SHARED COMPONENTS (Reused from Waitlist for consistency) ---

const ThesisBackground = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative w-full overflow-hidden bg-[#fbfbfd] text-zinc-950 ${className}`}>
        {/* Enhanced Animated Gradient Blobs */}
        <div
            className="pointer-events-none absolute left-[-20%] top-[-10%] h-[25rem] w-[25rem] md:left-[-20%] md:top-[-15%] md:h-[55rem] md:w-[55rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.5),rgba(255,255,255,0)_65%)] blur-[80px] md:blur-[120px]"
            style={{ animation: 'blob-float 25s ease-in-out infinite' }}
        />
        <div
            className="pointer-events-none absolute left-[5%] top-[5%] h-[20rem] w-[20rem] md:left-[5%] md:top-[15%] md:h-[40rem] md:w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.48),rgba(255,255,255,0)_65%)] blur-[70px] md:blur-[110px]"
            style={{ animation: 'blob-float-alt 20s ease-in-out infinite 2s' }}
        />
        <div
            className="pointer-events-none absolute right-[-10%] top-[20%] h-[22rem] w-[22rem] md:right-[-15%] md:top-[5%] md:h-[48rem] md:w-[48rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.45),rgba(255,255,255,0)_65%)] blur-[70px] md:blur-[110px]"
            style={{ animation: 'blob-float 22s ease-in-out infinite 4s' }}
        />
        <div
            className="pointer-events-none absolute bottom-[-5%] right-[5%] h-[24rem] w-[24rem] md:bottom-[-20%] md:right-[10%] md:h-[50rem] md:w-[50rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.4),rgba(255,255,255,0)_65%)] blur-[75px] md:blur-[115px]"
            style={{ animation: 'blob-float-alt 28s ease-in-out infinite 1s' }}
        />

        {/* Subtle Grain Texture Overlay */}
        <div
            className="pointer-events-none absolute inset-0 opacity-[0.015]"
            style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
            }}
        />

        {children}
    </div>
);

const ThesisButton = ({ children, className = "", disabled }: { children: React.ReactNode; className?: string, disabled?: boolean }) => (
    <button
        disabled={disabled}
        className={`flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 px-6 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
    >
        {children}
    </button>
);

export default function ComingSoonPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        // Simulate network request
        setTimeout(() => {
            setStatus("success");
            setEmail("");
        }, 1500);
    };

    return (
        <ThesisBackground className="min-h-screen flex flex-col items-center justify-center p-6">
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <div
                    className="opacity-0"
                    style={{ animation: 'fade-in 0.8s ease-out 0.2s forwards' }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </header>

            <div className="max-w-xl w-full text-center relative z-10">
                {/* Large Ambient Thea Mark Animation */}
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-0"
                    style={{ animation: 'fade-in 1.5s ease-out 0.5s forwards' }}
                >
                    <TheaMark className="h-[400px] w-[400px] opacity-[0.07]" />
                </div>


                <h1
                    className="text-4xl md:text-6xl font-bold text-zinc-950 mb-6 tracking-tight opacity-0"
                    style={{ animation: 'slide-up 0.8s ease-out 0.3s forwards' }}
                >
                    Coming Soon
                </h1>

                <p
                    className="text-lg text-zinc-600 mb-10 leading-relaxed opacity-0"
                    style={{ animation: 'slide-up 0.8s ease-out 0.4s forwards' }}
                >
                    We're building something extraordinary. Subscribe to our newsletter to get early access and updates when we launch this page.
                </p>

                <div
                    className="w-full max-w-md mx-auto opacity-0"
                    style={{ animation: 'slide-up 0.8s ease-out 0.5s forwards' }}
                >
                    {status === "success" ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 text-center shadow-sm backdrop-blur-xl animate-scale-in">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-lg font-semibold text-emerald-900">Subscribed!</h3>
                            <p className="text-sm text-emerald-700 mt-1">Thank you for joining our newsletter.</p>
                            <button onClick={() => setStatus("idle")} className="mt-4 text-xs font-medium text-emerald-600 underline hover:text-emerald-800 transition">
                                Subscribe another email
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="h-12 w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 text-base md:text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/30 backdrop-blur-lg transition-all hover:bg-white/90 shadow-sm"
                                />
                            </div>
                            <ThesisButton disabled={status === "loading"}>
                                {status === "loading" ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Subscribing...
                                    </div>
                                ) : "Notify Me"}
                            </ThesisButton>
                        </form>
                    )}
                </div>
            </div>
        </ThesisBackground>
    );
}
