"use client";

import { motion } from "framer-motion";

interface FloatingElementProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
    depth?: number; // 1 = subtle, 2 = medium, 3 = pronounced
}

export function FloatingElement({
    children,
    delay = 0,
    duration = 6,
    className = "",
    depth = 1,
}: FloatingElementProps) {
    const yOffset = depth * 15;

    return (
        <motion.div
            animate={{
                y: [-yOffset, yOffset, -yOffset],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
