import React from 'react';

export const ThesisBackground = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative w-full overflow-hidden bg-[#fbfbfd] text-zinc-950 ${className}`}>
        {/* Enhanced Animated Gradient Blobs */}
        <div
            className="pointer-events-none absolute left-[-20%] top-[-10%] h-[25rem] w-[25rem] md:left-[-20%] md:top-[-15%] md:h-[55rem] md:w-[55rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.5),rgba(255,255,255,0)_65%)] blur-[80px] md:blur-[120px]"
            style={{ animation: 'blob-float 25s ease-in-out infinite' }}
        />
        <div
            className="pointer-events-none absolute left-[5%] top-[5%] h-[20rem] w-[20rem] md:left-[5%] md:top-[15%] md:h-[40rem] md:w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.48),rgba(255,255,255,0)_65%)] blur-[70px] md:blur-[110px]"
            style={{ animation: 'blob-float-alt 20s ease-in-out infinite 2s' }}
        />
        <div
            className="pointer-events-none absolute right-[-10%] top-[20%] h-[22rem] w-[22rem] md:right-[-15%] md:top-[5%] md:h-[48rem] md:w-[48rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.45),rgba(255,255,255,0)_65%)] blur-[70px] md:blur-[110px]"
            style={{ animation: 'blob-float 22s ease-in-out infinite 4s' }}
        />
        <div
            className="pointer-events-none absolute bottom-[-5%] right-[5%] h-[24rem] w-[24rem] md:bottom-[-20%] md:right-[10%] md:h-[50rem] md:w-[50rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.4),rgba(255,255,255,0)_65%)] blur-[75px] md:blur-[115px]"
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
