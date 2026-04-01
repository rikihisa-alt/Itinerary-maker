"use client";

import { useEffect, useState } from "react";

// 複数人の足跡 — 左右にずらして「並んで歩いている」感
const FOOTPRINTS = [
  // person 1 (left side)
  { x: -60, y: 400, rot: -12, delay: 0, size: 1 },
  { x: -55, y: 320, rot: 10, delay: 0.25, size: 1 },
  { x: -65, y: 240, rot: -8, delay: 0.5, size: 1 },
  { x: -50, y: 160, rot: 14, delay: 0.75, size: 1 },
  { x: -60, y: 80, rot: -10, delay: 1.0, size: 1 },
  // person 2 (right side)
  { x: 60, y: 380, rot: 8, delay: 0.12, size: 0.85 },
  { x: 55, y: 300, rot: -14, delay: 0.37, size: 0.85 },
  { x: 65, y: 220, rot: 10, delay: 0.62, size: 0.85 },
  { x: 50, y: 140, rot: -12, delay: 0.87, size: 0.85 },
  { x: 60, y: 60, rot: 8, delay: 1.12, size: 0.85 },
];

export function Intro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"walk" | "hole" | "done">("walk");

  useEffect(() => {
    // walk完了 → 穴が広がる
    const t1 = setTimeout(() => setPhase("hole"), 1800);
    // 穴が全体に広がったら完了
    const t2 = setTimeout(() => setPhase("done"), 3000);
    const t3 = setTimeout(() => onComplete(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[100]" style={{ pointerEvents: phase === "hole" ? "none" : "auto" }}>
      {/* Black background with circular hole that expands */}
      <div
        className="absolute inset-0 bg-[#1c1b19] transition-all"
        style={{
          // circular clip-path: starts as tiny circle at center, expands to cover whole screen
          clipPath: phase === "hole"
            ? "circle(150% at 50% 50%)"
            : "circle(100% at 50% 50%)",
          // Inverse: we want the BLACK to disappear, revealing the page
          // So we use the hole approach: the page is behind, and the black overlay shrinks
        }}
      />

      {/* This is the "hole" mask — when phase=hole, we punch a growing circle through the black */}
      {phase === "hole" && (
        <div className="absolute inset-0" style={{
          background: "transparent",
        }}>
          {/* Growing white circle that reveals the page */}
          <div
            className="absolute top-1/2 left-1/2 rounded-full bg-[#FAFAF8]"
            style={{
              width: "20px",
              height: "20px",
              transform: "translate(-50%, -50%)",
              animation: "holeExpand 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
            }}
          />
        </div>
      )}

      {/* Black overlay that fades with hole */}
      <div
        className="absolute inset-0"
        style={{
          background: phase === "hole" ? "transparent" : "#1c1b19",
          transition: "background 0.4s",
        }}
      />

      {/* Footprints — only during walk phase */}
      {phase === "walk" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: "200px", height: "500px" }}>
            {FOOTPRINTS.map((fp, i) => (
              <svg
                key={i}
                width={36 * fp.size}
                height={52 * fp.size}
                viewBox="0 0 36 52"
                fill="none"
                className="absolute"
                style={{
                  left: `calc(50% + ${fp.x}px)`,
                  bottom: `${fp.y}px`,
                  transform: `translate(-50%, 0) rotate(${fp.rot}deg)`,
                  opacity: 0,
                  animation: `stepIn 0.35s ease-out ${fp.delay}s forwards`,
                }}
              >
                {/* Toe prints */}
                <ellipse cx="10" cy="6" rx="5" ry="5.5" fill="white" fillOpacity="0.35" />
                <ellipse cx="21" cy="4" rx="4.5" ry="5" fill="white" fillOpacity="0.3" />
                <ellipse cx="30" cy="8" rx="4" ry="4.5" fill="white" fillOpacity="0.25" />
                {/* Main foot */}
                <ellipse cx="17" cy="30" rx="11" ry="16" fill="white" fillOpacity="0.25" />
                {/* Heel */}
                <ellipse cx="16" cy="46" rx="8" ry="6" fill="white" fillOpacity="0.2" />
              </svg>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes stepIn {
          0% { opacity: 0; transform: translate(-50%, 10px) scale(0.9); }
          50% { opacity: 1; transform: translate(-50%, -3px) scale(1.02); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @keyframes holeExpand {
          0% { width: 20px; height: 20px; }
          100% { width: 300vmax; height: 300vmax; }
        }
      `}</style>
    </div>
  );
}
