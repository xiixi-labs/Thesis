"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { joinWaitlist } from '@/app/actions/waitlist';
import { LogoMark } from '@/components/LogoMark';

// --- SHARED COMPONENTS ---

const ThesisBackground = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
	<div className={`relative w-full overflow-hidden bg-[#fbfbfd] text-zinc-950 ${className}`}>
		{/* Enhanced Animated Gradient Blobs */}
		<div
			className="pointer-events-none absolute left-[-20%] top-[-15%] h-[55rem] w-[55rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.5),rgba(255,255,255,0)_65%)] blur-[120px]"
			style={{ animation: 'blob-float 25s ease-in-out infinite' }}
		/>
		<div
			className="pointer-events-none absolute left-[5%] top-[15%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.48),rgba(255,255,255,0)_65%)] blur-[110px]"
			style={{ animation: 'blob-float-alt 20s ease-in-out infinite 2s' }}
		/>
		<div
			className="pointer-events-none absolute right-[-15%] top-[5%] h-[48rem] w-[48rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.45),rgba(255,255,255,0)_65%)] blur-[110px]"
			style={{ animation: 'blob-float 22s ease-in-out infinite 4s' }}
		/>
		<div
			className="pointer-events-none absolute bottom-[-20%] right-[10%] h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.4),rgba(255,255,255,0)_65%)] blur-[115px]"
			style={{ animation: 'blob-float-alt 28s ease-in-out infinite 1s' }}
		/>
		<div
			className="pointer-events-none absolute left-[15%] bottom-[-10%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.38),rgba(255,255,255,0)_65%)] blur-[105px]"
			style={{ animation: 'blob-float 24s ease-in-out infinite 6s' }}
		/>
		<div
			className="pointer-events-none absolute right-[20%] top-[35%] h-[35rem] w-[35rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.35),rgba(255,255,255,0)_65%)] blur-[100px]"
			style={{ animation: 'blob-float-alt 26s ease-in-out infinite 3s' }}
		/>

		{/* Subtle Grain Texture Overlay */}
		<div
			className="pointer-events-none absolute inset-0 opacity-[0.015]"
			style={{
				backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
			}}
		/>

		{children}
	</div>
);

const ThesisInput = ({ name, placeholder, type = "text", className = "", required = false }: { name: string; placeholder: string; type?: string; className?: string; required?: boolean }) => (
	<input
		name={name}
		type={type}
		required={required}
		placeholder={placeholder}
		className={`h-12 w-full rounded-2xl border border-zinc-200 bg-white/90 px-4 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/30 backdrop-blur-sm transition-all hover:bg-white ${className}`}
	/>
);

const ThesisButton = ({ children, className = "", disabled }: { children: React.ReactNode; className?: string, disabled?: boolean }) => (
	<button
		disabled={disabled}
		className={`flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 px-6 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
	>
		{children}
	</button>
);

// Standard reusable form
const WaitlistForm = ({ layout = "stack", buttonText = "Join Waitlist" }: { layout?: "stack" | "grid" | "inline"; buttonText?: string }) => {
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");

	async function handleSubmit(formData: FormData) {
		setStatus("loading");
		const res = await joinWaitlist(formData);
		if (res.error) {
			setStatus("error");
			setMessage(res.error);
		} else {
			setStatus("success");
			setMessage("You're on the list! We'll reach out soon.");
		}
	}

	if (status === "success") {
		return (
			<div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 text-center shadow-sm backdrop-blur-xl">
				<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
					<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
				</div>
				<h3 className="text-lg font-semibold text-emerald-900">You're in!</h3>
				<p className="text-sm text-emerald-700">{message}</p>
				<button onClick={() => setStatus("idle")} className="mt-4 text-xs font-medium text-emerald-600 underline hover:text-emerald-800">
					Add another email
				</button>
			</div>
		);
	}

	return (
		<form action={handleSubmit} className={`w-full ${layout === "inline" ? "max-w-4xl" : "max-w-md"} mx-auto space-y-3`}>
			<div className="grid grid-cols-2 gap-3">
				<ThesisInput name="firstName" placeholder="First Name" required />
				<ThesisInput name="lastName" placeholder="Last Name" required />
			</div>
			<ThesisInput name="email" placeholder="Email Address" type="email" required />
			<ThesisInput name="phone" placeholder="Phone (Optional)" type="tel" />

			<ThesisButton disabled={status === "loading"} className="mt-2 w-full">
				{status === "loading" ? "Joining..." : buttonText}
			</ThesisButton>

			{status === "error" && (
				<p className="text-center text-sm text-red-500 bg-red-50/50 py-2 rounded-lg">{message}</p>
			)}
		</form>
	);
};

export default function WaitlistPage() {
	return (
		<ThesisBackground className="min-h-screen flex flex-col justify-between">
			<header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
				<div
					className="opacity-0"
					style={{ animation: 'fade-in 0.8s ease-out 0.2s forwards' }}
				>
					<Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
						<LogoMark className="h-8 w-8" gradientId="waitlistLogo" />
						<span className="font-semibold text-zinc-950">Thesis</span>
					</Link>
				</div>
			</header>

			<div className="flex-1 flex flex-col justify-center pt-16 md:pt-24 px-6 md:px-24 max-w-5xl mx-auto w-full relative z-10">
				<div
					className="text-sm font-semibold tracking-wider uppercase text-indigo-500 mb-3 md:mb-6 opacity-0"
					style={{ animation: 'slide-up 0.9s ease-out 0.3s forwards' }}
				>
					Thesis + Gemini
				</div>
				<h1
					className="text-4xl md:text-8xl font-semibold text-zinc-950 tracking-tight leading-[1.1] opacity-0"
					style={{ animation: 'slide-up 0.9s ease-out 0.4s forwards' }}
				>
					Your files are<br />
					waiting to speak.
				</h1>
			</div>

			<div
				className="w-full bg-white/80 backdrop-blur-3xl border-t border-white/60 shadow-[0_-8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)] rounded-t-3xl p-4 md:p-12 mt-6 md:mt-12 pb-6 md:pb-24 relative z-10 opacity-0"
				style={{ animation: 'slide-up 0.9s ease-out 0.6s forwards' }}
			>
				<div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-center px-2 md:px-6">
					<div className="flex-1">
						<h3 className="text-2xl font-semibold text-zinc-950 mb-2">Start the conversation.</h3>
						<p className="text-zinc-600 mb-4">Students and Teams use Thesis to understand their world.</p>

						{/* Feature Highlights */}
						<div className="flex flex-wrap gap-2 mt-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/50 px-3 py-1.5 backdrop-blur-sm">
								<div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
								<span className="text-xs font-medium text-zinc-700">AI-Powered Insights</span>
							</div>
							<div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-50/50 px-3 py-1.5 backdrop-blur-sm">
								<div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
								<span className="text-xs font-medium text-zinc-700">Smart Citations</span>
							</div>
							<div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-50/50 px-3 py-1.5 backdrop-blur-sm">
								<div className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
								<span className="text-xs font-medium text-zinc-700">Secure & Private</span>
							</div>
						</div>
					</div>
					<div className="w-full md:w-auto md:min-w-[400px]">
						{/* Premium Glass Card for Form */}
						<div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 p-6 shadow-lg">
							<WaitlistForm layout="grid" />
						</div>
					</div>
				</div>
			</div>
		</ThesisBackground>
	);
}
