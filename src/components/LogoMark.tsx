type LogoMarkProps = {
	className?: string;
	/** Legacy prop (previously used for SVG gradient ids). Kept for backwards-compat. */
	gradientId?: string;
	/** Whether the halo should rotate (motion-safe). */
	animated?: boolean;
	/** Seconds per full rotation. */
	speedSeconds?: number;
};

export function LogoMark({
	className,
	animated = true,
	speedSeconds = 12
}: LogoMarkProps) {
	return (
		<div className={`relative flex items-center justify-center ${className ?? "h-8 w-8"}`}>
			{/* Rotating Gradient Shadow Aura */}
			<div
				aria-hidden="true"
				className={`absolute inset-[-20%] rounded-full bg-[conic-gradient(from_0deg,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] blur-sm opacity-60 ${animated ? "motion-safe:animate-[spin_6s_linear_infinite]" : ""}`}
				style={animated ? { animationDuration: `${speedSeconds}s` } : undefined}
			/>
			<div
				aria-hidden="true"
				className={`absolute inset-[-20%] rounded-full bg-[conic-gradient(from_180deg,transparent,#40e0d0,transparent,#ff0080,transparent)] blur-sm opacity-80 mix-blend-overlay ${animated ? "motion-safe:animate-[spin_8s_linear_infinite_reverse]" : ""}`}
				style={animated ? { animationDuration: `${speedSeconds * 1.5}s` } : undefined}
			/>

			{/* Solid White Core */}
			<div className="relative z-10 h-full w-full rounded-full bg-white shadow-sm ring-1 ring-black/5" />
		</div>
	);
}
