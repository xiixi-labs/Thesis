
import { SignIn } from "@clerk/nextjs";
import { LogoMark } from "@/components/LogoMark";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-[#fbfbfd] flex flex-col justify-center items-center relative overflow-hidden p-6 gap-8">
            {/* Enhanced Background Glows - matching landing page */}
            <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[38rem] w-[58rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.45),rgba(255,255,255,0)_60%)] blur-[80px]" />
            <div className="pointer-events-none absolute left-1/2 top-[-6rem] h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.4),rgba(255,255,255,0)_55%)] blur-[80px]" />
            <div className="pointer-events-none absolute right-[-10rem] bottom-[-10rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.35),rgba(255,255,255,0)_60%)] blur-[90px]" />

            {/* Header / Logo */}
            <div className="z-10 flex flex-col items-center gap-3">
                <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                    <LogoMark className="h-10 w-10" gradientId="authLogo" />
                    <span className="text-xl font-semibold tracking-tight text-zinc-950">Thesis</span>
                </Link>
                <p className="text-zinc-600 text-sm">Continue learning.</p>
            </div>

            {/* Clerk Component with enhanced glass styling */}
            <div className="z-10">
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
    );
}
