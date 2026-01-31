
import { SignIn } from "@clerk/nextjs";
import { LogoMark } from "@/components/LogoMark";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#fbfbfd]">
            {/* Large Organic Gradient Blobs */}
            <div className="pointer-events-none absolute left-[-15%] top-[-10%] h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.5),rgba(255,255,255,0)_70%)] blur-[100px]" />
            <div className="pointer-events-none absolute left-[10%] top-[20%] h-[35rem] w-[35rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.45),rgba(255,255,255,0)_70%)] blur-[100px]" />
            <div className="pointer-events-none absolute right-[-10%] top-[10%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.4),rgba(255,255,255,0)_70%)] blur-[100px]" />
            <div className="pointer-events-none absolute bottom-[-15%] right-[15%] h-[45rem] w-[45rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.35),rgba(255,255,255,0)_70%)] blur-[100px]" />

            {/* Optional Top Navigation */}
            <header className="relative z-10 px-6 py-6">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <LogoMark className="h-8 w-8" gradientId="navLogo" />
                        <span className="text-lg font-semibold tracking-tight text-zinc-950">Thesis</span>
                    </Link>
                    <nav className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
                        <Link href="/" className="transition hover:text-zinc-900">Home</Link>
                        <Link href="/#pricing" className="transition hover:text-zinc-900">Pricing</Link>
                        <Link href="/#security" className="transition hover:text-zinc-900">Security</Link>
                    </nav>
                </div>
            </header>

            {/* Main Split Layout */}
            <div className="relative z-10 grid min-h-[calc(100vh-88px)] md:grid-cols-2">
                {/* Left Branding Panel */}
                <div className="flex flex-col justify-center px-8 py-12 md:px-16 lg:px-24">
                    <div className="max-w-xl">
                        <LogoMark className="h-20 w-20 md:h-24 md:w-24" gradientId="heroLogo" />

                        <h1 className="mt-8 text-5xl font-semibold leading-[1.1] tracking-tight text-zinc-950 md:text-6xl lg:text-7xl">
                            Learn Anything
                        </h1>

                        <p className="mt-6 text-lg leading-relaxed text-zinc-600 md:text-xl">
                            Your knowledge hub with cited answers from your notes.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 text-sm text-zinc-500">
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                Ask across PDFs, slides, and notes
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                Get answers with citations
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                Secure and private
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sign-In Card Panel */}
                <div className="flex items-center justify-center px-8 py-12 md:px-16">
                    <div className="w-full max-w-md">
                        <div className="mb-6 text-center">
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Welcome Back
                            </p>
                        </div>

                        <SignIn
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "bg-white/70 backdrop-blur-3xl border border-black/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] rounded-[2rem] p-8",
                                    headerTitle: "text-zinc-950 font-semibold text-2xl",
                                    headerSubtitle: "text-zinc-600",
                                    socialButtonsBlockButton: "text-zinc-600 hover:text-zinc-900 hover:bg-white/90 border-black/10 rounded-xl transition-all duration-200",
                                    socialButtonsBlockButtonText: "font-medium",
                                    formFieldLabel: "text-zinc-700 font-medium text-sm",
                                    formFieldInput: "bg-white/80 border-black/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-zinc-900 rounded-xl transition-all",
                                    formFieldInputShowPasswordButton: "text-zinc-500 hover:text-zinc-700",
                                    footerActionLink: "text-indigo-600 hover:text-indigo-700 font-medium",
                                    formButtonPrimary: "bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl",
                                    footerAction: "text-sm",
                                    dividerLine: "bg-black/10",
                                    dividerText: "text-zinc-500 text-xs",
                                },
                                layout: {
                                    socialButtonsPlacement: "top",
                                    showOptionalFields: false,
                                }
                            }}
                        />

                        <p className="mt-6 text-center text-sm text-zinc-500">
                            New to Thesis?{" "}
                            <Link href="/waitlist" className="font-semibold text-zinc-900 underline decoration-black/20 underline-offset-4 hover:decoration-black/40">
                                Join the waitlist
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
