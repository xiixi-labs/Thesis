"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";

interface TiltWrapperProps {
    children: React.ReactNode;
    className?: string;
    rotationIntensity?: number; // How much it tilts (degrees)
}

export function TiltWrapper({
    children,
    className = "",
    rotationIntensity = 10,
}: TiltWrapperProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const offsetX = (clientX - centerX) / (width / 2);
        const offsetY = (clientY - centerY) / (height / 2);

        x.set(offsetX * rotationIntensity);
        y.set(offsetY * rotationIntensity);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, (value) => -value); // Invert Y for natural tilt
    const rotateY = useTransform(mouseX, (value) => value);

    return (
        <motion.div
            className={`perspective-1000 ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
        >
            {children}
        </motion.div>
    );
}
