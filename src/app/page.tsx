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

  const PRIMARY_CTA_LABEL = "Join Waitlist";
  const PRIMARY_CTA_HREF = "/waitlist";

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
            <div className="rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-lg shadow-zinc-900/10">
              <a
                className="inline-flex items-center justify-center rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition hover:bg-white"
                href={PRIMARY_CTA_HREF}
              >
                {PRIMARY_CTA_LABEL}
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="relative bg-[#fbfbfd] pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Ambient Glow (calmer + fewer layers for a more "Apple" feel) */}
          <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[38rem] w-[58rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.38),rgba(255,255,255,0)_62%)] blur-[90px]" />
          <div className="pointer-events-none absolute left-1/2 top-[-6rem] h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.36),rgba(255,255,255,0)_60%)] blur-[90px]" />
          <div className="pointer-events-none absolute left-[-12rem] top-[2rem] h-[20rem] w-[20rem] md:h-[36rem] md:w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.32),rgba(255,255,255,0)_62%)] blur-[100px]" />
          <div className="pointer-events-none absolute right-[-14rem] top-[4rem] h-[22rem] w-[22rem] md:h-[40rem] md:w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.30),rgba(255,255,255,0)_62%)] blur-[100px]" />

          {/* Mid + lower page (subtle continuity) */}
          <div className="pointer-events-none absolute left-[-6%] top-[55%] h-[32rem] w-[32rem] md:h-[35rem] md:w-[35rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.22),rgba(255,255,255,0)_62%)] blur-[110px]" />
          <div className="pointer-events-none absolute right-[10%] top-[78%] h-[34rem] w-[34rem] md:h-[45rem] md:w-[45rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.24),rgba(255,255,255,0)_62%)] blur-[120px]" />
          <div className="pointer-events-none absolute left-[5%] top-[92%] h-[30rem] w-[30rem] md:h-[30rem] md:w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.22),rgba(255,255,255,0)_62%)] blur-[110px]" />
          {/* Salt-and-pepper grain texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='2' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0 0 1 1 1 0 0 0'/%3E%3C/feComponentTransfer%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='discrete' tableValues='0 1'/%3E%3CfeFuncG type='discrete' tableValues='0 1'/%3E%3CfeFuncB type='discrete' tableValues='0 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px'
            }}
          />
        </div>

        <main className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-10">
          {/* Statement Hero */}
          <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/45 px-3 py-1 text-xs font-medium text-zinc-800 shadow-sm shadow-zinc-900/5 backdrop-blur-2xl opacity-0 animate-fade-in-up">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Now onboarding personal accounts
            </div>

            <h1
              className="mt-8 max-w-4xl text-6xl font-semibold leading-[1.05] tracking-tight text-zinc-950 sm:text-7xl md:text-8xl opacity-0 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              Learn Anything.
            </h1>

            <p
              className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl sm:leading-9 md:text-2xl opacity-0 animate-fade-in-up mx-auto"
              style={{ animationDelay: "200ms" }}
            >
              Upload your notes, readings, and papers. Thea, your AI study partner, answers with
              citations back to your own library — so you always know where every idea came from.
            </p>

            <div
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row opacity-0 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-xl shadow-zinc-900/10 transition hover:shadow-2xl hover:shadow-indigo-500/20">
                <a
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white/95 px-8 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-105"
                  href={PRIMARY_CTA_HREF}
                >
                  {PRIMARY_CTA_LABEL}
                </a>
              </div>
              <a
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white/40 px-8 text-sm font-semibold text-zinc-900 shadow-sm shadow-zinc-900/5 backdrop-blur-2xl transition-all duration-200 hover:bg-white/55 hover:scale-105 cursor-pointer"
                onClick={(e) => scrollToSection(e, "how-it-works")}
              >
                See how it works
              </a>
            </div>

            {/* Hero product preview (cited answers) */}
            <div
              className="mt-14 w-full max-w-5xl opacity-0 animate-fade-in-up"
              style={{ animationDelay: "420ms" }}
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/65 shadow-[0_22px_70px_-25px_rgba(0,0,0,0.22)] backdrop-blur-3xl">
                <div className="grid md:grid-cols-[1.2fr_0.8fr]">
                  <div className="p-6 md:p-8 text-left">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                      Cited answer
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                      From your notebooks
                    </div>
                    <h3 className="mt-4 text-xl md:text-2xl font-semibold tracking-tight text-zinc-950">
                      “Explain this section like I have an exam tomorrow.”
                    </h3>
                    <p className="mt-3 text-sm md:text-base leading-6 md:leading-7 text-zinc-600 max-w-2xl">
                      Here are the core ideas that show up most often in your notes, plus the exact pages
                      where each point appears — so you can verify every claim.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {["Bio 101 Notes • p. 12", "Lecture 3 Slides • slide 18", "Textbook.pdf • p. 184"].map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="relative border-t border-black/5 bg-white/35 p-6 md:p-8 md:border-t-0 md:border-l text-left">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      In this notebook
                    </div>
                    <ul className="mt-4 space-y-3">
                      {[
                        { label: "Week 4: Photosynthesis", meta: "12 pages" },
                        { label: "Lecture notes", meta: "8 pages" },
                        { label: "Assigned reading", meta: "1 PDF" },
                      ].map((s) => (
                        <li key={s.label} className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-zinc-800">{s.label}</span>
                          <span className="text-xs text-zinc-500">{s.meta}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {["PDF", "DOCX", "PPTX"].map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-black/10 bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-zinc-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-16 -bottom-16 opacity-[0.85]">
                  <TheaMark className="h-48 w-48" />
                </div>
              </div>
            </div>

            <p
              className="mt-12 text-sm text-zinc-500 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "500ms" }}
            >
              Personal plans are in early access — join the waitlist to be first in when we go live.
            </p>
          </section>





          {/* Who it's for - focused on individuals */}
          <section id="who-its-for" className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 mb-4">
                For independent learners and researchers.
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-lg leading-8 text-zinc-600">
                Upload what you have, ask what you need, and get cited answers grounded in your own notes.
              </p>
            </div>

            {/* Persona strip (lighter than full cards) */}
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Students",
                  body: "Turn lectures and readings into cited study guides and exam prep in minutes.",
                },
                {
                  label: "Independent learners",
                  body: "Ask questions across your library and keep every answer grounded in your own sources.",
                },
                {
                  label: "Solo researchers",
                  body: "Trace claims back to original passages so your work stays verifiable and organized.",
                },
              ].map((p) => (
                <div
                  key={p.label}
                  className="rounded-[1.75rem] border border-black/10 bg-white/55 p-6 shadow-sm shadow-zinc-900/5 backdrop-blur-2xl transition hover:bg-white/70"
                >
                  <div className="text-sm font-semibold text-zinc-950">{p.label}</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{p.body}</p>
                </div>
              ))}
            </div>

            {/* Compact credibility (not reviews) */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
              {["Citations on every answer", "Notebook-scoped", "Private by default", "PDF • DOCX • PPTX"].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-black/10 bg-white/55 px-3 py-1 font-medium text-zinc-700 backdrop-blur"
                >
                  {c}
                </span>
              ))}
            </div>
          </section>

          {/* How it works - renamed from "Everything is a database" */}
          <section id="how-it-works" className="mt-24">
            <div className="text-center py-8">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-950">How it works</h2>
              <p className="mt-3 text-lg text-zinc-600">
                A simple workflow: scope your notebook, add material, then ask questions with citations.
              </p>
            </div>

            {/* More "Apple/Google" layout: steps + product preview (instead of 3 similar cards) */}
            <div className="rounded-[2.75rem] border border-black/10 bg-white/60 p-6 md:p-10 shadow-[0_22px_70px_-25px_rgba(0,0,0,0.18)] backdrop-blur-3xl">
              <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
                {/* Steps */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                    Process
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    In minutes
                  </div>

                  <ol className="mt-6 space-y-4">
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
                      <li
                        key={step.title}
                        className="rounded-2xl border border-black/10 bg-white/55 px-5 py-4 shadow-sm shadow-zinc-900/5 backdrop-blur-2xl"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-sm shadow-zinc-900/10">
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-white/90 text-sm font-semibold text-zinc-900">
                              {i + 1}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-zinc-950">{step.title}</div>
                            <p className="mt-1 text-sm leading-6 text-zinc-600">{step.body}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6">
                    <a
                      href={PRIMARY_CTA_HREF}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      {PRIMARY_CTA_LABEL}
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Product preview */}
                <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/70 shadow-sm backdrop-blur-2xl">
                  <div className="flex items-center justify-between gap-4 border-b border-black/5 bg-white/60 px-5 py-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Notebook</div>
                      <div className="mt-1 text-sm font-semibold text-zinc-900">Bio 101 — Photosynthesis</div>
                    </div>
                    <div className="hidden sm:flex flex-wrap justify-end gap-2">
                      {[
                        "Lecture notes",
                        "Assigned reading",
                        "Lab report",
                      ].map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] font-semibold text-zinc-700"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 md:p-6">
                    <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Ask</p>
                        <span className="rounded-full border border-black/10 bg-white/60 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                          ⌘K
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-800">Make me a study guide for the Calvin cycle.</p>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Cited answer</p>
                      <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                        {[
                          {
                            t: "Purpose: converts CO₂ into sugars using ATP and NADPH.",
                            c: "Textbook.pdf • p. 184",
                          },
                          {
                            t: "Three phases: fixation → reduction → regeneration.",
                            c: "Lecture 3 Slides • slide 18",
                          },
                          {
                            t: "Key enzyme: RuBisCO (rate-limiting under many conditions).",
                            c: "Bio 101 Notes • p. 12",
                          },
                        ].map((row) => (
                          <li key={row.t} className="flex flex-col gap-2 rounded-xl bg-white/60 px-3 py-2">
                            <span className="leading-6">{row.t}</span>
                            <span className="w-fit rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-zinc-600">
                              {row.c}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Ambient mark */}
                  <div className="pointer-events-none absolute -right-14 -bottom-16 opacity-[0.65]">
                    <TheaMark className="h-44 w-44" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Meet Thea - your AI study partner */}
          <section id="meet-thea" className="mt-24">
            <div className="grid gap-10 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-950">
                  Meet Thea, your AI study & research partner.
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-600 max-w-xl">
                  Thea works with your notebooks, not the open web. Ask questions, follow up, and get
                  explanations you can verify back to your own sources.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-zinc-700">
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span>Grounded in the notebooks and documents you choose to include.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                    <span>Citations on every answer, so you can inspect the exact source page.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <span>Built for multi-step study sessions, not one-off questions.</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <a
                    href={PRIMARY_CTA_HREF}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-6 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur-2xl hover:bg-white hover:border-black/20 transition"
                  >
                    {PRIMARY_CTA_LABEL}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_top,#c7d2fe,transparent_55%)] opacity-70 blur-2xl" />
                <div className="relative rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-[0_22px_70px_-25px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
                        Notebook-scoped • private by default
                      </p>
                      <p className="mt-1 text-sm font-semibold text-zinc-900">Bio 101 — Study mode</p>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] font-semibold text-zinc-700">
                      Cited answers
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_220px]">
                    {/* Main panel */}
                    <div className="space-y-3">
                      {/* Prompt */}
                      <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                            Ask
                          </p>
                          <span className="rounded-full bg-zinc-900/5 px-2 py-1 text-[11px] font-medium text-zinc-500">
                            ⌘K
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-zinc-800">
                          Summarize this notebook like I have an exam tomorrow. What should I focus on?
                        </p>
                      </div>

                      {/* Answer */}
                      <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                            Cited answer
                          </p>
                          <span className="text-[11px] text-zinc-500">0.8s</span>
                        </div>
                        <p className="mt-2 text-sm text-zinc-800">
                          Focus on these three ideas — each one shows up repeatedly across your notes.
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm text-zinc-800">
                          <li className="flex items-start gap-2">
                            <span className="mt-[7px] h-1 w-1 rounded-full bg-emerald-500" />
                            <span>
                              Light reactions: electron transport + ATP/NADPH
                              <span className="ml-2 align-middle rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">p. 12</span>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-[7px] h-1 w-1 rounded-full bg-indigo-500" />
                            <span>
                              Calvin cycle: inputs/outputs + where carbon is fixed
                              <span className="ml-2 align-middle rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700">slide 18</span>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-[7px] h-1 w-1 rounded-full bg-amber-500" />
                            <span>
                              Limiting factors: light intensity, CO₂, temperature
                              <span className="ml-2 align-middle rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800">p. 184</span>
                            </span>
                          </li>
                        </ul>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {["Bio 101 Notes • p. 12", "Lecture 3 Slides • slide 18", "Textbook.pdf • p. 184"].map((c) => (
                            <span
                              key={c}
                              className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-[11px] font-medium text-zinc-700"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Suggested prompts */}
                      <div className="flex gap-2 pt-1 flex-wrap">
                        {["Explain the Calvin cycle", "Quiz me on photosynthesis", "Make 10 flashcards"].map((prompt) => (
                          <span
                            key={prompt}
                            className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700"
                          >
                            {prompt}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Sources sidebar */}
                    <div className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 backdrop-blur">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                          Sources
                        </span>
                        <span className="text-[11px] text-zinc-500">3</span>
                      </div>
                      <div className="mt-2 space-y-2">
                        {[
                          { label: "Bio 101 Notes", meta: "p. 12" },
                          { label: "Lecture 3 Slides", meta: "slide 18" },
                          { label: "Textbook.pdf", meta: "p. 184" },
                        ].map((s) => (
                          <div key={s.label} className="rounded-xl border border-black/5 bg-white/60 px-3 py-2">
                            <p className="text-xs font-medium text-zinc-800">{s.label}</p>
                            <p className="mt-0.5 text-[11px] text-zinc-500">{s.meta}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 rounded-xl border border-black/10 bg-white/70 px-3 py-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Scope</p>
                        <p className="mt-1 text-xs text-zinc-700">Chapter 3 • Photosynthesis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="security" className="mt-24">
            <div className="rounded-[2rem] border border-black/10 bg-white/65 p-10 md:p-12 shadow-[0_22px_70px_-25px_rgba(0,0,0,0.20)] backdrop-blur-3xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                    Built with serious privacy and security in mind.
                  </h2>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-600">
                    Keep your data isolated, minimize what&apos;s sent to the model, and maintain a clear audit trail from day one.
                  </p>
                </div>
                <div className="w-fit self-center rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-lg shadow-zinc-900/10 md:self-auto flex-shrink-0">
                  <a
                    className="inline-flex h-11 items-center justify-center rounded-full bg-white/95 px-6 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition hover:bg-white"
                    href={PRIMARY_CTA_HREF}
                  >
                    {PRIMARY_CTA_LABEL}
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
                      <div className="text-base font-semibold text-zinc-950 mb-1">Security-first infrastructure</div>
                      <p className="text-sm leading-6 text-zinc-600">
                        Designed with secure defaults, least-privilege access, and auditing in mind so your library stays protected.
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
                      <div className="text-base font-semibold text-zinc-950 mb-1">Encryption by default</div>
                      <p className="text-sm leading-6 text-zinc-600">
                        Data is encrypted in transit (TLS) and at rest. Your knowledge base is private by default.
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
                      <div className="text-base font-semibold text-zinc-950 mb-1">Compliance-ready architecture</div>
                      <p className="text-sm leading-6 text-zinc-600">
                        Built to support stricter requirements and data residency needs as the product expands.
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
                Three personal plans for solo learners, researchers, and professionals.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                <span className="text-zinc-500">Billed monthly. Save 15% with annual billing.</span>
              </div>
              <div className="mt-1 flex items-center justify-center gap-2 text-sm">
                <span className="text-zinc-500">All plans are in early access —</span>
                <a className="font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 transition" href={PRIMARY_CTA_HREF}>
                  {PRIMARY_CTA_LABEL}
                </a>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Personal */}
              <div className="bg-white/60 border border-black/5 rounded-[2.5rem] p-10 flex flex-col shadow-sm backdrop-blur-3xl relative overflow-hidden group hover:shadow-md transition-all duration-500">
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
              </div>

              {/* Personal+ */}
              <div className="bg-white/60 border border-black/5 rounded-[2.5rem] p-10 flex flex-col shadow-sm backdrop-blur-3xl relative overflow-hidden group hover:shadow-md transition-all duration-500">
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
              </div>

              {/* Personal Pro */}
              <div className="bg-white/70 border border-black/10 rounded-[2.5rem] p-10 flex flex-col shadow-xl backdrop-blur-3xl relative overflow-hidden group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                <div className="absolute top-6 right-6">
                  <span className="inline-flex items-center rounded-full bg-zinc-900/5 border border-black/5 px-3 py-1 text-xs font-medium text-zinc-900 backdrop-blur-sm">
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
                      "Conversational AI tuned to your topics and materials",
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
                  <a href={PRIMARY_CTA_HREF} className="block w-full py-3 px-6 rounded-full border border-black/10 bg-zinc-900 text-sm font-semibold text-white text-center shadow-lg hover:bg-zinc-800 transition-all duration-300">
                    {PRIMARY_CTA_LABEL}
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

          {/* Roadmap / what's coming next */}
          <section className="mt-24">
            <div className="rounded-[2rem] border border-black/10 bg-white/70 p-8 md:p-10 shadow-[0_22px_70px_-25px_rgba(0,0,0,0.18)] backdrop-blur-3xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-950">
                    What&apos;s coming next
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm md:text-base leading-7 text-zinc-600">
                    Thesis is in early access. We&apos;re shipping new capabilities for serious learners and
                    researchers, with many of them arriving first for Personal Pro.
                  </p>
                </div>
                <div className="w-fit rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-lg shadow-zinc-900/10">
                  <a
                    href={PRIMARY_CTA_HREF}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-white/95 px-6 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition hover:bg-white"
                  >
                    {PRIMARY_CTA_LABEL}
                  </a>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm">
                  <p className="inline-flex items-center rounded-full bg-zinc-900/5 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500 mb-3">
                    Coming soon
                  </p>
                  <h3 className="text-sm font-semibold text-zinc-950 mb-2">Cross Search</h3>
                  <p className="text-sm text-zinc-600 leading-6">
                    Ask one question and search across all of your notebooks at once, so Thea can pull from
                    every relevant source in your library.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm">
                  <p className="inline-flex items-center rounded-full bg-zinc-900/5 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500 mb-3">
                    In development
                  </p>
                  <h3 className="text-sm font-semibold text-zinc-950 mb-2">Deep Thesis Projects</h3>
                  <p className="text-sm text-zinc-600 leading-6">
                    Define long-running projects with goals, key sources, and milestones. Let Thea help you
                    stay organized and surface what matters most.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm">
                  <p className="inline-flex items-center rounded-full bg-zinc-900/5 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500 mb-3">
                    On the roadmap
                  </p>
                  <h3 className="text-sm font-semibold text-zinc-950 mb-2">Smarter study flows</h3>
                  <p className="text-sm text-zinc-600 leading-6">
                    Guided study sessions, spaced review, and richer multi-step workflows to help you move
                    from reading to real understanding faster.
                  </p>
                </div>
              </div>
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
          className="h-8 w-full rounded-lg border border-zinc-200 bg-white/90 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 min-w-0"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-8 w-full rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
