"use client";

import { useInView } from "@/hooks/useInView";

interface RevealOnScrollProps {
    children: React.ReactNode;
    /** Extra classes merged onto the wrapper */
    className?: string;
    /** Stagger delay in ms (default 0) */
    delay?: number;
    /** Direction: "up" (default) or "none" (fade only) */
    direction?: "up" | "none";
}

/**
 * Fade-up reveal wrapper triggered by IntersectionObserver.
 * Fires once — no re-triggering on scroll back up.
 */
export function RevealOnScroll({
    children,
    className = "",
    delay = 0,
    direction = "up",
}: RevealOnScrollProps) {
    const { ref, isInView } = useInView(0.05);

    const translate = direction === "up" ? "translate-y-8" : "translate-y-0";

    return (
        <div
            ref={ref}
            className={`transition-all duration-500 ease-out ${isInView
                ? "opacity-100 translate-y-0"
                : `opacity-0 ${translate}`
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
