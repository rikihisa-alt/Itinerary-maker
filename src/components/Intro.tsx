"use client";

import { useEffect, useState } from "react";

// 足跡: topで配置（上が0）。delayは下の足跡ほど早い＝下から上に歩く
// 2人分、左右にずらす。サイズ大きく。
const STEPS = [
  // person 1 (left) — 下から上へ (top大→小、delay早→遅)
  { x: -80, top: 75, rot: -10, delay: 0,    sz: 1 },
  { x: -70, top: 60, rot: 12,  delay: 0.28, sz: 1 },
  { x: -85, top: 45, rot: -8,  delay: 0.56, sz: 1 },
  { x: -65, top: 30, rot: 14,  delay: 0.84, sz: 1 },
  { x: -80, top: 15, rot: -12, delay: 1.12, sz: 1 },
  // person 2 (right) — 少し遅れて追いかける
  { x: 80,  top: 78, rot: 8,   delay: 0.14, sz: 0.88 },
  { x: 70,  top: 63, rot: -14, delay: 0.42, sz: 0.88 },
  { x: 85,  top: 48, rot: 10,  delay: 0.70, sz: 0.88 },
  { x: 65,  top: 33, rot: -10, delay: 0.98, sz: 0.88 },
  { x: 80,  top: 18, rot: 12,  delay: 1.26, sz: 0.88 },
];

export function Intro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"walk" | "hole" | "done">("walk");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hole"), 2000);
    const t2 = setTimeout(() => setPhase("done"), 3200);
    const t3 = setTimeout(() => onComplete(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* 黒背景 — hole phaseでclip-pathで穴を開ける */}
      <div
        className="absolute inset-0 bg-[#1c1b19]"
        style={{
          clipPath: phase === "hole"
            ? "circle(0% at 50% 50%)"
            : "circle(100% at 50% 50%)",
          transition: phase === "hole" ? "clip-path 1.0s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        }}
      >
        {/* 足跡 — walk中のみ表示 */}
        {phase === "walk" && (
          <div className="absolute inset-0">
            {STEPS.map((fp, i) => (
              <svg
                key={i}
                width={64 * fp.sz}
                height={90 * fp.sz}
                viewBox="0 0 64 90"
                fill="none"
                className="absolute left-1/2"
                style={{
                  top: `${fp.top}%`,
                  marginLeft: `${fp.x - 32 * fp.sz}px`,
                  transform: `rotate(${fp.rot}deg)`,
                  opacity: 0,
                  animation: `stepUp 0.4s ease-out ${fp.delay}s forwards`,
                }}
              >
                {/* 指5本 */}
                <ellipse cx="14" cy="8"  rx="7"  ry="8"  fill="white" fillOpacity="0.4" />
                <ellipse cx="28" cy="5"  rx="6"  ry="7"  fill="white" fillOpacity="0.35" />
                <ellipse cx="40" cy="6"  rx="5.5" ry="6.5" fill="white" fillOpacity="0.3" />
                <ellipse cx="50" cy="11" rx="5"  ry="6"  fill="white" fillOpacity="0.25" />
                <ellipse cx="56" cy="19" rx="4"  ry="5"  fill="white" fillOpacity="0.2" />
                {/* 足の甲 */}
                <ellipse cx="30" cy="42" rx="18" ry="24" fill="white" fillOpacity="0.25" />
                {/* かかと */}
                <ellipse cx="28" cy="76" rx="14" ry="11" fill="white" fillOpacity="0.2" />
              </svg>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes stepUp {
          0% {
            opacity: 0;
            transform: rotate(var(--r, 0deg)) translateY(20px) scale(0.85);
          }
          50% {
            opacity: 1;
            transform: rotate(var(--r, 0deg)) translateY(-5px) scale(1.04);
          }
          100% {
            opacity: 1;
            transform: rotate(var(--r, 0deg)) translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
