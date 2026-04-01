"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export function ParallaxImage({ src, alt, aspect = "16/10", className = "" }: { src: string; alt: string; aspect?: string; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[8px] outline outline-1 outline-g2/40 ${className}`} style={{ aspectRatio: aspect }}>
      <motion.div className="absolute inset-[-16%]" style={{ y }}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />
      </motion.div>
    </div>
  );
}
