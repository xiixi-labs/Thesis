"use client";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/LogoMark";
import { TheaMark } from "@/components/TheaMark";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { FloatingElement } from "@/components/ui/FloatingElement";
import { TiltWrapper } from "@/components/ui/TiltWrapper";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { MeetTheaSection } from "@/components/MeetTheaSection";

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar if scrolling up or at the very top
      // Hide if scrolling down and past 100px
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const PRIMARY_CTA_LABEL = "Join Waitlist";
  const PRIMARY_CTA_HREF = "/waitlist";

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-zinc-950 relative">
      <HeroBackground />
      {/* Sticky Header */}
      {/* Floating Glass Navbar */}
      <header
        className={`fixed top-8 inset-x-0 z-50 px-6 flex justify-center pointer-events-none transition-transform duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-[150%]'
          }`}
      >
        <div className="w-full max-w-5xl pointer-events-auto">
          <div className="flex items-center justify-between rounded-full border border-white/40 bg-white/65 px-6 py-3 shadow-lg shadow-zinc-900/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/75 hover:shadow-xl hover:shadow-zinc-900/10">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
                <LogoMark className="h-7 w-7" gradientId="thesisLogoGradientHome" />
                <span className="relative z-10 text-lg font-semibold tracking-tight text-zinc-900">Thesis</span>
              </Link>
            </div>

            <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
              <a className="cursor-pointer transition hover:text-zinc-900" onClick={(e) => scrollToSection(e, "who-its-for")}>
                Who it&apos;s for
              </a>
              <a className="cursor-pointer transition hover:text-zinc-900" onClick={(e) => scrollToSection(e, "how-it-works")}>
                How it works
              </a>
              <a className="cursor-pointer transition hover:text-zinc-900" onClick={(e) => scrollToSection(e, "meet-thea")}>
                <span className="inline-block bg-[linear-gradient(90deg,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] bg-[length:200%_100%] bg-clip-text text-transparent motion-safe:animate-[thea-roll_6s_ease_infinite]">
                  Meet Thea
                </span>
              </a>
              <a className="cursor-pointer transition hover:text-zinc-900" onClick={(e) => scrollToSection(e, "security")}>
                Security
              </a>
              <a className="cursor-pointer transition hover:text-zinc-900" onClick={(e) => scrollToSection(e, "pricing")}>
                Pricing
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900">
                Sign in
              </Link>
              <div className="rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-sm shadow-zinc-900/10">
                <a
                  className="inline-flex items-center justify-center rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition hover:bg-white"
                  href={PRIMARY_CTA_HREF}
                >
                  {PRIMARY_CTA_LABEL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative bg-[#fbfbfd] pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          {/* ── HERO (0–10%) ── */}
          <div className="pointer-events-none absolute left-1/2 top-[-10rem] h-[42rem] w-[64rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.55),rgba(255,255,255,0)_62%)] blur-[80px]" />
          <div className="pointer-events-none absolute left-1/2 top-[-4rem] h-[36rem] w-[56rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.50),rgba(255,255,255,0)_60%)] blur-[80px]" />
          <div className="pointer-events-none absolute left-[-8%] top-[1rem] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.48),rgba(255,255,255,0)_62%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[-8%] top-[2rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.46),rgba(255,255,255,0)_62%)] blur-[90px]" />

          {/* ── 12% ── */}
          <div className="pointer-events-none absolute left-[15%] top-[12%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.42),rgba(255,255,255,0)_62%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[-6%] top-[12%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.42),rgba(255,255,255,0)_62%)] blur-[90px]" />

          {/* ── 22% ── */}
          <div className="pointer-events-none absolute left-[-6%] top-[22%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.40),rgba(255,255,255,0)_62%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[10%] top-[22%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.38),rgba(255,255,255,0)_62%)] blur-[90px]" />

          {/* ── 32% ── */}
          <div className="pointer-events-none absolute left-[20%] top-[32%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.40),rgba(255,255,255,0)_62%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[-5%] top-[32%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.38),rgba(255,255,255,0)_62%)] blur-[90px]" />

          {/* ── 42% ── */}
          <div className="pointer-events-none absolute left-[-6%] top-[42%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.40),rgba(255,255,255,0)_62%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[15%] top-[42%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.38),rgba(255,255,255,0)_62%)] blur-[90px]" />

          {/* ── 52% ── */}
          <div className="pointer-events-none absolute left-[10%] top-[52%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.40),rgba(255,255,255,0)_62%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[-6%] top-[52%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.38),rgba(255,255,255,0)_62%)] blur-[90px]" />

          {/* ── 62% ── */}
          <div className="pointer-events-none absolute left-[-5%] top-[62%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.40),rgba(255,255,255,0)_62%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[10%] top-[62%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.38),rgba(255,255,255,0)_62%)] blur-[90px]" />

          {/* ── 72% ── */}
          <div className="pointer-events-none absolute left-[20%] top-[72%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.40),rgba(255,255,255,0)_62%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[-6%] top-[72%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.38),rgba(255,255,255,0)_62%)] blur-[90px]" />

          {/* ── 82% ── */}
          <div className="pointer-events-none absolute left-[-5%] top-[82%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.40),rgba(255,255,255,0)_62%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[15%] top-[82%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.38),rgba(255,255,255,0)_62%)] blur-[90px]" />

          {/* ── 92% ── */}
          <div className="pointer-events-none absolute left-[15%] top-[92%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.42),rgba(255,255,255,0)_62%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[-5%] top-[92%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.40),rgba(255,255,255,0)_62%)] blur-[90px]" />

          {/* Salt-and-pepper grain texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='2' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0 0 1 1 1 0 0 0'/%3E%3C/feComponentTransfer%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='discrete' tableValues='0 1'/%3E%3CfeFuncG type='discrete' tableValues='0 1'/%3E%3CfeFuncB type='discrete' tableValues='0 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px'
            }}
          />
        </div>

        <main className="relative mx-auto w-full max-w-6xl px-6 pb-24">
          {/* ──────────────────────────────────────────────────
              HERO: full viewport height, vertically centered
          ────────────────────────────────────────────────── */}
          <section className="flex min-h-[50vh] flex-col items-center pt-32 pb-16 text-center">
            {/* Headline — big, bold, breathing room */}
            <h1
              className="mt-6 max-w-5xl text-[clamp(3.2rem,8vw,7.5rem)] font-bold leading-[0.95] tracking-[-0.035em] text-zinc-950 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              Learn{" "}
              Anything.
            </h1>

            {/* Subheadline */}
            <p
              className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 sm:text-xl sm:leading-relaxed md:text-[1.35rem] md:leading-[1.75] opacity-0 animate-fade-in-up mx-auto"
              style={{ animationDelay: "200ms" }}
            >
              Upload your notes, readings, and papers. Thea, your AI study partner,
              answers with citations back to your own library — so you always
              know where every idea came from.
            </p>

            {/* CTA buttons */}
            <div
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row opacity-0 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-xl shadow-zinc-900/10 transition hover:shadow-2xl hover:shadow-indigo-500/20">
                <MagneticWrapper strength={0.3} className="inline-block">
                  <a
                    className="inline-flex h-12 items-center justify-center rounded-full bg-white/95 px-8 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                    href={PRIMARY_CTA_HREF}
                  >
                    {PRIMARY_CTA_LABEL}
                  </a>
                </MagneticWrapper>
              </div>
              <a
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white/40 px-8 text-sm font-semibold text-zinc-900 shadow-sm shadow-zinc-900/5 backdrop-blur-2xl transition-all duration-200 hover:bg-white/55 hover:scale-105 cursor-pointer"
                onClick={(e) => scrollToSection(e, "how-it-works")}
              >
                See how it works
              </a>
            </div>

            {/* Scroll indicator */}
            <div
              className="mt-auto pt-10 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "600ms" }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("hero-preview")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex flex-col items-center gap-2 text-zinc-400 transition hover:text-zinc-600"
                aria-label="Scroll down"
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.16em]">See Thea in action</span>
                <svg className="h-5 w-5 motion-safe:animate-bounce" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────
              PRODUCT PREVIEW — its own visual moment
          ────────────────────────────────────────────────── */}
          <section id="hero-preview" className="scroll-mt-24 pt-4 pb-20">
            {/* Section label */}
            <div className="text-center mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-[0.14em]">What it looks like</p>
            </div>

            <div
              className="mx-auto w-full max-w-5xl opacity-0 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-8 md:gap-12 items-start">

                {/* Left Column: The "Question" / Answer Content */}
                <div className="text-left">
                  <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600 mb-6">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Cited Answer
                  </div>

                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-900 leading-tight">
                    &ldquo;Explain this section like I have an exam tomorrow.&rdquo;
                  </h3>

                  <p className="mt-6 text-base md:text-lg leading-relaxed text-zinc-600">
                    Here are the core ideas that show up most often in your notes, plus the exact pages
                    where each point appears — so you can verify every claim.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {["Bio 101 Notes • p. 12", "Lecture 3 Slides • slide 18", "Textbook.pdf • p. 184"].map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 cursor-default"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vertical Divider (Desktop only) */}
                <div className="hidden md:block absolute left-[58%] top-0 bottom-0 w-px bg-zinc-200/60" />

                {/* Right Column: Source Material context */}
                <div className="relative text-left md:pl-8 md:border-l md:border-zinc-200">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400 mb-6">
                    In this notebook
                  </div>

                  <ul className="space-y-4">
                    {[
                      { label: "Week 4: Photosynthesis", meta: "12 pages" },
                      { label: "Lecture notes", meta: "8 pages" },
                      { label: "Assigned reading", meta: "1 PDF" },
                      { label: "Study Guide", meta: "4 pages" },
                    ].map((s) => (
                      <li key={s.label} className="group flex items-center justify-between gap-4 py-1">
                        <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">{s.label}</span>
                        <span className="text-xs text-zinc-400 group-hover:text-zinc-500 transition-colors">{s.meta}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-8 border-t border-zinc-100 flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Supported formats</span>
                    <div className="flex gap-1.5">
                      {["PDF", "DOCX", "PPTX"].map((t) => (
                        <span
                          key={t}
                          className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500 bg-zinc-100/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Early access note */}
            <p className="mt-10 text-center text-sm text-zinc-400">
              Personal plans are in early access — join the waitlist to be first in when we go live.
            </p>
          </section>

          {/* ──────────────────────────────────────────────────
              WHO IT'S FOR
          ────────────────────────────────────────────────── */}
          <section id="who-its-for" className="py-24 md:py-32">
            <RevealOnScroll>
              <div className="text-center mb-20">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500 mb-5">Who it&apos;s for</p>
                <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.02em] text-zinc-950">
                  For independent learners
                  <br className="hidden sm:block" />
                  and researchers.
                </h2>
                <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-zinc-600">
                  Upload what you have, ask what you need, and get cited answers grounded in your own notes.
                </p>
              </div>
            </RevealOnScroll>

            {/* Persona Bento Grid */}
            <RevealOnScroll delay={100}>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* Card 1: Students (Top Left) */}
                <div className="md:col-span-3 h-full">
                  <SpotlightCard className="h-full rounded-[2rem] border-zinc-200 bg-white/50 p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm" spotlightColor="rgba(0,0,0,0.05)">
                    <div className="absolute top-0 right-0 p-8 h-full w-full flex items-center justify-end pointer-events-none overflow-hidden">
                      <div className="relative w-64 h-full -mr-12 -mt-12 opacity-90">
                        {/* Stacked Flashcards Visual */}
                        <div className="absolute top-8 right-8 w-40 h-28 bg-white rounded-xl shadow-sm border border-zinc-200 rotate-6 transform translate-x-2 translate-y-2" />
                        <div className="absolute top-8 right-8 w-40 h-28 bg-white rounded-xl shadow-md border border-zinc-200 rotate-3 transform translate-x-1 translate-y-1" />
                        <div className="absolute top-8 right-8 w-40 h-28 bg-white rounded-xl shadow-lg border border-zinc-200 flex flex-col p-4">
                          <div className="h-1.5 w-12 bg-orange-100 rounded-full mb-3" />
                          <div className="space-y-1.5">
                            <div className="h-1.5 w-full bg-zinc-100 rounded-full" />
                            <div className="h-1.5 w-2/3 bg-zinc-100 rounded-full" />
                          </div>
                          <div className="mt-auto flex gap-2">
                            <div className="h-6 w-full bg-orange-50 rounded-md border border-orange-100" />
                            <div className="h-6 w-full bg-zinc-50 rounded-md border border-zinc-100" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 w-12 h-12 rounded-2xl bg-zinc-100/80 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-20 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2">Students</h3>
                      <p className="text-zinc-600 leading-relaxed font-medium">Turn lectures and readings into cited study guides and exam prep in minutes.</p>
                    </div>
                  </SpotlightCard>
                </div>

                {/* Card 2: Independent Learners (Top Right) */}
                <div className="md:col-span-3 h-full">
                  <SpotlightCard className="h-full rounded-[2rem] border-zinc-200 bg-white/50 p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm" spotlightColor="rgba(0,0,0,0.05)">
                    <div className="absolute top-0 right-0 p-8 h-full w-full flex items-center justify-end pointer-events-none">
                      <div className="relative w-64 h-48 -mr-12 -mt-8 opacity-90">
                        {/* Knowledge Graph Visual */}
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm z-20 transform -translate-x-1/2 -translate-y-1/2" />

                        {/* Nodes */}
                        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-blue-300 rounded-full" />
                        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-blue-300 rounded-full" />
                        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-blue-300 rounded-full" />

                        {/* Edges (using SVG for lines) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                          <path d="M128 96 L85 64" stroke="rgb(147 197 253)" strokeWidth="1.5" strokeOpacity="0.6" />
                          <path d="M128 96 L192 128" stroke="rgb(147 197 253)" strokeWidth="1.5" strokeOpacity="0.6" />
                          <path d="M128 96 L170 48" stroke="rgb(147 197 253)" strokeWidth="1.5" strokeOpacity="0.6" />
                        </svg>

                        {/* Floating Labels */}
                        <div className="absolute top-[28%] left-[28%] bg-white/90 border border-blue-100 rounded px-1.5 py-0.5 text-[8px] font-medium text-blue-600 shadow-sm backdrop-blur-sm">History</div>
                        <div className="absolute bottom-[28%] right-[20%] bg-white/90 border border-blue-100 rounded px-1.5 py-0.5 text-[8px] font-medium text-blue-600 shadow-sm backdrop-blur-sm">Econ</div>
                      </div>
                    </div>
                    <div className="relative z-10 w-12 h-12 rounded-2xl bg-zinc-100/80 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-20 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2">Independent Learners</h3>
                      <p className="text-zinc-600 leading-relaxed font-medium">Ask questions across your entire library and keep every answer grounded in your own notes.</p>
                    </div>
                  </SpotlightCard>
                </div>

                {/* Card 3: Researchers (Bottom Full Width) */}
                <div className="md:col-span-6 h-full">
                  <SpotlightCard className="h-full rounded-[2rem] border-zinc-200 bg-white/50 p-10 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm relative overflow-hidden" spotlightColor="rgba(0,0,0,0.05)">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-50/30 to-transparent opacity-50" />
                    <div className="relative z-10 flex-1 pr-6">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100/80 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-6 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-zinc-900 mb-3">Solo Researchers</h3>
                      <p className="text-zinc-600 leading-relaxed font-medium text-lg max-w-xl">
                        Trace claims back to original passages so your work stays verifiable, organized, and citation-ready.
                      </p>
                    </div>

                    {/* Citation Pipeline Visual */}
                    <div className="relative h-full w-full md:w-1/2 flex items-center justify-center gap-2 opacity-90 mt-8 md:mt-0">
                      {/* Document Node */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-14 bg-white border border-zinc-200 rounded-lg shadow-sm flex items-center justify-center">
                          <span className="text-[10px] font-bold text-zinc-300">PDF</span>
                        </div>
                      </div>

                      {/* Connector Line with Beam */}
                      <div className="flex-1 h-px bg-zinc-200 relative overflow-hidden mx-2">
                        <div className="absolute inset-0 w-1/3 bg-purple-500/50 blur-[2px] animate-[slide-right_2s_linear_infinite]" />
                      </div>

                      {/* Thea Node */}
                      <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shadow-sm z-10">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      </div>

                      {/* Connector Line 2 */}
                      <div className="flex-1 h-px bg-zinc-200 relative overflow-hidden mx-2">
                        <div className="absolute inset-0 w-1/3 bg-purple-500/50 blur-[2px] animate-[slide-right_2s_linear_infinite_0.5s]" />
                      </div>

                      {/* Answer Node */}
                      <div className="w-24 h-14 bg-white border border-purple-100 rounded-xl shadow-sm p-2 flex flex-col gap-1.5 justify-center">
                        <div className="h-1.5 w-3/4 bg-zinc-100 rounded-full" />
                        <div className="h-1.5 w-full bg-zinc-100 rounded-full" />
                        <div className="h-1.5 w-1/2 bg-purple-100 rounded-full" />
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              </div>
            </RevealOnScroll>
          </section>

          {/* ──────────────────────────────────────────────────
              HOW IT WORKS
          ────────────────────────────────────────────────── */}
          <section id="how-it-works" className="py-24 md:py-32">
            <RevealOnScroll>
              <div className="text-center mb-20">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500 mb-5">How it works</p>
                <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.02em] text-zinc-950">
                  Three steps. That&apos;s it.
                </h2>
                <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-zinc-500">
                  Scope your notebook, add material, then ask questions with citations.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={100}>
              <div className="mx-auto max-w-6xl">
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Create a notebook",
                      body: "Start a notebook for each class, project, or topic. The notebook becomes your scope — what Thea is allowed to use.",
                    },
                    {
                      title: "Add your material",
                      body: "Drop in PDFs, docs, and slides. Thesis prepares them so answers can point back to the exact page.",
                    },
                    {
                      title: "Ask and verify",
                      body: "Ask for summaries, comparisons, or practice questions. Every response includes citations so you can check the source.",
                    },
                  ].map((step, i) => (
                    <div
                      key={step.title}
                      className="group relative rounded-2xl border border-zinc-200 bg-white/50 p-8 shadow-sm transition hover:shadow-md hover:bg-white"
                    >
                      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                        {i + 1}
                      </div>

                      <h3 className="text-xl font-semibold text-zinc-900 mb-3">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-zinc-600">{step.body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <div className="flex items-center gap-4 justify-center">
                    <a href="/sign-in" className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
                      Sign in
                    </a>
                    <MagneticWrapper strength={0.2} className="inline-block">
                      <a
                        href={PRIMARY_CTA_HREF}
                        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-zinc-900/20 ring-1 ring-inset ring-zinc-900/10 transition-all hover:bg-zinc-800 hover:scale-105"
                      >
                        {PRIMARY_CTA_LABEL}
                      </a>
                    </MagneticWrapper>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </section>

          {/* ──────────────────────────────────────────────────
              MEET THEA
          ────────────────────────────────────────────────── */}
          <MeetTheaSection />

          {/* ──────────────────────────────────────────────────
              SECURITY — dark section for visual contrast
          ────────────────────────────────────────────────── */}
        </main>
        <section id="security" className="relative py-24 md:py-32 bg-zinc-950 overflow-hidden">
          {/* Subtle grain texture overlay */}
          <NoiseOverlay opacity={0.05} />
          <div className="relative mx-auto w-full max-w-6xl px-6">
            <RevealOnScroll>
              <div className="text-center mb-20">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500 mb-5">Security</p>
                <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.02em] text-white">
                  Your data stays yours.
                </h2>
                <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-zinc-400">
                  Private by default. Encrypted in transit and at rest. Built with serious security in mind from day one.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Security-first infrastructure",
                  body: "Designed with secure defaults, least-privilege access, and auditing in mind so your library stays protected.",
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                },
                {
                  title: "Encryption by default",
                  body: "Data is encrypted in transit (TLS) and at rest. Your knowledge base is private by default.",
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                },
                {
                  title: "Compliance-ready architecture",
                  body: "Built to support stricter requirements and data residency needs as the product expands.",
                  icon: (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                },
              ].map((card, i) => (
                <RevealOnScroll key={card.title} delay={i * 100}>
                  <SpotlightCard
                    className="h-full rounded-2xl border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.08] hover:-translate-y-1"
                    spotlightColor="rgba(255, 255, 255, 0.15)"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-300 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                      {card.icon}
                    </div>
                    <div className="mt-5 text-base font-semibold text-white">{card.title}</div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">{card.body}</p>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </div>

            <RevealOnScroll delay={200}>
              <div className="mt-14 text-center">
                <div className="inline-block rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-lg shadow-indigo-500/20">
                  <a
                    className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-8 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-zinc-900"
                    href={PRIMARY_CTA_HREF}
                  >
                    {PRIMARY_CTA_LABEL}
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>
        <main className="relative mx-auto w-full max-w-6xl px-6 pb-24">

          {/* ──────────────────────────────────────────────────
              PRICING
          ────────────────────────────────────────────────── */}
          <section id="pricing" className="py-24 md:py-32">
            <RevealOnScroll>
              <div className="text-center max-w-2xl mx-auto mb-20">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400 mb-5">Pricing</p>
                <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.02em] text-zinc-950">
                  Simple, honest pricing.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-zinc-500">
                  Three personal plans for solo learners, researchers, and professionals.
                </p>
                <div className="mt-4 flex flex-col items-center gap-1 text-sm text-zinc-500">
                  <span>Billed monthly. Save 15% with annual billing.</span>
                  <span>
                    All plans are in early access —{" "}
                    <a className="font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 transition" href={PRIMARY_CTA_HREF}>
                      {PRIMARY_CTA_LABEL}
                    </a>
                  </span>
                </div>
              </div>
            </RevealOnScroll>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Personal */}
              <RevealOnScroll delay={0}>
                <SpotlightCard className="h-full bg-white/60 border-black/5 rounded-[2.5rem] p-10 flex flex-col shadow-sm backdrop-blur-3xl transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-zinc-950 mb-2">Personal</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-zinc-900">$12.99</span>
                      <span className="text-zinc-500">/month</span>
                    </div>
                    <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
                      For focused studying and getting cited answers from your notes.
                    </p>
                  </div>

                  <div className="flex-1">
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">What&apos;s included</div>
                    <ul className="space-y-3">
                      {[
                        "Upload key PDFs, docs, and slides",
                        "Ask questions and get cited answers from your notes",
                        "Keep a personal knowledge library organized in one place"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-700">
                          <svg className="h-5 w-5 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10">
                    <a href={PRIMARY_CTA_HREF} className="block w-full py-3 px-6 rounded-full border border-black/10 bg-white/50 text-sm font-semibold text-zinc-900 text-center shadow-sm hover:bg-white hover:border-black/20 transition-all duration-300">
                      {PRIMARY_CTA_LABEL}
                    </a>
                  </div>
                </SpotlightCard>
              </RevealOnScroll>

              {/* Personal+ */}
              <RevealOnScroll delay={120}>
                <SpotlightCard className="h-full bg-white/60 border-black/5 rounded-[2.5rem] p-10 flex flex-col shadow-sm backdrop-blur-3xl transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-zinc-950 mb-2">Personal +</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-zinc-900">$19.99</span>
                      <span className="text-zinc-500">/month</span>
                    </div>
                    <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
                      For deep work and more intelligent reasoning on bigger collections of notes.
                    </p>
                  </div>

                  <div className="flex-1">
                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Everything in Personal, plus</div>
                    <ul className="space-y-3">
                      {[
                        "Reason across larger sets of documents at once",
                        "Richer synthesis for long-form questions and study sessions",
                        "More room for the notebooks and topics you care about most"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-700">
                          <svg className="h-5 w-5 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10">
                    <a href={PRIMARY_CTA_HREF} className="block w-full py-3 px-6 rounded-full border border-black/10 bg-white/50 text-sm font-semibold text-zinc-900 text-center shadow-sm hover:bg-white hover:border-black/20 transition-all duration-300">
                      {PRIMARY_CTA_LABEL}
                    </a>
                  </div>
                </SpotlightCard>
              </RevealOnScroll>

              {/* Personal Pro — gradient border */}
              <RevealOnScroll delay={240}>
                <div className="rounded-[2.5rem] bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-2xl shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-500 h-full">
                  <div className="bg-white/95 rounded-[calc(2.5rem-1px)] p-10 flex flex-col relative overflow-hidden group h-full backdrop-blur-3xl">
                    <div className="absolute top-6 right-6">
                      <span className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white">
                        Best value
                      </span>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-zinc-950 mb-2">Personal Pro</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-zinc-900">$29.99</span>
                        <span className="text-zinc-500">/month</span>
                      </div>
                      <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
                        For people who want Thea as a true study partner: conversational, deeply grounded, and built for serious research.
                      </p>
                    </div>

                    <div className="flex-1">
                      <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Everything in Personal +, plus</div>
                      <ul className="space-y-3">
                        {[
                          "Natural Voice Mode: Talk to Thea just like a tutor",
                          "Deeper reasoning and research across your entire knowledge base",
                          "Early access to advanced features like Cross Search and Deep Thesis Projects"
                        ].map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-zinc-700">
                            <svg className="h-5 w-5 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-10">
                      <a href={PRIMARY_CTA_HREF} className="block w-full py-3.5 px-6 rounded-full bg-zinc-900 text-sm font-semibold text-white text-center shadow-lg hover:bg-zinc-800 transition-all duration-300">
                        {PRIMARY_CTA_LABEL}
                      </a>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────
              FAQ
          ────────────────────────────────────────────────── */}
          <section id="faq" className="py-24 md:py-32">
            <RevealOnScroll>
              <div className="text-center mb-14">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400 mb-5">FAQ</p>
                <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] text-zinc-950">
                  Frequently asked questions
                </h2>
              </div>
            </RevealOnScroll>

            <div className="grid gap-4 max-w-5xl mx-auto md:grid-cols-2">
              {[
                {
                  q: "Is my data private?",
                  a: "Yes. Your uploaded documents are stored in an isolated environment. We do not use your data to train our public models. Your data is yours.",
                },
                {
                  q: "What file types do you support?",
                  a: "Currently, we support PDF, DOCX, CSV, and PPTX files. We are adding support for Notion and Google Drive integration soon.",
                },
                {
                  q: "Can I use Thesis for university?",
                  a: "Absolutely. Thesis is perfect for synthesizing lecture notes, research papers, and textbooks into study guides and cited answers.",
                },
                {
                  q: "How accurate are the answers?",
                  a: "Thesis uses Retrieval-Augmented Generation (RAG) to ground every answer in your specific documents. We provide citations for every claim so you can verify the source yourself.",
                },
              ].map((faq, i) => (
                <RevealOnScroll key={i} delay={i * 80}>
                  <FAQItem question={faq.q} answer={faq.a} />
                </RevealOnScroll>
              ))}
            </div>
          </section>

          {/* ──────────────────────────────────────────────────
              ROADMAP
          ────────────────────────────────────────────────── */}
          <section className="py-24 md:py-32">
            <RevealOnScroll>
              <div className="text-center mb-20">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400 mb-5">Roadmap</p>
                <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] text-zinc-950">
                  What&apos;s coming next
                </h2>
                <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-zinc-500">
                  Thesis is in early access. We&apos;re shipping new capabilities for serious learners and
                  researchers, with many of them arriving first for Personal Pro.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {[
                {
                  status: "Coming soon",
                  title: "Cross Search",
                  body: "Ask one question and search across all of your notebooks at once, so Thea can pull from every relevant source in your library.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  ),
                  styles: {
                    iconBg: "bg-zinc-100/80",
                    iconColor: "text-zinc-900",
                    pillBg: "bg-emerald-100/50",
                    pillText: "text-emerald-700",
                    spotlight: "rgba(16, 185, 129, 0.1)"
                  }
                },
                {
                  status: "In development",
                  title: "Deep Thesis Projects",
                  body: "Define long-running projects with goals, key sources, and milestones. Let Thea help you stay organized and surface what matters most.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  ),
                  styles: {
                    iconBg: "bg-zinc-100/80",
                    iconColor: "text-zinc-900",
                    pillBg: "bg-indigo-100/50",
                    pillText: "text-indigo-700",
                    spotlight: "rgba(99, 102, 241, 0.1)"
                  }
                },
                {
                  status: "On the roadmap",
                  title: "Smarter study flows",
                  body: "Guided study sessions, spaced review, and richer multi-step workflows to help you move from reading to real understanding faster.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  styles: {
                    iconBg: "bg-zinc-100/80",
                    iconColor: "text-zinc-900",
                    pillBg: "bg-amber-100/50",
                    pillText: "text-amber-700",
                    spotlight: "rgba(245, 158, 11, 0.1)"
                  }
                },
              ].map((item, i) => (
                <RevealOnScroll key={item.title} delay={i * 100}>
                  <SpotlightCard
                    className="h-full p-8 rounded-[2rem] border border-zinc-200 bg-white/50 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col"
                    spotlightColor={item.styles.spotlight}
                  >
                    <div className={`w-12 h-12 rounded-2xl ${item.styles.iconBg} border border-white/50 flex items-center justify-center ${item.styles.iconColor} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      {item.icon}
                    </div>

                    <div className="mb-4">
                      <span className={`inline-flex items-center rounded-full ${item.styles.pillBg} px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${item.styles.pillText}`}>
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-zinc-900 mb-3">{item.title}</h3>
                    <p className="text-base text-zinc-600 leading-relaxed font-medium">
                      {item.body}
                    </p>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </div>

            <RevealOnScroll delay={200}>
              <div className="mt-14 text-center">
                <div className="inline-block rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-lg shadow-zinc-900/10">
                  <a
                    href={PRIMARY_CTA_HREF}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-white/95 px-8 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition hover:bg-white"
                  >
                    {PRIMARY_CTA_LABEL}
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </section>
        </main>

        {/* Enhanced Footer */}
        <footer className="relative z-10 border-t border-black/5 bg-white/40 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            {/* Main Footer Content */}
            <div className="grid gap-8 md:grid-cols-4">
              {/* Brand Column */}
              <div className="md:col-span-1">
                <Link href="/" className="flex items-center gap-2 transition hover:opacity-80">
                  <LogoMark className="h-7 w-7" gradientId="footerLogo" />
                  <span className="text-lg font-semibold text-zinc-950">Thesis</span>
                </Link>
                <p className="mt-4 text-sm leading-6 text-zinc-600">
                  Turn your knowledge into cited answers. Built for independent learners, students, and solo professionals.
                </p>
                {/* Social Links */}
                <div className="mt-4 flex gap-3">
                  <a href="https://x.com/UseThesisStudio" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/50 text-zinc-600 transition hover:bg-white hover:text-zinc-900">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                  </a>
                  <a href="https://www.instagram.com/usethesisstudio/" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/50 text-zinc-600 transition hover:bg-white hover:text-zinc-900">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.451 2.53c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/thesis-studio" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/50 text-zinc-600 transition hover:bg-white hover:text-zinc-900">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                  </a>
                </div>
              </div>

              {/* Product Column */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">Product</h3>
                <ul className="mt-4 space-y-2">
                  <li><a onClick={(e) => scrollToSection(e, "how-it-works")} className="text-sm text-zinc-600 transition hover:text-zinc-900 cursor-pointer">How it works</a></li>
                  <li><a onClick={(e) => scrollToSection(e, "meet-thea")} className="text-sm text-zinc-600 transition hover:text-zinc-900 cursor-pointer">Meet Thea</a></li>
                  <li><a onClick={(e) => scrollToSection(e, "pricing")} className="text-sm text-zinc-600 transition hover:text-zinc-900 cursor-pointer">Pricing</a></li>
                  <li><a onClick={(e) => scrollToSection(e, "security")} className="text-sm text-zinc-600 transition hover:text-zinc-900 cursor-pointer">Security</a></li>
                  <li><a href={PRIMARY_CTA_HREF} className="text-sm text-zinc-600 transition hover:text-zinc-900">Waitlist</a></li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="/comingsoon" className="text-sm text-zinc-600 transition hover:text-zinc-900">About</a></li>
                  <li><a href="/comingsoon" className="text-sm text-zinc-600 transition hover:text-zinc-900">Blog</a></li>
                  <li><a href="/comingsoon" className="text-sm text-zinc-600 transition hover:text-zinc-900">Careers</a></li>
                  <li><a href="/comingsoon" className="text-sm text-zinc-600 transition hover:text-zinc-900">Contact</a></li>
                </ul>
              </div>

              {/* Newsletter Column */}
              <NewsletterForm />
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 md:flex-row">
              <p className="text-sm text-zinc-500">
                © {new Date().getFullYear()} Thesis. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="/privacy" className="text-sm text-zinc-500 transition hover:text-zinc-900">Privacy Policy</a>
                <a href="/terms" className="text-sm text-zinc-500 transition hover:text-zinc-900">Terms of Service</a>
                <a href="/cookies" className="text-sm text-zinc-500 transition hover:text-zinc-900">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div >
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 shadow-sm backdrop-blur-xl transition hover:bg-white/85">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-base font-semibold text-zinc-900">{question}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
          <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-6 pb-4 text-sm leading-6 text-zinc-600">
          {answer}
        </div>
      </div>
    </div>
  );
}

function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setStatus("error");
        setMessage(data.error);
      } else {
        setStatus("success");
        setMessage("Thanks for subscribing!");
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div>
        <h3 className="text-sm font-semibold text-zinc-950">Stay Updated</h3>
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-950">Stay Updated</h3>
      <p className="mt-4 text-sm text-zinc-600">Get product updates and announcements.</p>
      <form onSubmit={handleSubmit} className="mt-3 grid grid-cols-2 gap-2 w-full">
        <input
          name="firstName"
          type="text"
          placeholder="First name"
          required
          className="h-8 w-full rounded-lg border border-zinc-200 bg-white/90 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 min-w-0"
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last name"
          required
          className="h-8 w-full rounded-lg border border-zinc-200 bg-white/90 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 min-w-0"
        />
        <input
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          className="col-span-2 h-8 w-full rounded-lg border border-zinc-200 bg-white/90 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 min-w-0"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="col-span-2 h-8 w-full rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
        {status === "error" && (
          <p className="col-span-2 text-xs text-red-600">{message}</p>
        )}
      </form>
    </div>
  );
}
