
import { SignIn } from "@clerk/nextjs";
import { LogoMark } from "@/components/LogoMark";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-[#fbfbfd] flex flex-col justify-center items-center relative overflow-hidden p-6">
            {/* Enhanced Background Glows */}
            <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[38rem] w-[58rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.45),rgba(255,255,255,0)_60%)] blur-[80px]" />
            <div className="pointer-events-none absolute left-1/2 top-[-6rem] h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.4),rgba(255,255,255,0)_55%)] blur-[80px]" />
            <div className="pointer-events-none absolute right-[-10rem] bottom-[-10rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.35),rgba(255,255,255,0)_60%)] blur-[90px]" />

            {/* Header Logo */}
            <div className="z-10 mb-8">
                <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                    <LogoMark className="h-10 w-10" gradientId="authLogo" />
                    <span className="text-xl font-semibold tracking-tight text-zinc-950">Thesis</span>
                </Link>
            </div>

            {/* Split Layout */}
            <div className="z-10 w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
                {/* Left: Branding & Value Props */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-zinc-950 leading-[1.1]">
                            Welcome back
                        </h1>
                        <p className="mt-4 text-lg text-zinc-600 leading-relaxed">
                            Your personalized learning hub with cited answers from your notes.
                        </p>
                    </div>

                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                                <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-semibold text-zinc-900">Ask across all your documents</div>
                                <div className="text-sm text-zinc-600">PDFs, notes, slides—all in one place</div>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
                                <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-semibold text-zinc-900">Get cited answers you can trust</div>
                                <div className="text-sm text-zinc-600">Every response links to source material</div>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100">
                                <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-semibold text-zinc-900">Secure and private</div>
                                <div className="text-sm text-zinc-600">Your data stays yours, always</div>
                            </div>
                        </li>
                    </ul>

                    <div className="pt-4">
                        <p className="text-sm text-zinc-500">
                            New to Thesis?{" "}
                            <Link href="/waitlist" className="font-semibold text-zinc-900 underline decoration-black/20 underline-offset-4 hover:decoration-black/40">
                                Join the waitlist
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right: Sign-in Card */}
                <div className="flex justify-center md:justify-end">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "mx-auto",
                                card: "bg-white/70 backdrop-blur-3xl border border-black/10 shadow-[0_22px_70px_-25px_rgba(0,0,0,0.20)] rounded-[2rem] p-2",
                                headerTitle: "text-zinc-950 font-semibold",
                                headerSubtitle: "text-zinc-600",
                                socialButtonsBlockButton: "text-zinc-600 hover:text-zinc-900 hover:bg-white/80 border-black/10 rounded-xl transition",
                                formFieldLabel: "text-zinc-700 font-medium",
                                formFieldInput: "bg-white/60 border-black/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-zinc-900 rounded-xl",
                                footerActionLink: "text-indigo-600 hover:text-indigo-700 font-medium",
                                formButtonPrimary: "bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shadow-lg transition",
                            },
                            layout: {
                                socialButtonsPlacement: "top",
                                showOptionalFields: false,
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
