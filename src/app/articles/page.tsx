"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllArticles } from "@/lib/contentLoader";
import { ArticleCategory, ArticleTargetType } from "@/types/article";
import { formatDate } from "@/lib/helpers";

const CATEGORIES: ArticleCategory[] = [
  "モデルコース",
  "エリアガイド",
  "季節特集",
  "テーマ旅",
  "グルメ旅",
  "温泉旅",
  "絶景旅",
];

const TARGETS: ArticleTargetType[] = ["全般", "カップル", "一人旅", "家族", "友達", "女子旅"];

export default function ArticlesPage() {
  const allArticles = getAllArticles();
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | "">("");
  const [selectedTarget, setSelectedTarget] = useState<ArticleTargetType | "">("");

  const filtered = useMemo(() => {
    let result = allArticles;
    if (selectedCategory) result = result.filter((a) => a.category === selectedCategory);
    if (selectedTarget) result = result.filter((a) => a.targetType === selectedTarget);
    return result;
  }, [allArticles, selectedCategory, selectedTarget]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <p className="text-accent text-sm font-medium mb-2">ARTICLES</p>
        <h1 className="text-4xl font-bold mb-3">読むと旅に出たくなる</h1>
        <p className="text-muted text-lg">
          情報じゃなく、体験を伝える記事。
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-10">
        <div>
          <p className="text-xs text-muted mb-2 font-medium">カテゴリ</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  selectedCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-surface text-muted hover:bg-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted mb-2 font-medium">ターゲット</p>
          <div className="flex flex-wrap gap-2">
            {TARGETS.map((target) => (
              <button
                key={target}
                onClick={() => setSelectedTarget(selectedTarget === target ? "" : target)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  selectedTarget === target
                    ? "bg-foreground text-background"
                    : "bg-surface text-muted hover:bg-border"
                }`}
              >
                {target}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted mb-8">{filtered.length}件の記事</p>

      {/* 記事リスト - 最初の1件を大きく */}
      <div className="space-y-6">
        {filtered.map((article, i) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group block"
          >
            <article
              className={`rounded-2xl transition-shadow hover:shadow-lg ${
                i === 0
                  ? "bg-foreground text-background p-8 md:p-12"
                  : "bg-surface p-6 md:p-8"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    i === 0
                      ? "bg-accent text-white"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  {article.category}
                </span>
                <span className={`text-xs ${i === 0 ? "text-background/50" : "text-muted"}`}>
                  {article.targetType}
                </span>
                {article.readingTime && (
                  <span className={`text-xs ${i === 0 ? "text-background/50" : "text-muted"}`}>
                    {article.readingTime}分
                  </span>
                )}
                <span className={`text-xs ${i === 0 ? "text-background/40" : "text-muted"}`}>
                  {formatDate(article.publishedAt)}
                </span>
              </div>

              <h2
                className={`font-bold leading-snug transition-colors ${
                  i === 0
                    ? "text-2xl md:text-4xl group-hover:text-accent-light"
                    : "text-xl md:text-2xl group-hover:text-accent"
                }`}
              >
                {article.title}
              </h2>

              <p
                className={`mt-3 leading-relaxed ${
                  i === 0 ? "text-background/60 text-base md:text-lg max-w-3xl" : "text-muted"
                }`}
              >
                {article.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-1 rounded ${
                      i === 0 ? "bg-background/10 text-background/60" : "bg-background text-muted"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
