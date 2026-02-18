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
            <span className="flex h-6 w-6 relative items-center justify-center rounded-full bg-emerald-100/50 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
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
            <span className="flex h-6 w-6 relative items-center justify-center rounded-full bg-indigo-100/50 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15.375 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
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
            <span className="flex h-6 w-6 relative items-center justify-center rounded-full bg-amber-100/50 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
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

// ─── Helper Component for Scroll Trigger ─────────────────────────────────────

function ScrollFeature({
    index,
    feature,
    setActiveTab
}: {
    index: number,
    feature: typeof FEATURES[number],
    setActiveTab: (i: number) => void
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (isInView) {
            setActiveTab(index);
        }
    }, [isInView, index, setActiveTab]);

    return (
        <div ref={ref} className="min-h-[40vh] flex flex-col justify-center py-10 opacity-90 transition-opacity duration-500 data-[active=true]:opacity-100" data-active={isInView}>
            <div className={`p-1 mb-4 w-fit rounded-xl bg-zinc-100/50`}>
                {feature.icon(isInView)}
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
            <p className="text-lg text-zinc-600 leading-relaxed max-w-md">
                {feature.description}
            </p>
        </div>
    );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function MeetTheaSection() {
    const [activeTab, setActiveTab] = useState(0);

    const ActiveCard = CARD_COMPONENTS[activeTab];

    return (
        <section id="meet-thea" className="py-24 md:py-32 relative">
            <div className="mx-auto max-w-6xl px-6">

                {/* Header */}
                <div className="mb-20 max-w-2xl">
                    <RevealOnScroll>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500 mb-5">
                            AI study partner
                        </p>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.02em] text-zinc-950">
                            Meet Thea.
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-zinc-600">
                            Thea is the intelligence inside Thesis. She works with your notebooks, not
                            lines of code or the open web.
                        </p>
                    </RevealOnScroll>
                </div>

                <div className="flex flex-col lg:flex-row gap-20 items-start">

                    {/* ── Left: Scrollable Text Blocks ── */}
                    <div className="flex-1 pb-32">
                        {FEATURES.map((feature, i) => (
                            <ScrollFeature
                                key={feature.id}
                                index={i}
                                feature={feature}
                                setActiveTab={setActiveTab}
                            />
                        ))}
                        {/* CTA */}
                        <div className="mt-10 pl-1">
                            <a
                                href={CTA_HREF}
                                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-7 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur-2xl hover:bg-white hover:border-black/20 transition"
                            >
                                {CTA_LABEL}
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* ── Right: Sticky Card Panel ── */}
                    <div className="flex-1 lg:sticky lg:top-32 h-fit">
                        <div className="w-full relative">
                            {/* Ambient glow — transitions with active tab */}
                            <motion.div
                                key={`glow-${activeTab}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className={`absolute -inset-12 rounded-[3.5rem] ${CARD_GRADIENTS[activeTab]} blur-3xl`}
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
                                <div className="relative">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
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
