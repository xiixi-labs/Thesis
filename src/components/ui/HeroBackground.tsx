"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-white/50">
            {/* Orb 1 - Top Left - Blue/Purple */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-purple-200/40 blur-[100px]"
            />

            {/* Orb 2 - Top Right - Teal/Cyan */}
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="absolute -top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-teal-200/40 blur-[100px]"
            />

            {/* Orb 3 - Mid-page left - Pink/Orange */}
            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5,
                }}
                className="absolute top-[30%] left-[20%] h-[400px] w-[400px] rounded-full bg-orange-200/30 blur-[80px]"
            />

            {/* Orb 4 - Mid-page right - Indigo */}
            <motion.div
                animate={{
                    x: [0, -80, 0],
                    y: [0, 40, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3,
                }}
                className="absolute top-[50%] -right-[5%] h-[500px] w-[500px] rounded-full bg-indigo-200/35 blur-[100px]"
            />

            {/* Orb 5 - Lower-mid left - Pink */}
            <motion.div
                animate={{
                    x: [0, 60, 0],
                    y: [0, -40, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 26,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 7,
                }}
                className="absolute top-[65%] -left-[5%] h-[450px] w-[450px] rounded-full bg-pink-200/30 blur-[90px]"
            />

            {/* Orb 6 - Lower-mid right - Teal */}
            <motion.div
                animate={{
                    x: [0, -50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 9,
                }}
                className="absolute top-[78%] right-[10%] h-[400px] w-[400px] rounded-full bg-teal-200/35 blur-[85px]"
            />

            {/* Orb 7 - Bottom left - Purple */}
            <motion.div
                animate={{
                    x: [0, 70, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 24,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4,
                }}
                className="absolute top-[90%] left-[15%] h-[500px] w-[500px] rounded-full bg-purple-200/30 blur-[100px]"
            />

            {/* Subtle Grid Overlay */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"
            />
        </div>
    );
}
