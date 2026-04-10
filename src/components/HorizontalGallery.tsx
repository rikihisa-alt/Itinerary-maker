"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Spot } from "@/types/spot";

const W = [420, 280, 360, 300, 400, 320, 380, 260, 340, 400, 300, 360];

export function HorizontalGallery({ items, title }: { items: Spot[]; title: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section>
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] mb-[32px] flex items-end justify-between">
        <div>
          <p className="mono text-[11px] tracking-[0.2em] uppercase text-g4 mb-[6px]">Destinations</p>
          <h2 className="serif text-[28px] md:text-[36px] font-light text-accent tracking-[-0.01em]">{title}</h2>
        </div>
        <div className="flex gap-[6px]">
          <button onClick={() => scroll(-1)}
            className="w-[44px] h-[44px] rounded-full border border-g2 flex items-center justify-center text-g4 hover:bg-g1 hover:text-accent transition-colors active:scale-[0.95]"
            aria-label="前へ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={() => scroll(1)}
            className="w-[44px] h-[44px] rounded-full border border-g2 flex items-center justify-center text-g4 hover:bg-g1 hover:text-accent transition-colors active:scale-[0.95]"
            aria-label="次へ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
      <div
        ref={trackRef}
        className="flex gap-[18px] md:gap-[24px] px-[20px] md:px-[48px] pb-[10px] overflow-x-auto no-scrollbar"
        style={{ scrollBehavior: "smooth", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {items.map((s, i) => (
          <Link key={s.id} href={`/destinations/${s.id}`}
            className="group block shrink-0 relative cursor-pointer overflow-hidden rounded-[12px] border border-white/[0.06] transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[4px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] active:translate-y-[-2px] active:scale-[0.98]"
            style={{ width: `${W[i % W.length]}px`, minWidth: `${W[i % W.length]}px`, height: "500px", scrollSnapAlign: "start" }}>
            <Image src={s.images[0]} alt={s.title} fill
              className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.06]"
              sizes={`${W[i % W.length]}px`} />
            {/* Always-visible gradient overlay */}
            <div className="absolute inset-0 z-10 transition-all duration-500"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 40%, transparent 100%)" }} />
            {/* Always-visible text with hover slide */}
            <div className="absolute bottom-0 left-0 right-0 p-[24px] z-20 transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[4px]">
              <div className="flex items-center gap-[8px] mb-[8px]">
                <div className="w-[6px] h-[6px] rounded-full bg-gold" />
                <span className="mono text-[10px] text-gold tracking-[0.2em] uppercase">{s.area}</span>
              </div>
              <p className="serif text-[20px] md:text-[24px] text-white font-light leading-[1.2]">{s.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
