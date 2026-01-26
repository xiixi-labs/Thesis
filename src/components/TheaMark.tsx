type TheaMarkProps = {
	className?: string;
	/** Whether the background gradient should rotate (motion-safe). */
	animated?: boolean;
};

export function TheaMark({
	className,
	animated = true,
}: TheaMarkProps) {
	// Breathing/Fading Animation - Solid & Vibrant (Glass Marble Style)
	// Sharp edges, high contrast, glossy overlay

	return (
		<div className={`relative isolate inline-flex aspect-square items-center justify-center ${className ?? ""}`.trim()}>
			{/* Background Aura (Sharp & Close) */}
			<div className="absolute inset-[-10%] -z-20 rounded-full bg-indigo-500/30 blur-lg" />

			{/* Main container with mask - The Brain Shape */}
			<div
				className="relative h-full w-full bg-white shadow-xl ring-1 ring-black/10 isolate overflow-hidden" // Shadow + Ring for pop
				style={{
					maskImage: 'url("/brain-circle-mask.svg")',
					WebkitMaskImage: 'url("/brain-circle-mask.svg")',
					maskSize: 'contain',
					WebkitMaskSize: 'contain',
					maskPosition: 'center',
					WebkitMaskPosition: 'center',
					maskRepeat: 'no-repeat',
					WebkitMaskRepeat: 'no-repeat',
				}}
			>
				{/* Rotating blob container for swirl effect */}
				<div className="absolute inset-0 motion-safe:animate-spin motion-safe:[animation-duration:20s]">
					{/* 1. Cyan Blob (Top Left) */}
					<div
						className="absolute -top-[10%] -left-[10%] h-[70%] w-[70%] rounded-full bg-cyan-500 blur-md opacity-100"
					/>

					{/* 2. Rose Blob (Bottom Right) */}
					<div
						className="absolute -bottom-[10%] -right-[10%] h-[70%] w-[70%] rounded-full bg-rose-500 blur-md opacity-100"
					/>

					{/* 3. Amber/Orange Blob (Bottom Left) */}
					<div
						className="absolute -bottom-[5%] -left-[5%] h-[60%] w-[60%] rounded-full bg-amber-500 blur-md opacity-90"
					/>

					{/* 4. Violet Blob (Top Right) */}
					<div
						className="absolute -top-[5%] -right-[5%] h-[60%] w-[60%] rounded-full bg-indigo-600 blur-md opacity-80"
					/>

					{/* 5. Pink Blob (Center) - Adds warmth */}
					<div
						className="absolute top-[20%] left-[30%] h-[50%] w-[50%] rounded-full bg-pink-500 blur-md opacity-70"
					/>
				</div>

				{/* Internal Gloss/Highlight Overlay */}
				<div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
				<div className="absolute top-[10%] left-[15%] h-[30%] w-[40%] bg-white/40 blur-sm rounded-full pointer-events-none mix-blend-overlay" />
			</div>
		</div>
	);
}
