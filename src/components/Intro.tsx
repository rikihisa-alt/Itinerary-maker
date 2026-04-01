"use client";

import { useEffect, useRef, useState } from "react";

export function Intro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"walk" | "zoom" | "done">("walk");

  useEffect(() => {
    // Phase 1: footsteps walk up (1.8s)
    const t1 = setTimeout(() => setPhase("zoom"), 1800);
    // Phase 2: zoom + blur (0.6s)
    const t2 = setTimeout(() => setPhase("done"), 2400);
    // Phase 3: reveal
    const t3 = setTimeout(() => onComplete(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "#1c1b19",
        transition: "opacity 0.3s, filter 0.4s",
        opacity: phase === "zoom" ? 0 : 1,
        filter: phase === "zoom" ? "blur(12px)" : "none",
      }}
    >
      {/* Footsteps */}
      <div className="flex flex-col items-center gap-[28px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            width="20" height="28" viewBox="0 0 20 28" fill="none"
            style={{
              opacity: 0,
              transform: "translateY(10px)",
              animation: `fadeUp 0.3s ease-out ${i * 0.3}s forwards`,
              rotate: i % 2 === 0 ? "-8deg" : "8deg",
            }}
          >
            <ellipse cx="10" cy="10" rx="6" ry="8" fill="white" fillOpacity="0.3" />
            <ellipse cx="10" cy="22" rx="4" ry="4" fill="white" fillOpacity="0.2" />
          </svg>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
