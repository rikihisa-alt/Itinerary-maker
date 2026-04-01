"use client";

import { useRef } from "react";
import Link from "next/link";
import { Destination } from "@/types/destination";

export function PhotoSlider({ items, label }: { items: Destination[]; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    const amount = ref.current.offsetWidth * 0.7;
    ref.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative group/slider">
      {label && (
        <p className="text-[11px] tracking-[0.2em] uppercase text-stone mb-4 px-5 md:px-10">{label}</p>
      )}

      {/* Scroll buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-cloud/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/slider:opacity-100 transition-opacity text-fg"
        aria-label="前へ"
      >
        ‹
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-cloud/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/slider:opacity-100 transition-opacity text-fg"
        aria-label="次へ"
      >
        ›
      </button>

      <div ref={ref} className="scroll-x flex gap-4 px-5 md:px-10 pb-4">
        {items.map((dest, i) => (
          <Link
            key={dest.id}
            href={`/destinations/${dest.id}`}
            className={`snap-item group block ${
              i === 0 ? "w-[75vw] md:w-[50vw]" : "w-[60vw] md:w-[35vw]"
            }`}
          >
            <div className="img-overlay rounded-2xl bg-ink/10 overflow-hidden">
              <div className={`${i === 0 ? "aspect-[3/2]" : "aspect-[4/3]"} bg-gradient-to-br from-ink/30 via-ink/10 to-accent/10 relative`}>
                <div className="absolute inset-0 flex items-end p-5 md:p-7 z-10">
                  <div>
                    <p className="text-[11px] tracking-wider uppercase text-white/50 mb-1">
                      {dest.area} — {dest.prefecture}
                    </p>
                    <h3 className="font-editorial text-xl md:text-2xl text-white font-bold leading-tight">
                      {dest.name}
                    </h3>
                    <p className="text-white/50 text-sm mt-2 line-clamp-1 max-w-[280px]">
                      {dest.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 px-1">
              <div className="flex gap-1.5">
                {dest.tags.slice(0, 2).map((t) => (
                  <span key={t} className="text-[11px] text-stone bg-cream px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-stone">{dest.budgetRange}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ArticleSlider({ articles }: { articles: { id: string; slug: string; title: string; category: string; targetType: string; description: string; tags: string[] }[] }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="scroll-x flex gap-5 px-5 md:px-10 pb-4">
      {articles.map((article, i) => (
        <Link
          key={article.id}
          href={`/articles/${article.slug}`}
          className={`snap-item group block ${i === 0 ? "w-[80vw] md:w-[45vw]" : "w-[70vw] md:w-[35vw]"}`}
        >
          <div className={`rounded-2xl p-6 md:p-8 h-full transition-all lift ${
            i === 0 ? "bg-ink text-cloud" : "bg-cream"
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${
                i === 0 ? "bg-accent text-white" : "bg-accent/10 text-accent"
              }`}>
                {article.category}
              </span>
              <span className={`text-[11px] ${i === 0 ? "text-cloud/40" : "text-stone"}`}>
                {article.targetType}
              </span>
            </div>
            <h3 className={`font-editorial text-lg md:text-xl font-bold leading-snug mb-3 ${
              i === 0 ? "group-hover:text-accent-soft" : "group-hover:text-accent"
            } transition-colors`}>
              {article.title}
            </h3>
            <p className={`text-sm leading-relaxed line-clamp-2 ${
              i === 0 ? "text-cloud/50" : "text-stone"
            }`}>
              {article.description}
            </p>
            <div className="flex gap-2 mt-4">
              {article.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={`text-[11px] ${i === 0 ? "text-cloud/30" : "text-stone/60"}`}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
