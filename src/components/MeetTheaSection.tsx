"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { FloatingElement } from "@/components/ui/FloatingElement";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const CTA_HREF = "/waitlist";
const CTA_LABEL = "Join Waitlist";

// ─── Content definitions ────────────────────────────────────────────────────────

const FEATURES = [
    {
        id: 0,
        color: "emerald",
        icon: (active: boolean) => (
            <span className={`flex h-6 w-6 relative items-center justify-center rounded-full transition-colors duration-300 ${active ? 'bg-emerald-100/50 text-emerald-600' : 'bg-black/5 text-zinc-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
            </span>
        ),
        title: "Research assistant for your own files",
        description: "Grounded in the notebooks and documents you choose to include. No hallucinations, just your data.",
        accentClass: "border-emerald-500",
        glowClass: "shadow-[0_0_12px_rgba(16,185,129,0.4)]",
    },
    {
        id: 1,
        color: "indigo",
        icon: (active: boolean) => (
            <span className={`flex h-6 w-6 relative items-center justify-center rounded-full transition-colors duration-300 ${active ? 'bg-indigo-100/50 text-indigo-600' : 'bg-black/5 text-zinc-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                </svg>
            </span>
        ),
        title: "Citations on every answer",
        description: "Inspect the exact source page for every claim. Ensure your work is verifiable and accurate.",
        accentClass: "border-indigo-500",
        glowClass: "shadow-[0_0_12px_rgba(99,102,241,0.4)]",
    },
    {
        id: 2,
        color: "amber",
        icon: (active: boolean) => (
            <span className={`flex h-6 w-6 relative items-center justify-center rounded-full transition-colors duration-300 ${active ? 'bg-amber-100/50 text-amber-600' : 'bg-black/5 text-zinc-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </span>
        ),
        title: "Built for deep work",
        description: "Multi-step study sessions, not just one-off questions. Build clarity over time.",
        accentClass: "border-amber-500",
        glowClass: "shadow-[0_0_12px_rgba(245,158,11,0.4)]",
    },
] as const;

// ─── Card: Research (Tab 0) ──────────────────────────────────────────────────

function ResearchCard() {
    return (
        <div className="space-y-4">
            {/* Prompt */}
            <div className="rounded-2xl border border-black/5 bg-white/50 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Ask</p>
                    <span className="rounded-full bg-zinc-900/5 px-2 py-1 text-[10px] font-medium text-zinc-500">⌘K</span>
                </div>
                <p className="mt-2 text-sm text-zinc-900 font-medium">
                    Summarize this notebook like I have an exam tomorrow. What should I focus on?
                </p>
            </div>

            {/* Cited answer */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 px-5 py-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600">Thea</p>
                    <span className="text-[10px] text-zinc-400">0.8s</span>
                </div>
                <p className="mb-3 text-sm text-zinc-800 leading-relaxed">Focus on these three ideas:</p>
                <div className="space-y-2">
                    {[
                        { text: "Light reactions produce ATP/NADPH", tag: "p. 12" },
                        { text: "Calvin cycle fixes carbon", tag: "slide 18" },
                        { text: "Limiting factors: light, CO₂, temp", tag: "p. 184" },
                    ].map((item) => (
                        <div key={item.text} className="flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2 border border-emerald-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="text-sm text-zinc-700 flex-1">{item.text}</span>
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100/50 px-1.5 py-0.5 rounded">
                                {item.tag}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Card: Citations (Tab 1) ─────────────────────────────────────────────────

function CitationsCard() {
    return (
        <div className="space-y-4">
            {/* Source document preview */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-50/50 px-5 py-4 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Source</p>
                    <span className="rounded-full bg-indigo-100/50 px-2 py-1 text-[10px] font-semibold text-indigo-700">Bio 101 Notes</span>
                </div>
                <div className="space-y-2 text-sm text-zinc-600 leading-relaxed">
                    <p className="opacity-70">The light-dependent reactions occur in the thylakoid membranes...</p>
                    {/* Highlighted passage */}
                    <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 text-zinc-900 font-medium relative">
                        Light reactions produce ATP and NADPH, which are then used in the Calvin cycle.
                    </div>
                    <p className="opacity-70">These products are essential for the subsequent carbon fixation process.</p>
                </div>
            </div>

            {/* Citations List */}
            <div className="rounded-2xl border border-black/5 bg-white/50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 mb-3">References</p>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-white/60 px-3 py-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="flex-1 text-xs text-zinc-700">Light reactions → ATP/NADPH</span>
                        <span className="text-[10px] font-medium text-zinc-400">p. 12</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-white/60 px-3 py-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="flex-1 text-xs text-zinc-700">Limiting factors</span>
                        <span className="text-[10px] font-medium text-zinc-400">p. 184</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Card: Deep Work (Tab 2) ─────────────────────────────────────────────────

function DeepWorkCard() {
    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-black/5 bg-white/50 px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">Study session</p>
                </div>
                <div className="space-y-3">
                    <div className="bg-white/60 rounded-xl p-3 text-sm text-zinc-800 border border-black/5">
                        What is the Calvin cycle?
                    </div>
                    <div className="bg-amber-50/50 rounded-xl p-3 text-sm text-zinc-800 border border-amber-500/10 ml-4">
                        The Calvin cycle fixes atmospheric CO₂ into glucose...
                    </div>
                    <div className="bg-white/60 rounded-xl p-3 text-sm text-zinc-800 border border-black/5">
                        <span className="text-amber-600 font-medium text-xs block mb-1">New Question</span>
                        Can you quiz me on this?
                    </div>
                </div>
            </div>

            {/* Quiz prompt chips */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-50/50 px-5 py-4 backdrop-blur-md shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700 mb-3">Quiz mode ready</p>
                <div className="flex gap-2 flex-wrap">
                    {["Start quiz", "Flashcards instead", "Next topic"].map((p) => (
                        <span key={p} className="rounded-full border border-amber-500/30 bg-white/80 px-3 py-1.5 text-xs text-amber-900 font-medium">
                            {p}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Card panel switcher ─────────────────────────────────────────────────────

const CARD_COMPONENTS = [ResearchCard, CitationsCard, DeepWorkCard];

const CARD_GRADIENTS = [
    "bg-[radial-gradient(circle_at_top,#10b98115,transparent_70%)]",   // emerald tint (research)
    "bg-[radial-gradient(circle_at_top,#6366f115,transparent_70%)]",   // indigo (citations)
    "bg-[radial-gradient(circle_at_top,#f59e0b15,transparent_70%)]",   // amber (deep work)
];

// ─── Main component ──────────────────────────────────────────────────────────

export function MeetTheaSection() {
    const [activeTab, setActiveTab] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    const ActiveCard = CARD_COMPONENTS[activeTab];

    // Auto-advance tabs
    useEffect(() => {
        if (isHovering) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    setActiveTab((current) => (current + 1) % FEATURES.length);
                    return 0;
                }
                return prev + 1; // Roughly 5-8 seconds per tab (100 steps * 50ms)
            });
        }, 60);

        return () => clearInterval(interval);
    }, [isHovering, activeTab]);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
        setProgress(0);
    };

    return (
        <section id="meet-thea" className="py-24 md:py-32 relative overflow-hidden">
            <div className="mx-auto max-w-6xl px-6">

                {/* Header */}
                <div className="mb-16 max-w-2xl text-center mx-auto md:text-left md:mx-0">
                    <RevealOnScroll>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] text-zinc-950">
                            Meet Thea.
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-zinc-600">
                            Thea is the intelligence inside Thesis. She works with your notebooks, not
                            lines of code or the open web.
                        </p>
                    </RevealOnScroll>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}>

                    {/* ── Left: Interactive Feature Tabs ── */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        {FEATURES.map((feature, i) => {
                            const isActive = activeTab === i;
                            return (
                                <button
                                    key={feature.id}
                                    onClick={() => handleTabClick(i)}
                                    className={`relative text-left flex flex-col gap-3 p-6 rounded-3xl transition-all duration-300 border ${isActive
                                        ? "bg-white/80 border-black/10 shadow-sm shadow-black/5"
                                        : "bg-white/30 border-transparent hover:bg-white/50"
                                        }`}
                                >
                                    {/* Progress Bar Background (Active Only) */}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 h-1 bg-zinc-100 w-full overflow-hidden rounded-b-3xl">
                                            <motion.div
                                                className={`h-full bg-${feature.color}-500/50`}
                                                initial={{ width: "0%" }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ ease: "linear", duration: 0.06 }}
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-colors duration-300`}>
                                            {feature.icon(isActive)}
                                        </div>
                                        <h3 className={`text-xl font-bold transition-colors duration-300 ${isActive ? 'text-zinc-900' : 'text-zinc-500'}`}>
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className={`text-base leading-relaxed transition-all duration-300 ${isActive ? 'text-zinc-600 opacity-100 max-h-40' : 'text-zinc-500 opacity-0 max-h-0 overflow-hidden'}`}>
                                        {feature.description}
                                    </p>
                                </button>
                            );
                        })}

                    </div>

                    {/* ── Right: Spotlight Card Panel ── */}
                    <div className="lg:col-span-7 relative h-full min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
                        <div className="w-full relative">
                            {/* Ambient glow — transitions with active tab */}
                            <motion.div
                                key={`glow-${activeTab}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className={`absolute -inset-16 rounded-[4rem] ${CARD_GRADIENTS[activeTab]} blur-3xl`}
                            />

                            {/* Card shell */}
                            <SpotlightCard className="relative w-full rounded-[2.5rem] border-white/20 bg-white/60 p-8 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.12)] backdrop-blur-2xl overflow-hidden flex flex-col" spotlightColor="rgba(255,255,255,0.4)">

                                {/* Header (Staticish) */}
                                <div className="flex items-start justify-between gap-4 mb-8">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                                            Private Workspace
                                        </p>
                                        <p className="mt-1 text-base font-bold text-zinc-900">Bio 101 — Finals Prep</p>
                                    </div>
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={`badge-${activeTab}`}
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${activeTab === 0 ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                                                activeTab === 1 ? "border-indigo-200 bg-indigo-50 text-indigo-700" :
                                                    "border-amber-200 bg-amber-50 text-amber-700"
                                                }`}
                                        >
                                            {activeTab === 0 && "Researching"}
                                            {activeTab === 1 && "Verifying"}
                                            {activeTab === 2 && "Studying"}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>

                                {/* Animated card body */}
                                <div className="relative isolate" style={{ transform: "translateZ(0)" }}>
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            className="w-full"
                                        >
                                            <ActiveCard />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </SpotlightCard>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
