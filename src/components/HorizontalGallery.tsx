"use client";

import Link from "next/link";
import { Spot } from "@/types/destination";

const W = [420, 280, 360, 300, 400, 320, 380, 260, 340, 290, 410, 350];
const AR = ["3/4", "4/3", "1/1", "4/5", "3/2", "4/3", "1/1", "3/4", "4/3", "3/2", "4/5", "1/1"];

export function HorizontalGallery({ items, title }: { items: Spot[]; title: string }) {
  return (
    <section>
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] mb-[28px]">
        <h2 className="serif text-[26px] font-bold tracking-[-0.01em]">{title}</h2>
      </div>
      <div className="hscroll flex gap-[14px] md:gap-[18px] px-[20px] md:px-[48px] pb-[8px]">
        {items.map((s, i) => (
          <Link key={s.id} href={`/destinations/${s.id}`}
            className="hsnap group block"
            style={{ width: `${W[i % W.length]}px`, minWidth: `${W[i % W.length]}px` }}>
            <div className="relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40"
              style={{ aspectRatio: AR[i % AR.length] }}>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-ink/10 to-ink/30 transition-transform duration-500 group-hover:scale-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* Text — hidden by default, slide up on hover */}
              <div className="absolute inset-x-0 bottom-0 p-[16px] translate-y-[8px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                <div className="bg-black/20 backdrop-blur-sm rounded-[6px] p-[12px]">
                  <p className="mono text-[10px] text-white/40 tracking-[0.1em] uppercase">{s.area}</p>
                  <p className="serif text-[16px] text-white font-bold leading-[1.3] mt-[2px]">{s.title}</p>
                  <p className="text-[11px] text-white/40 mt-[4px] line-clamp-1">{s.description}</p>
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
