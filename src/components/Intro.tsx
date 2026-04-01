"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const STEPS = [
  { x: -70, y: 82, rot: -10, d: 0 },
  { x: -60, y: 68, rot: 12,  d: 0.22 },
  { x: -75, y: 54, rot: -8,  d: 0.44 },
  { x: -55, y: 40, rot: 14,  d: 0.66 },
  { x: -70, y: 26, rot: -12, d: 0.88 },
  { x: 70,  y: 80, rot: 8,   d: 0.11 },
  { x: 60,  y: 66, rot: -14, d: 0.33 },
  { x: 75,  y: 52, rot: 10,  d: 0.55 },
  { x: 55,  y: 38, rot: -10, d: 0.77 },
  { x: 70,  y: 24, rot: 12,  d: 0.99 },
];

export function Intro({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const feet = el.querySelectorAll<SVGElement>(".foot");
    const mask = el.querySelector<HTMLDivElement>(".mask")!;
    const bg = el.querySelector<HTMLDivElement>(".bg")!;

    const tl = gsap.timeline({
      onComplete: () => { setShow(false); onDone(); },
    });

    // 1. 足跡が下から順に出現
    feet.forEach((f, i) => {
      tl.fromTo(f,
        { opacity: 0, y: 30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.7)" },
        STEPS[i].d
      );
    });

    // 2. 少し待つ
    tl.to({}, { duration: 0.3 });

    // 3. 全体をズーム
    tl.to(bg, { scale: 1.4, duration: 0.6, ease: "power2.in" });

    // 4. マスクの穴を広げる（黒が消えてページが見える）
    tl.to(mask, {
      "--r": "120",
      duration: 0.8,
      ease: "power3.inOut",
    }, "-=0.3");

  }, [onDone]);

  if (!show) return null;

  return (
    <div ref={ref} className="fixed inset-0 z-[200]">
      {/* ページは背後に見える。この上に黒いマスクが乗っている */}
      <div
        className="mask absolute inset-0"
        style={{
          // @ts-expect-error CSS custom property
          "--r": "0",
          background: "#1c1b19",
          clipPath: "circle(calc((100% - var(--r) * 1%) ) at 50% 45%)",
        }}
      />

      {/* 足跡群 */}
      <div className="bg absolute inset-0 flex items-center justify-center" style={{ transformOrigin: "50% 45%" }}>
        {STEPS.map((s, i) => (
          <svg
            key={i}
            className="foot absolute"
            width="72" height="100" viewBox="0 0 72 100"
            fill="none"
            style={{
              left: `calc(50% + ${s.x}px)`,
              top: `${s.y}%`,
              transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
              opacity: 0,
            }}
          >
            <ellipse cx="16" cy="10" rx="8" ry="9" fill="white" fillOpacity="0.4" />
            <ellipse cx="32" cy="6"  rx="7" ry="8" fill="white" fillOpacity="0.35" />
            <ellipse cx="46" cy="8"  rx="6" ry="7" fill="white" fillOpacity="0.3" />
            <ellipse cx="56" cy="15" rx="5.5" ry="6.5" fill="white" fillOpacity="0.25" />
            <ellipse cx="62" cy="24" rx="4.5" ry="5.5" fill="white" fillOpacity="0.2" />
            <ellipse cx="34" cy="50" rx="20" ry="26" fill="white" fillOpacity="0.22" />
            <ellipse cx="32" cy="86" rx="16" ry="12" fill="white" fillOpacity="0.18" />
          </svg>
        ))}
      </div>
    </div>
  );
}
