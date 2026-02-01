"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/LogoMark";
import { TheaMark } from "@/components/TheaMark";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-zinc-950">
      {/* Sticky Header */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
          ? "border-b border-black/5 bg-white/70 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
          }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4 transition hover:opacity-80">
              <LogoMark className="h-8 w-8" gradientId="thesisLogoGradientHome" />
              <span className="relative z-10 text-lg font-semibold tracking-tight">Thesis</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
            <a className="cursor-pointer transition hover:text-zinc-900" onClick={(e) => scrollToSection(e, "who-its-for")}>
              Who it&apos;s for
            </a>
            <a className="cursor-pointer transition hover:text-zinc-900" onClick={(e) => scrollToSection(e, "how-it-works")}>
              How it works
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
            <div className="rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-lg shadow-zinc-900/10">
              <a
                className="inline-flex items-center justify-center rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition hover:bg-white"
                href="/waitlist"
              >
                Join waitlist
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="relative bg-[#fbfbfd] pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Vibrant Ambient Glow - Extended */}
          <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[38rem] w-[58rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.45),rgba(255,255,255,0)_60%)] blur-[80px]" />
          <div className="pointer-events-none absolute left-1/2 top-[-6rem] h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.4),rgba(255,255,255,0)_55%)] blur-[80px]" />
          <div className="pointer-events-none absolute left-[-12rem] top-[2rem] h-[20rem] w-[20rem] md:h-[36rem] md:w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.45),rgba(255,255,255,0)_60%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[-14rem] top-[4rem] h-[22rem] w-[22rem] md:h-[40rem] md:w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.4),rgba(255,255,255,0)_58%)] blur-[90px]" />
          <div className="pointer-events-none absolute left-[12%] top-[24rem] h-[16rem] w-[16rem] md:h-[28rem] md:w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.35),rgba(255,255,255,0)_60%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[8%] top-[32rem] h-[18rem] w-[18rem] md:h-[30rem] md:w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.35),rgba(255,255,255,0)_60%)] blur-[90px]" />


          {/* Lower page ambient glow for continuity */}
          <div className="pointer-events-none absolute left-[-10%] top-[60rem] h-[18rem] w-[18rem] md:h-[30rem] md:w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.3),rgba(255,255,255,0)_60%)] blur-[90px]" />
          <div className="pointer-events-none absolute right-[-5%] top-[70rem] h-[20rem] w-[20rem] md:h-[32rem] md:w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.3),rgba(255,255,255,0)_60%)] blur-[90px]" />


          {/* Mid-page ambient glow for Features & How it works */}
          <div className="pointer-events-none absolute right-[-10%] top-[40%] h-[30rem] w-[30rem] md:h-[40rem] md:w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.4),rgba(255,255,255,0)_60%)] blur-[90px]" />
          <div className="pointer-events-none absolute left-[-5%] top-[55%] h-[32rem] w-[32rem] md:h-[35rem] md:w-[35rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.4),rgba(255,255,255,0)_60%)] blur-[90px]" />

          {/* Lower-page ambient glow for Pricing & FAQ */}
          <div className="pointer-events-none absolute right-[10%] top-[75%] h-[34rem] w-[34rem] md:h-[45rem] md:w-[45rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.35),rgba(255,255,255,0)_60%)] blur-[100px]" />
          <div className="pointer-events-none absolute left-[5%] top-[90%] h-[30rem] w-[30rem] md:h-[30rem] md:w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.4),rgba(255,255,255,0)_60%)] blur-[90px]" />
        </div>

        <main className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-10">
          {/* Statement Hero */}
          <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/45 px-3 py-1 text-xs font-medium text-zinc-800 shadow-sm shadow-zinc-900/5 backdrop-blur-2xl opacity-0 animate-fade-in-up">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Now onboarding teams
            </div>

            <h1
              className="mt-8 max-w-4xl text-6xl font-semibold leading-[1.05] tracking-tight text-zinc-950 sm:text-7xl md:text-8xl opacity-0 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              Learn Anything.
            </h1>

            <p
              className="mt-6 max-w-none whitespace-nowrap text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8 md:text-xl opacity-0 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              Cited answers from your notes.
            </p>

            <div
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row opacity-0 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-xl shadow-zinc-900/10 transition hover:shadow-2xl hover:shadow-indigo-500/20">
                <a
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white/95 px-8 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-105"
                  href="/waitlist"
                >
                  Request access
                </a>
              </div>
              <a
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white/40 px-8 text-sm font-semibold text-zinc-900 shadow-sm shadow-zinc-900/5 backdrop-blur-2xl transition-all duration-200 hover:bg-white/55 hover:scale-105 cursor-pointer"
                onClick={(e) => scrollToSection(e, "how-it-works")}
              >
                See how it works
              </a>
            </div>

            <p
              className="mt-16 text-sm text-zinc-500 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "500ms" }}
            >
              Personal learning coming soon.
            </p>
          </section>





          {/* Who it's for - moved above features for better narrative flow */}
          <section id="who-its-for" className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 mb-4">
                For personal learning and teams.
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg leading-8 text-zinc-600">
                Same core idea: upload what you have, ask what you need, and get answers you can trust.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white/70 border border-black/5 rounded-[2rem] p-8 flex flex-col shadow-sm hover:shadow-lg transition-all backdrop-blur-3xl relative overflow-hidden group min-h-[340px]">
                {/* Icon and Header on same line */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center flex-shrink-0">
                    <svg className="h-7 w-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-950">Personal Learning</h3>
                </div>

                <p className="text-zinc-600 leading-relaxed text-sm mb-6">
                  Turn readings, slides, and notes into study guides, quick summaries, and cited answers.
                </p>

                <ul className="space-y-2 text-sm text-zinc-700 mb-6">
                  <li>Ask questions across PDFs, lectures, and notes</li>
                  <li>Cite exact pages/slides for assignments</li>
                  <li>Keep a clean personal knowledge library</li>
                </ul>

                <div className="mt-auto inline-flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  Personal plans coming soon
                </div>

                {/* Subtle background decoration */}
                <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rounded-full bg-gradient-to-br from-zinc-200/40 to-transparent blur-3xl" />
              </div>

              <div className="bg-white/70 border border-black/5 rounded-[2rem] p-8 flex flex-col shadow-sm hover:shadow-lg transition-all backdrop-blur-3xl relative overflow-hidden group min-h-[340px]">
                {/* Icon and Header on same line */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center flex-shrink-0">
                    <svg className="h-7 w-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-950">Teams</h3>
                </div>

                <p className="text-zinc-600 leading-relaxed text-sm mb-6">
                  Keep knowledge centralized and auditable—from onboarding docs to policies and training.
                </p>

                <ul className="space-y-2 text-sm text-zinc-700 mb-6">
                  <li>Shared workspace with role-based access</li>
                  <li>Grounded answers with citations + audit trail</li>
                  <li>Multi-tenant architecture and isolation</li>
                </ul>

                <div className="mt-auto">
                  <a href="/waitlist" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:text-zinc-700 transition">
                    Get started
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>

                {/* Subtle background decoration */}
                <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rounded-full bg-gradient-to-br from-zinc-200/40 to-transparent blur-3xl" />
              </div>
            </div>
          </section>

          {/* How it works - renamed from "Everything is a database" */}
          <section id="how-it-works" className="mt-24">
            <div className="text-center py-8">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-950">How it works</h2>
              <p className="mt-3 text-lg text-zinc-600">Upload, ask, and get cited answers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1: Ingestion */}
              <div className="bg-white/70 border border-black/5 rounded-[2rem] p-8 flex flex-col shadow-sm hover:shadow-lg transition-all backdrop-blur-3xl relative overflow-hidden group min-h-[340px]">
                {/* Icon and Header on same line */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center flex-shrink-0">
                    <svg className="h-7 w-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-950">Secure Ingestion</h3>
                </div>
                <p className="text-zinc-600 leading-relaxed text-sm">
                  Drag and drop your PDFs, docs, and slides. We encrypt, process, and index your knowledge base instantly, creating a private understanding of your work.
                </p>

                {/* Subtle background decoration */}
                <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rounded-full bg-gradient-to-br from-zinc-200/40 to-transparent blur-3xl" />
              </div>

              {/* Step 2: Reasoning */}
              <div className="bg-white/70 border border-black/5 rounded-[2rem] p-8 flex flex-col shadow-sm hover:shadow-lg transition-all backdrop-blur-3xl relative overflow-hidden group min-h-[340px]">
                {/* Icon and Header on same line */}
                <div className="mb-6 flex items-center gap-4 relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center flex-shrink-0">
                    <svg className="h-7 w-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-950">Neural Analysis</h3>
                </div>
                <p className="text-zinc-600 leading-relaxed text-sm relative z-10">
                  Thea reads every sentence, connecting concepts across documents to build a contextual map of your information—without you lifting a finger.
                </p>

                {/* Vibrant Thea Orb - NO opacity reduction */}
                <div className="absolute right-[-2.5rem] bottom-[-2.5rem] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                  <TheaMark className="h-40 w-40" />
                </div>
              </div>

              {/* Step 3: Synthesis */}
              <div className="bg-white/70 border border-black/5 rounded-[2rem] p-8 flex flex-col shadow-sm hover:shadow-lg transition-all backdrop-blur-3xl relative overflow-hidden group min-h-[340px]">
                {/* Icon and Header on same line */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center flex-shrink-0">
                    <svg className="h-7 w-7 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-950">Cited Retrieval</h3>
                </div>

                <p className="text-zinc-600 leading-relaxed text-sm mb-6">
                  Ask complex questions and receive complete answers. Every claim is backed by a direct, clickable citation to the exact source page.
                </p>

                {/* CTA for flow completion */}
                <div className="mt-auto">
                  <a href="/waitlist" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group/link">
                    Start Researching
                    <svg className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>

                {/* Subtle background decoration */}
                <div className="absolute left-[-30px] bottom-[-30px] h-32 w-32 rounded-full bg-gradient-to-br from-emerald-200/30 to-transparent blur-3xl" />
              </div>
            </div>
          </section>

          <section id="security" className="mt-24">
            <div className="rounded-[2rem] border border-black/10 bg-white/65 p-10 md:p-12 shadow-[0_22px_70px_-25px_rgba(0,0,0,0.20)] backdrop-blur-3xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                    Built with enterprise constraints in mind.
                  </h2>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
                    Keep tenant data isolated, minimize what&apos;s sent to the model, and maintain auditability from day one.
                  </p>
                </div>
                <div className="w-fit self-center rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-lg shadow-zinc-900/10 md:self-auto flex-shrink-0">
                  <a
                    className="inline-flex h-11 items-center justify-center rounded-full bg-white/95 px-6 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition hover:bg-white"
                    href="/waitlist"
                  >
                    Talk to sales
                  </a>
                </div>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-white/65 p-6 backdrop-blur-2xl shadow-sm shadow-zinc-900/5 transition hover:shadow-md hover:bg-white/80 group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="h-6 w-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-zinc-950 mb-1">SOC 2 Type 2 Infrastructure</div>
                      <p className="text-sm leading-6 text-zinc-600">
                        Built on enterprise-grade infrastructure verified for security, availability, and confidentiality.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white/65 p-6 backdrop-blur-2xl shadow-sm shadow-zinc-900/5 transition hover:shadow-md hover:bg-white/80 group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="h-6 w-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-zinc-950 mb-1">End-to-End Encryption</div>
                      <p className="text-sm leading-6 text-zinc-600">
                        Data is encrypted at rest (AES-256) and in transit (TLS 1.3). Your knowledge base is private by default.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white/65 p-6 backdrop-blur-2xl shadow-sm shadow-zinc-900/5 transition hover:shadow-md hover:bg-white/80 group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="h-6 w-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-zinc-950 mb-1">HIPAA & GDPR Ready</div>
                      <p className="text-sm leading-6 text-zinc-600">
                        Architecture designed to support Business Associate Agreements (BAA) and data residency requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="pricing" className="mt-24">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-semibold tracking-tight text-zinc-950 mb-4">Pricing</h2>
              <p className="text-lg leading-8 text-zinc-600">
                Team plans. Start small, upgrade when you&apos;re ready, and keep enterprise controls available from day one.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                <span className="text-zinc-500">Personal learning: coming soon —</span>
                <a className="font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 transition" href="/waitlist">
                  join the waitlist
                </a>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Startup */}
              <div className="bg-white/60 border border-black/5 rounded-[2.5rem] p-10 flex flex-col shadow-sm backdrop-blur-3xl relative overflow-hidden group hover:shadow-md transition-all duration-500">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-zinc-950 mb-2">Start-Up</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-zinc-900">$250</span>
                    <span className="text-zinc-500">/month</span>
                  </div>
                  <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
                    Perfect for small teams getting started with AI-powered research.
                  </p>
                </div>

                <div className="flex-1">
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Features</div>
                  <ul className="space-y-3">
                    {[
                      "Up to 10 users",
                      "Document + note ingestion",
                      "Answers with citations",
                      "Org-level workspace"
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
                  <a href="/waitlist" className="block w-full py-3 px-6 rounded-full border border-black/10 bg-white/50 text-sm font-semibold text-zinc-900 text-center shadow-sm hover:bg-white hover:border-black/20 transition-all duration-300">
                    Join waitlist
                  </a>
                </div>
              </div>

              {/* Business */}
              <div className="bg-white/70 border border-black/10 rounded-[2.5rem] p-10 flex flex-col shadow-xl backdrop-blur-3xl relative overflow-hidden group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                <div className="absolute top-6 right-6">
                  <span className="inline-flex items-center rounded-full bg-zinc-900/5 border border-black/5 px-3 py-1 text-xs font-medium text-zinc-900 backdrop-blur-sm">
                    Most popular
                  </span>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-zinc-950 mb-2">Business</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-zinc-900">$500</span>
                    <span className="text-zinc-500">/month</span>
                  </div>
                  <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
                    For growing teams requiring advanced controls and support.
                  </p>
                </div>

                <div className="flex-1">
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Everything in Start-Up, plus:</div>
                  <ul className="space-y-3">
                    {[
                      "Up to 50 users",
                      "Admin controls + role gating",
                      "Priority support",
                      "Advanced analytics"
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
                  <a href="/waitlist" className="block w-full py-3 px-6 rounded-full border border-black/10 bg-white/50 text-sm font-semibold text-zinc-900 text-center shadow-sm hover:bg-white hover:border-black/20 transition-all duration-300">
                    Join waitlist
                  </a>
                </div>
              </div>

              {/* Enterprise */}
              <div className="bg-white/60 border border-black/5 rounded-[2.5rem] p-10 flex flex-col shadow-sm backdrop-blur-3xl relative overflow-hidden group hover:shadow-md transition-all duration-500">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-zinc-950 mb-2">Enterprise</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-zinc-900">Custom</span>
                  </div>
                  <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
                    Custom solutions for large organizations with specific needs.
                  </p>
                </div>

                <div className="flex-1">
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Everything in Business, plus:</div>
                  <ul className="space-y-3">
                    {[
                      "Unlimited users",
                      "SAML / SSO",
                      "Advanced governance + audit",
                      "Dedicated onboarding"
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
                  <a href="/waitlist" className="block w-full py-3 px-6 rounded-full border border-black/10 bg-zinc-900 text-sm font-semibold text-white text-center shadow-lg hover:bg-zinc-800 transition-all duration-300">
                    Contact sales
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 text-center">
              Frequently asked questions
            </h2>

            <div className="mt-8 grid gap-4 max-w-5xl mx-auto md:grid-cols-2">
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
                <FAQItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
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
                  Turn your knowledge into cited answers. Built for teams and students.
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
                  <li><a onClick={(e) => scrollToSection(e, "pricing")} className="text-sm text-zinc-600 transition hover:text-zinc-900 cursor-pointer">Pricing</a></li>
                  <li><a onClick={(e) => scrollToSection(e, "security")} className="text-sm text-zinc-600 transition hover:text-zinc-900 cursor-pointer">Security</a></li>
                  <li><a href="/waitlist" className="text-sm text-zinc-600 transition hover:text-zinc-900">Waitlist</a></li>
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
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">Stay Updated</h3>
                <p className="mt-4 text-sm text-zinc-600">Get product updates and announcements.</p>
                <form className="mt-3 flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="h-9 flex-1 rounded-lg border border-zinc-200 bg-white/90 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
                  />
                  <button
                    type="submit"
                    className="h-9 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
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
