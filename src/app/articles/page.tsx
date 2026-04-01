"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllArticles } from "@/lib/contentLoader";
import { ArticleCategory, ArticleTargetType } from "@/types/article";
import { formatDate } from "@/lib/helpers";

const CATS: ArticleCategory[] = ["モデルコース", "エリアガイド", "季節特集", "テーマ旅", "グルメ旅", "温泉旅", "絶景旅"];
const TGTS: ArticleTargetType[] = ["全般", "カップル", "一人旅", "家族", "友達", "女子旅"];

export default function ArticlesPage() {
  const all = getAllArticles();
  const [cat, setCat] = useState<ArticleCategory | "">("");
  const [tgt, setTgt] = useState<ArticleTargetType | "">("");

  const filtered = useMemo(() => {
    let r = all;
    if (cat) r = r.filter((a) => a.category === cat);
    if (tgt) r = r.filter((a) => a.targetType === tgt);
    return r;
  }, [all, cat, tgt]);

  return (
    <div className="pt-[80px] pb-[120px]">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] mb-[48px]">
        <p className="text-[11px] font-[--mono] tracking-[0.15em] uppercase text-dim mb-[8px]">Articles</p>
        <h1 className="font-[--serif] text-[36px] md:text-[48px] font-bold tracking-[-0.02em] leading-[1.15]">読むと、出たくなる。</h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] mb-[48px] space-y-[12px]">
        <div className="flex gap-[6px] overflow-x-auto pb-[4px]" style={{ scrollbarWidth: "none" }}>
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(cat === c ? "" : c)}
              className={`shrink-0 px-[14px] py-[6px] rounded-full text-[12px] transition-all ${cat === c ? "bg-dark text-white" : "bg-white text-dim border border-warm"}`}>{c}</button>
          ))}
        </div>
        <div className="flex gap-[6px] overflow-x-auto pb-[4px]" style={{ scrollbarWidth: "none" }}>
          {TGTS.map((t) => (
            <button key={t} onClick={() => setTgt(tgt === t ? "" : t)}
              className={`shrink-0 px-[14px] py-[6px] rounded-full text-[12px] transition-all ${tgt === t ? "bg-dark text-white" : "bg-white text-dim border border-warm"}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* 記事リスト — 最初だけ大きい、あとは線区切り */}
      <div className="max-w-[900px] mx-auto px-[20px] md:px-[48px]">
        {filtered.map((a, i) => (
          <Link key={a.id} href={`/articles/${a.slug}`}
            className={`group block ${i === 0 ? "mb-[48px]" : "py-[24px] border-b border-warm"}`}>
            {i === 0 ? (
              /* 最初の記事 — 大きく、背景色あり */
              <div className="bg-navy text-white rounded-[12px] p-[28px] md:p-[40px]">
                <div className="flex items-center gap-[8px] mb-[12px]">
                  <span className="text-[11px] font-medium bg-gold text-white px-[8px] py-[2px] rounded-full">{a.category}</span>
                  <span className="text-[11px] text-white/30">{a.targetType}</span>
                  {a.readingTime && <span className="text-[11px] text-white/30 font-[--mono]">{a.readingTime}min</span>}
                </div>
                <h2 className="font-[--serif] text-[22px] md:text-[30px] font-bold leading-[1.3] group-hover:text-gold transition-colors mb-[12px]">{a.title}</h2>
                <p className="text-[14px] text-white/40 leading-[1.9] max-w-[500px]">{a.description}</p>
              </div>
            ) : (
              /* それ以降 — 線区切りのテキストのみ */
              <div>
                <div className="flex items-center gap-[8px] mb-[6px]">
                  <span className="text-[11px] text-navy bg-navy/5 px-[8px] py-[2px] rounded-full">{a.category}</span>
                  <span className="text-[11px] text-mute">{a.targetType}</span>
                  <span className="text-[11px] text-mute font-[--mono]">{formatDate(a.publishedAt)}</span>
                </div>
                <h3 className="font-[--serif] text-[18px] font-bold leading-[1.4] group-hover:text-navy transition-colors">{a.title}</h3>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
