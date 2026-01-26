"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { joinWaitlist } from '@/app/actions/waitlist';
import { LogoMark } from '@/components/LogoMark';

// --- SHARED COMPONENTS ---

const ThesisBackground = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
	<div className={`relative w-full overflow-hidden bg-[#fbfbfd] text-zinc-950 ${className}`}>
		<div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[38rem] w-[58rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.45),rgba(255,255,255,0)_60%)] blur-[80px]" />
		<div className="pointer-events-none absolute left-1/2 top-[-6rem] h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.4),rgba(255,255,255,0)_55%)] blur-[80px]" />
		<div className="pointer-events-none absolute left-[-12rem] top-[2rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.45),rgba(255,255,255,0)_60%)] blur-[90px]" />
		<div className="pointer-events-none absolute right-[-14rem] top-[4rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.4),rgba(255,255,255,0)_58%)] blur-[90px]" />
		{children}
	</div>
);

const ThesisInput = ({ name, placeholder, type = "text", className = "", required = false }: { name: string; placeholder: string; type?: string; className?: string; required?: boolean }) => (
	<input
		name={name}
		type={type}
		required={required}
		placeholder={placeholder}
		className={`h-11 w-full rounded-full border border-black/10 bg-white/45 px-4 text-sm text-zinc-900 placeholder:text-zinc-500/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-xl transition hover:bg-white/60 ${className}`}
	/>
);

const ThesisButton = ({ children, className = "", disabled }: { children: React.ReactNode; className?: string, disabled?: boolean }) => (
	<div className={`rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] p-[1px] shadow-lg shadow-zinc-900/10 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
		<button disabled={disabled} className="flex h-11 w-full items-center justify-center rounded-full bg-white/95 px-6 text-sm font-semibold text-zinc-950 backdrop-blur-sm transition hover:bg-white disabled:bg-white/50">
			{children}
		</button>
	</div>
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
			<header className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-10">
				<Link href="/" className="flex items-center gap-2">
					<LogoMark className="h-7 w-7 md:h-8 md:w-8" gradientId="waitlistLogo" />
					<span className="font-semibold text-zinc-950">Thesis</span>
				</Link>
			</header>

			<div className="flex-1 flex flex-col justify-center pt-20 md:pt-24 px-4 md:px-6 lg:px-24 max-w-5xl mx-auto w-full">
				<div className="text-xs md:text-sm font-semibold tracking-wider uppercase text-indigo-500 mb-4 md:mb-6">Thesis + Gemini</div>
				<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-semibold text-zinc-950 tracking-tight leading-[1.1]">
					Your files are<br />
					waiting to speak.
				</h1>
			</div>

			<div className="w-full bg-white/60 backdrop-blur-2xl border-t border-black/10 p-6 md:p-8 lg:p-12 mt-8 md:mt-12 pb-16 md:pb-24 relative z-10">
				<div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center">
					<div className="flex-1">
						<h3 className="text-xl md:text-2xl font-semibold text-zinc-950 mb-2">Start the conversation.</h3>
						<p className="text-sm md:text-base text-zinc-600">Students and Teams use Thesis to understand their world.</p>
					</div>
					<div className="w-full md:w-auto md:min-w-[320px] lg:min-w-[400px]">
						<WaitlistForm layout="grid" />
					</div>
				</div>
			</div>
		</ThesisBackground>
	);
}
