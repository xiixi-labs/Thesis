
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#fbfbfd]">
            {/* Enhanced Animated Gradient Blobs */}
            <div
                className="pointer-events-none absolute left-[-20%] top-[-15%] h-[55rem] w-[55rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.55),rgba(255,255,255,0)_65%)] blur-[120px]"
                style={{ animation: 'blob-float 25s ease-in-out infinite' }}
            />
            <div
                className="pointer-events-none absolute left-[5%] top-[15%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.55),rgba(255,255,255,0)_65%)] blur-[110px]"
                style={{ animation: 'blob-float-alt 20s ease-in-out infinite 2s' }}
            />
            <div
                className="pointer-events-none absolute right-[-15%] top-[5%] h-[48rem] w-[48rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.55),rgba(255,255,255,0)_65%)] blur-[110px]"
                style={{ animation: 'blob-float 22s ease-in-out infinite 4s' }}
            />
            <div
                className="pointer-events-none absolute bottom-[-20%] right-[10%] h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.55),rgba(255,255,255,0)_65%)] blur-[115px]"
                style={{ animation: 'blob-float-alt 28s ease-in-out infinite 1s' }}
            />
            <div
                className="pointer-events-none absolute left-[15%] bottom-[-10%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.55),rgba(255,255,255,0)_65%)] blur-[105px]"
                style={{ animation: 'blob-float 24s ease-in-out infinite 6s' }}
            />
            <div
                className="pointer-events-none absolute right-[20%] top-[35%] h-[35rem] w-[35rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.55),rgba(255,255,255,0)_65%)] blur-[100px]"
                style={{ animation: 'blob-float-alt 26s ease-in-out infinite 3s' }}
            />

            {/* Subtle Grain Texture Overlay */}
            {/* Salt-and-pepper grain texture overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='2' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0 0 1 1 1 0 0 0'/%3E%3C/feComponentTransfer%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='discrete' tableValues='0 1'/%3E%3CfeFuncG type='discrete' tableValues='0 1'/%3E%3CfeFuncB type='discrete' tableValues='0 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px'
                }}
            />

            {/* Simple Back Button Header */}
            <header className="relative z-10 px-6 py-6">
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
                        Back
                    </Link>
                </div>
            </header>

            {/* Main Split Layout */}
            <div className="relative z-10 flex flex-col md:grid md:min-h-[calc(100vh-88px)] md:grid-cols-2">
                {/* Sign-In Card Panel - First on Mobile, Second on Desktop */}
                <div className="order-1 md:order-2 flex items-center justify-center px-4 py-12 md:px-16">
                    <div
                        className="w-full max-w-md opacity-0"
                        style={{ animation: 'slide-up 0.9s ease-out 0.5s forwards' }}
                    >
                        <SignIn
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "bg-white/80 backdrop-blur-3xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.5)] rounded-3xl p-8 md:p-12",
                                    headerTitle: "text-zinc-950 font-bold text-2xl md:text-3xl tracking-tight",
                                    headerSubtitle: "text-zinc-500 text-sm md:text-base mt-2 md:mt-3",
                                    socialButtonsBlockButton: "text-zinc-700 font-medium hover:text-zinc-900 bg-white/70 hover:bg-white/90 border-zinc-200/80 rounded-2xl transition-all duration-200 h-11 md:h-12 hover:shadow-md hover:scale-[1.01] backdrop-blur-sm",
                                    socialButtonsBlockButtonText: "font-medium text-sm",
                                    socialButtonsIconButton: "rounded-2xl",
                                    formFieldLabel: "text-zinc-700 font-semibold text-sm mb-2",
                                    formFieldInput: "bg-white/90 border-zinc-200 focus:border-indigo-400 focus:ring-indigo-400/30 text-zinc-900 rounded-2xl h-11 md:h-12 transition-all backdrop-blur-sm font-medium placeholder:text-zinc-400 text-base md:text-sm",
                                    formFieldInputShowPasswordButton: "text-zinc-500 hover:text-zinc-700",
                                    footerActionLink: "text-indigo-600 hover:text-indigo-700 font-semibold",
                                    formButtonPrimary: "bg-gradient-to-br from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 text-white rounded-2xl h-11 md:h-12 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01] font-semibold",
                                    footerAction: "text-sm mt-6",
                                    dividerLine: "bg-zinc-200",
                                    dividerText: "text-zinc-400 text-xs font-medium",
                                    identityPreviewText: "font-medium",
                                    identityPreviewEditButton: "text-indigo-600 hover:text-indigo-700",
                                },
                                layout: {
                                    socialButtonsPlacement: "top",
                                    showOptionalFields: false,
                                }
                            }}
                        />

                        <p className="mt-6 md:mt-8 text-center text-sm text-zinc-500">
                            New to Thesis?{" "}
                            <Link href="/waitlist" className="font-semibold text-zinc-900 underline decoration-indigo-500/30 underline-offset-4 transition hover:decoration-indigo-500/60">
                                Join the waitlist
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Desktop Branding Panel - Hidden on Mobile, Shows First on Desktop */}
                <div className="order-2 md:order-1 hidden md:flex items-center justify-center px-16 lg:px-24">
                    <div
                        className="max-w-xl opacity-0"
                        style={{ animation: 'slide-up 0.9s ease-out 0.3s forwards' }}
                    >
                        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-zinc-950 md:text-6xl lg:text-[4.5rem]">
                            Transform Your Notes Into Answers
                        </h1>

                        <p className="mt-6 text-lg leading-relaxed text-zinc-600 md:text-xl">
                            Get cited answers from your knowledge base—instantly.
                        </p>

                        <div className="mt-10 flex flex-col gap-3">
                            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-50/50 px-4 py-2.5 backdrop-blur-sm transition-all hover:bg-emerald-50/70">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                                <span className="text-sm font-medium text-zinc-700">Ask across PDFs, slides, and notes</span>
                            </div>
                            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-indigo-500/20 bg-indigo-50/50 px-4 py-2.5 backdrop-blur-sm transition-all hover:bg-indigo-50/70">
                                <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
                                <span className="text-sm font-medium text-zinc-700">Get answers with citations</span>
                            </div>
                            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-purple-500/20 bg-purple-50/50 px-4 py-2.5 backdrop-blur-sm transition-all hover:bg-purple-50/70">
                                <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
                                <span className="text-sm font-medium text-zinc-700">Secure and private</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
