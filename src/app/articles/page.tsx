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
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10 md:py-20">
      <div className="mb-12">
        <div className="divider mb-4" />
        <h1 className="text-display text-3xl md:text-5xl mb-3">記事</h1>
        <p className="text-stone">読むと旅に出たくなる。情報じゃなく、体験を伝える。</p>
      </div>

      <div className="space-y-3 mb-10">
        <div>
          <p className="text-[11px] text-stone mb-1.5 font-medium tracking-wider">カテゴリ</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(cat === c ? "" : c)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] transition-all ${cat === c ? "bg-fg text-bg" : "bg-cream text-stone hover:bg-sand/60"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] text-stone mb-1.5 font-medium tracking-wider">ターゲット</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {TGTS.map((t) => (
              <button key={t} onClick={() => setTgt(tgt === t ? "" : t)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] transition-all ${tgt === t ? "bg-fg text-bg" : "bg-cream text-stone hover:bg-sand/60"}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {filtered.map((a, i) => (
          <Link key={a.id} href={`/articles/${a.slug}`} className="group block lift">
            <article className={`rounded-2xl p-7 md:p-10 ${i === 0 ? "bg-ink text-cloud" : "bg-cream"}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${i === 0 ? "bg-accent text-white" : "bg-accent/10 text-accent"}`}>{a.category}</span>
                <span className={`text-[11px] ${i === 0 ? "text-cloud/40" : "text-stone"}`}>{a.targetType}</span>
                {a.readingTime && <span className={`text-[11px] ${i === 0 ? "text-cloud/40" : "text-stone"}`}>{a.readingTime}分</span>}
                <span className={`text-[11px] ${i === 0 ? "text-cloud/30" : "text-stone/60"}`}>{formatDate(a.publishedAt)}</span>
              </div>
              <h2 className={`font-editorial font-bold leading-snug transition-colors ${
                i === 0 ? "text-2xl md:text-4xl group-hover:text-accent-soft" : "text-xl md:text-2xl group-hover:text-accent"
              }`}>{a.title}</h2>
              <p className={`mt-3 leading-relaxed ${i === 0 ? "text-cloud/50 max-w-2xl" : "text-stone"}`}>{a.description}</p>
              <div className="flex gap-2 mt-5">
                {a.tags.slice(0, 4).map((t) => (
                  <span key={t} className={`text-[11px] ${i === 0 ? "text-cloud/30" : "text-stone/50"}`}>#{t}</span>
                ))}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
