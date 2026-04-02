"use client";

import { useState, useMemo } from "react";
import { getAllArticles, getAllPrefectures } from "@/lib/contentLoader";
import { ArticleCategory, ARTICLE_CATEGORY_LABEL } from "@/types/article";
import { ArticleCardFeatured, ArticleCardCompact } from "@/components/ui/ArticleCard";
import { FilterBar } from "@/components/ui/FilterBar";
import { SectionHeading } from "@/components/ui/SectionHeading";

const CATEGORY_ITEMS: { value: string; label: string }[] = (
  Object.entries(ARTICLE_CATEGORY_LABEL) as [ArticleCategory, string][]
).map(([value, label]) => ({ value, label }));

export default function ArticlesPage() {
  const articles = getAllArticles();
  const prefectures = getAllPrefectures();

  const [category, setCategory] = useState("");
  const [prefectureId, setPrefectureId] = useState("");

  const prefectureItems = useMemo(() => {
    const usedIds = new Set(articles.map((a) => a.prefectureId));
    return prefectures
      .filter((p) => usedIds.has(p.id))
      .map((p) => ({ value: p.id, label: p.name }));
  }, [articles, prefectures]);

  const filtered = useMemo(() => {
    let list = articles;
    if (category) list = list.filter((a) => a.category === category);
    if (prefectureId) list = list.filter((a) => a.prefectureId === prefectureId);
    return list;
  }, [articles, category, prefectureId]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="pt-[80px] pb-[120px]">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px]">

        {/* ── Page header ── */}
        <div className="mb-[40px]">
          <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[6px]">
            Articles
          </p>
          <h1 className="serif text-[36px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.1]">
            読みもの
          </h1>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col gap-[14px] mb-[40px]">
          <FilterBar
            label="カテゴリ"
            items={CATEGORY_ITEMS}
            selected={category}
            onSelect={setCategory}
          />
          <FilterBar
            label="都道府県"
            items={prefectureItems}
            selected={prefectureId}
            onSelect={setPrefectureId}
          />
        </div>

        <p className="mono text-[11px] text-g3 mb-[28px]">
          {filtered.length} articles
        </p>

        {/* ── Featured hero ── */}
        {featured && (
          <div className="mb-[48px]">
            <ArticleCardFeatured article={featured} />
          </div>
        )}

        {/* ── Compact list ── */}
        {rest.length > 0 && (
          <div>
            <SectionHeading label="More" title="その他の記事" />
            <div className="border-t border-g1">
              {rest.map((a) => (
                <ArticleCardCompact key={a.slug} article={a} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <p className="text-[14px] text-g4 py-[60px] text-center">
            該当する記事がありません
          </p>
        )}
      </div>
    </div>
  );
}
