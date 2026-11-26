"use client";
import { motion } from "framer-motion";

// Fades content up the first time it scrolls into view. Motion is skipped for prefers-reduced-motion via <MotionConfig reducedMotion="user">.
export default function Reveal({ as = "div", delay = 0, y = 12, className, children, ...rest }) {
    const Tag = motion[as];
    return (
        <Tag
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
            {...rest}
        >
            {children}
        </Tag>
    );
}
