"use client";

import Link from "next/link";
import { Destination } from "@/types/destination";

const WIDTHS = [420, 280, 360, 320, 400, 300, 380, 340];

export function HorizontalGallery({
  items,
  title,
  subtitle,
}: {
  items: Destination[];
  title: string;
  subtitle?: string;
}) {
  return (
    <section>
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] mb-[32px]">
        {subtitle && (
          <p className="text-[11px] font-[--mono] tracking-[0.15em] uppercase text-dim mb-[8px]">{subtitle}</p>
        )}
        <div className="flex items-end justify-between">
          <h2 className="font-[--serif] text-[26px] font-bold tracking-[-0.01em]">{title}</h2>
          <Link href="/destinations" className="text-[13px] text-dim hover:text-dark transition-colors hidden md:block">
            すべて見る →
          </Link>
        </div>
      </div>

      <div className="hscroll flex gap-[16px] px-[20px] md:px-[48px] pb-[8px]">
        {items.map((dest, i) => {
          const w = WIDTHS[i % WIDTHS.length];
          return (
            <Link
              key={dest.id}
              href={`/destinations/${dest.id}`}
              className="hsnap group imgz block"
              style={{ width: `${w}px`, minWidth: `${w}px` }}
            >
              {/* 写真 */}
              <div className="relative rounded-[12px] overflow-hidden mb-[12px]"
                style={{ aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "4/3" : "1/1" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-navy/40 via-dark/20 to-dark/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-[16px] z-10">
                  <p className="text-[11px] text-white/40 font-[--mono] mb-[2px]">{dest.area}</p>
                  <p className="font-[--serif] text-[18px] text-white font-bold leading-[1.3]">{dest.name}</p>
                </div>
              </div>

              {/* Meta — 画像の外 */}
              <div className="flex items-center gap-[8px]">
                <span className="text-[11px] text-dim">{dest.category[0]}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-mute" />
                <span className="text-[11px] text-dim">{dest.budgetRange}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
