
import { SignUp } from "@clerk/nextjs";
import { LogoMark } from "@/components/LogoMark";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-[#fbfbfd] flex flex-col justify-center items-center relative overflow-hidden p-6 gap-8">
            {/* Background Glows */}
            <div className="pointer-events-none absolute left-1/2 top-[-10rem] h-[50rem] w-[80rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),rgba(255,255,255,0)_60%)] blur-[100px]" />
            <div className="pointer-events-none absolute left-[-10rem] bottom-[-10rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),rgba(255,255,255,0)_60%)] blur-[90px]" />

            {/* Header / Logo */}
            <div className="z-10 flex flex-col items-center gap-4">
                <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                    <LogoMark className="h-10 w-10" gradientId="authLogo" />
                    <span className="text-xl font-semibold tracking-tight text-zinc-950">Thesis</span>
                </Link>
                <p className="text-zinc-500 text-sm">Create your research account.</p>
            </div>

            {/* Clerk Component */}
            <div className="z-10">
                <SignUp
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "bg-white/50 backdrop-blur-xl border border-black/5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.1)] rounded-[2rem] p-2",
                            headerTitle: "text-zinc-950 font-semibold",
                            headerSubtitle: "text-zinc-500",
                            socialButtonsBlockButton: "text-zinc-600 hover:text-zinc-900 hover:bg-white/80 border-black/5",
                            formFieldLabel: "text-zinc-700",
                            formFieldInput: "bg-white/60 border-black/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-zinc-900 rounded-xl",
                            footerActionLink: "text-indigo-600 hover:text-indigo-700",
                            formButtonPrimary: "bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shadow-lg",
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
