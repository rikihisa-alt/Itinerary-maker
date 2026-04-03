"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Spot } from "@/types/spot";

const W = [420, 280, 360, 300, 400, 320, 380, 260, 340, 290, 410, 350];
const AR = ["3/4", "4/3", "1/1", "4/5", "3/2", "4/3", "1/1", "3/4", "4/3", "3/2", "4/5", "1/1"];

export function HorizontalGallery({ items, title }: { items: Spot[]; title: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section>
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] mb-[28px] flex items-end justify-between">
        <h2 className="serif text-[26px] font-bold tracking-[-0.01em]">{title}</h2>
        <div className="flex gap-[6px]">
          <button onClick={() => scroll(-1)}
            className="w-[36px] h-[36px] rounded-full border border-g2 flex items-center justify-center text-g4 hover:border-g3 hover:text-ink transition-colors active:scale-[0.95]"
            aria-label="前へ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={() => scroll(1)}
            className="w-[36px] h-[36px] rounded-full border border-g2 flex items-center justify-center text-g4 hover:border-g3 hover:text-ink transition-colors active:scale-[0.95]"
            aria-label="次へ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        className="flex gap-[14px] md:gap-[18px] px-[20px] md:px-[48px] pb-[8px] overflow-x-auto"
        style={{ scrollBehavior: "smooth", scrollSnapType: "x mandatory", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {items.map((s, i) => (
          <Link key={s.id} href={`/destinations/${s.id}`}
            className="group block shrink-0"
            style={{ width: `${W[i % W.length]}px`, scrollSnapAlign: "center" }}>
            <div className="relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40"
              style={{ aspectRatio: AR[i % AR.length] }}>
              <Image src={s.images[0]} alt={s.title} fill
                className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                sizes={`${W[i % W.length]}px`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-[16px] translate-y-[10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[350ms] delay-[150ms]">
                <div className="bg-black/30 backdrop-blur-sm rounded-[6px] p-[12px]">
                  <p className="mono text-[10px] text-white/50 tracking-[0.1em] uppercase">{s.area}</p>
                  <p className="serif text-[16px] text-white font-bold leading-[1.3] mt-[2px]">{s.title}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-[6px] mt-[8px] px-[2px]">
              <span className="mono text-[11px] text-g4">{s.area}</span>
              <span className="w-[3px] h-[3px] rounded-full bg-g3" />
              <span className="text-[11px] text-g4">{s.tags[0]}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
