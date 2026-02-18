"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight IntersectionObserver hook.
 * Returns a ref to attach and a boolean that flips to `true` once
 * the element enters the viewport (and stays true — fire-once).
 */
export function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(el); // fire once
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isInView };
}
