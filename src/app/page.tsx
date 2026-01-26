"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/LogoMark";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <LogoMark className="h-8 w-8" gradientId="thesisLogoGradientHome" />
            <span className="relative z-10 text-lg font-semibold tracking-tight">Thesis</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
            <a className="transition hover:text-zinc-900" href="#who-its-for">
              Who it&apos;s for
            </a>
            <a className="transition hover:text-zinc-900" href="#how-it-works">
              How it works
            </a>
            <a className="transition hover:text-zinc-900" href="#security">
              Security
            </a>
            <a className="transition hover:text-zinc-900" href="#pricing">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden pt-16">
        {/* Vibrant Ambient Glow - Extended */}
        <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[38rem] w-[58rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.45),rgba(255,255,255,0)_60%)] blur-[80px]" />
        <div className="pointer-events-none absolute left-1/2 top-[-6rem] h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.4),rgba(255,255,255,0)_55%)] blur-[80px]" />
        <div className="pointer-events-none absolute left-[-12rem] top-[2rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.45),rgba(255,255,255,0)_60%)] blur-[90px]" />
        <div className="pointer-events-none absolute right-[-14rem] top-[4rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.4),rgba(255,255,255,0)_58%)] blur-[90px]" />
        <div className="pointer-events-none absolute left-[12%] top-[24rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.35),rgba(255,255,255,0)_60%)] blur-[90px]" />
        <div className="pointer-events-none absolute right-[8%] top-[32rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.35),rgba(255,255,255,0)_60%)] blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-20rem] left-1/2 h-[44rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),rgba(255,255,255,0)_60%)] blur-[100px]" />

        {/* Lower page ambient glow for continuity */}
        <div className="pointer-events-none absolute left-[-10%] top-[60rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.3),rgba(255,255,255,0)_60%)] blur-[90px]" />
        <div className="pointer-events-none absolute right-[-5%] top-[70rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.3),rgba(255,255,255,0)_60%)] blur-[90px]" />
        <div className="pointer-events-none absolute left-[20%] bottom-[-10rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.3),rgba(255,255,255,0)_60%)] blur-[100px]" />

        <main className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-10">
          {/* Statement Hero */}
          <section className="flex min-h-[75vh] flex-col items-center justify-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/80 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm shadow-emerald-900/5 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Now accepting teams • Individual plans coming soon
            </div>

            <h1 className="mt-10 max-w-5xl text-6xl font-bold leading-[1.05] tracking-tight text-zinc-950 sm:text-7xl md:text-8xl lg:text-9xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Learn <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Anything</span>.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl sm:leading-9 md:text-2xl md:leading-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Turn your documents into <span className="font-semibold text-zinc-900">cited answers</span>.
              <br className="hidden sm:block" />
              Upload once, ask anything, get sources.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="group relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <Link
                  href="/sign-up"
                  className="relative inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-10 text-base font-bold text-white shadow-xl transition hover:scale-105 active:scale-95"
                >
                  Get Started Free →
                </Link>
              </div>
              <Link
                className="inline-flex h-14 items-center justify-center rounded-full border-2 border-zinc-200 bg-white/60 px-8 text-base font-semibold text-zinc-900 shadow-sm backdrop-blur-2xl transition hover:bg-white hover:border-zinc-300 hover:scale-105 active:scale-95"
                href="#how-it-works"
              >
                See how it works
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-8 text-sm text-zinc-500 animate-in fade-in duration-700 delay-500">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </section>





          {/* Who it's for - moved above features for better narrative flow */}
          <section id="who-its-for" className="mt-20">
            <div className="rounded-[2rem] border border-black/10 bg-white/25 p-8 shadow-[0_18px_60px_-25px_rgba(0,0,0,0.18)] backdrop-blur-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                For teams and individual learners.
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-600">
                Same core idea: upload what you have, ask what you need, and get answers you can trust.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white/25 p-6 shadow-sm shadow-zinc-900/5 backdrop-blur-2xl transition hover:bg-white/40">
                  <div className="text-sm font-semibold text-zinc-950">Individuals & Students</div>
                  <div className="mt-2 text-sm leading-6 text-zinc-700">
                    Turn readings, slides, and notes into study guides, quick summaries, and cited answers.
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                    <li>Ask questions across PDFs, lectures, and notes</li>
                    <li>Cite exact pages/slides for assignments</li>
                    <li>Keep a clean personal knowledge library</li>
                  </ul>
                  <div className="mt-4 text-xs text-zinc-500">Individual plans coming soon.</div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white/25 p-6 shadow-sm shadow-zinc-900/5 backdrop-blur-2xl transition hover:bg-white/40">
                  <div className="text-sm font-semibold text-zinc-950">Teams</div>
                  <div className="mt-2 text-sm leading-6 text-zinc-700">
                    Keep knowledge centralized and auditable—from onboarding docs to policies and training.
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                    <li>Shared workspace with role-based access</li>
                    <li>Grounded answers with citations + audit trail</li>
                    <li>Multi-tenant architecture and isolation</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How it works - renamed from "Everything is a database" */}
          <section id="how-it-works" className="mt-24">
            <div className="text-center py-8">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-950">How it works</h2>
              <p className="mt-3 text-lg text-zinc-600">Upload, ask, and get cited answers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Card 1: Upload */}
              <div className="md:col-span-7 bg-white/40 border border-black/5 rounded-[2rem] p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition backdrop-blur-3xl">
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-zinc-950">Drag & Drop Ingestion</h3>
                  <p className="text-zinc-600">Support for PDF, DOCX, CSV, and PPTX.</p>
                </div>
                <div className="mt-8 h-32 border-2 border-dashed border-zinc-300 rounded-xl flex items-center justify-center text-zinc-400 bg-white/50">
                  Drop zone
                </div>
              </div>

              {/* Card 2: Thea */}
              <div className="md:col-span-5 bg-black text-white rounded-[2rem] p-8 flex flex-col justify-between shadow-xl relative overflow-hidden min-h-[300px]">
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold mb-2">Meet Thea</h3>
                  <p className="text-zinc-400">Your AI Research Assistant.</p>
                </div>
                <div className="text-8xl absolute bottom-[-20px] right-[-20px] opacity-10 font-serif italic">AI</div>
                <button className="mt-auto self-start bg-white/20 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm hover:bg-white/30 transition">
                  Start Chat →
                </button>
              </div>

              {/* Card 3: Security */}
              <div className="md:col-span-4 bg-white/60 border border-black/5 rounded-[2rem] p-8 flex items-center justify-center shadow-sm backdrop-blur-3xl min-h-[200px]">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h3 className="font-semibold text-lg text-zinc-950">Enterprise Security</h3>
                </div>
              </div>

              {/* Card 4: Citations */}
              <div className="md:col-span-8 bg-gradient-to-br from-indigo-50 to-purple-50 border border-black/5 rounded-[2rem] p-8 shadow-sm relative overflow-hidden flex flex-col justify-center">
                <div className="max-w-md relative z-10">
                  <h3 className="text-2xl font-semibold mb-2 text-zinc-950">Citations included.</h3>
                  <p className="text-zinc-600 mb-6">Every answer links back to the exact page in your source document.</p>
                  <div className="rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-lg shadow-zinc-900/10 w-fit">
                    <a
                      className="inline-flex h-11 items-center justify-center rounded-full bg-white/95 px-6 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition hover:bg-white"
                      href="/waitlist"
                    >
                      Try it now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="security" className="mt-24">
            <div className="rounded-[2rem] border border-black/10 bg-white/30 p-8 shadow-[0_22px_70px_-25px_rgba(0,0,0,0.20)] backdrop-blur-3xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                    Built with enterprise constraints in mind.
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
                    Keep tenant data isolated, minimize what&apos;s sent to the model, and maintain auditability from day one.
                  </p>
                </div>
                <div className="w-fit self-center rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-lg shadow-zinc-900/10 md:self-auto">
                  <a
                    className="inline-flex h-10 items-center justify-center rounded-full bg-white/95 px-5 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition hover:bg-white"
                    href="/waitlist"
                  >
                    Talk to sales
                  </a>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {["US-only regions", "Row-level security", "Citations + audit trail"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-black/10 bg-white/25 px-4 py-3 text-sm font-semibold text-zinc-900 backdrop-blur-2xl shadow-sm shadow-zinc-900/5 transition hover:bg-white/40"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>

          <section id="pricing" className="mt-24">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Pricing</h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-600">
                Team plans. Start small, upgrade when you&apos;re ready, and keep enterprise controls available from day one.
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Individuals: coming soon — <a className="font-semibold text-zinc-900 underline decoration-black/20 underline-offset-4 hover:decoration-black/40" href="/waitlist">join the waitlist</a>.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {/* Startup */}
              <div className="rounded-[2rem] border border-black/10 bg-white/35 p-7 shadow-[0_22px_70px_-25px_rgba(0,0,0,0.20)] backdrop-blur-3xl">
                <div className="text-sm font-semibold text-zinc-950">Start-Up</div>
                <div className="mt-3 flex items-end gap-2">
                  <div className="text-4xl font-semibold tracking-tight text-zinc-950">$250</div>
                  <div className="pb-1 text-sm text-zinc-600">/ month</div>
                </div>
                <div className="mt-2 text-sm text-zinc-600">Up to 10 users</div>

                <ul className="mt-6 space-y-2 text-sm text-zinc-700">
                  <li>Document + note ingestion</li>
                  <li>Answers with citations</li>
                  <li>Org-level workspace</li>
                </ul>

                <div className="mt-7 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-lg shadow-zinc-900/10">
                  <a
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white/95 px-6 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition hover:bg-white"
                    href="/waitlist"
                  >
                    Join the waitlist
                  </a>
                </div>
              </div>

              {/* Business */}
              <div className="rounded-[2rem] border border-black/10 bg-white/40 p-7 shadow-[0_28px_90px_-30px_rgba(0,0,0,0.24)] backdrop-blur-3xl">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-zinc-950">Business</div>
                  <span className="rounded-full border border-black/10 bg-white/35 px-2.5 py-1 text-xs font-semibold text-zinc-700 backdrop-blur-2xl shadow-sm shadow-zinc-900/5">
                    Most popular
                  </span>
                </div>
                <div className="mt-3 flex items-end gap-2">
                  <div className="text-4xl font-semibold tracking-tight text-zinc-950">$500</div>
                  <div className="pb-1 text-sm text-zinc-600">/ month</div>
                </div>
                <div className="mt-2 text-sm text-zinc-600">Up to 50 users</div>

                <ul className="mt-6 space-y-2 text-sm text-zinc-700">
                  <li>Everything in Start-Up</li>
                  <li>Admin controls + role gating</li>
                  <li>Priority support</li>
                </ul>

                <div className="mt-7 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-lg shadow-zinc-900/10">
                  <a
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white/95 px-6 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition hover:bg-white"
                    href="/waitlist"
                  >
                    Join the waitlist
                  </a>
                </div>
              </div>

              {/* Enterprise */}
              <div className="rounded-[2rem] border border-black/10 bg-white/35 p-7 shadow-[0_22px_70px_-25px_rgba(0,0,0,0.20)] backdrop-blur-3xl">
                <div className="text-sm font-semibold text-zinc-950">Enterprise</div>
                <div className="mt-3 flex items-end gap-2">
                  <div className="text-4xl font-semibold tracking-tight text-zinc-950">Custom</div>
                </div>
                <div className="mt-2 text-sm text-zinc-600">Unlimited users</div>

                <ul className="mt-6 space-y-2 text-sm text-zinc-700">
                  <li>SAML / SSO</li>
                  <li>Advanced governance + audit</li>
                  <li>Dedicated onboarding</li>
                </ul>

                <a
                  className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full border border-black/10 bg-white/40 px-6 text-sm font-semibold text-zinc-900 shadow-sm shadow-zinc-900/5 backdrop-blur-2xl transition hover:bg-white/55"
                  href="/waitlist"
                >
                  Contact sales
                </a>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 text-center">
              Frequently asked questions
            </h2>

            <div className="mt-8 grid gap-4 max-w-3xl mx-auto">
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
                <div
                  key={i}
                  className="rounded-2xl border border-black/10 bg-white/40 p-6 shadow-sm backdrop-blur-xl transition hover:bg-white/60"
                >
                  <h3 className="text-base font-semibold text-zinc-900">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer - separated from pricing */}
        <footer className="relative z-10 border-t border-black/5 bg-white/30 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <LogoMark className="h-6 w-6" gradientId="footerLogo" />
                <span className="text-sm font-medium text-zinc-600">Thesis</span>
              </div>
              <p className="text-sm text-zinc-500">
                © {new Date().getFullYear()} Thesis. Learn Anything.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div >
  );
}
