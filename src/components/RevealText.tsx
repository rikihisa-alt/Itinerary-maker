"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function RevealText({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        className={className}
        initial={{ y: "100%", opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function SlideIn({ children, className = "", direction = "left", delay = 0 }: { children: React.ReactNode; className?: string; direction?: "left" | "right" | "up"; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const x = direction === "left" ? -60 : direction === "right" ? 60 : 0;
  const y = direction === "up" ? 40 : 0;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ x, y, opacity: 0 }}
      animate={inView ? { x: 0, y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
