"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllDestinations } from "@/lib/contentLoader";
import { AREA_LIST, CATEGORY_LIST, TAG_LIST } from "@/lib/helpers";
import { Area, DestinationCategory, TravelTag } from "@/types/destination";

export default function DestinationsPage() {
  const allDestinations = getAllDestinations();
  const [selectedArea, setSelectedArea] = useState<Area | "">("");
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | "">("");
  const [selectedTag, setSelectedTag] = useState<TravelTag | "">("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let result = allDestinations;
    if (selectedArea) result = result.filter((d) => d.area === selectedArea);
    if (selectedCategory) result = result.filter((d) => d.category.includes(selectedCategory));
    if (selectedTag) result = result.filter((d) => d.tags.includes(selectedTag));
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.includes(q) ||
          d.description.includes(q) ||
          d.prefecture.includes(q) ||
          d.tags.some((t) => t.includes(q))
      );
    }
    return result;
  }, [allDestinations, selectedArea, selectedCategory, selectedTag, query]);

  const clearFilters = () => {
    setSelectedArea("");
    setSelectedCategory("");
    setSelectedTag("");
    setQuery("");
  };

  const hasFilters = selectedArea || selectedCategory || selectedTag || query;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="text-accent text-sm font-medium mb-2">DESTINATIONS</p>
        <h1 className="text-4xl font-bold mb-3">観光地を探す</h1>
        <p className="text-muted text-lg">
          条件で絞って、自分に刺さる場所を見つける。
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="地名・キーワードで探す..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md bg-surface border border-border rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent placeholder:text-muted"
        />
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-10">
        <div>
          <p className="text-xs text-muted mb-2 font-medium">エリア</p>
          <div className="flex flex-wrap gap-2">
            {AREA_LIST.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(selectedArea === area ? "" : area)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  selectedArea === area
                    ? "bg-foreground text-background"
                    : "bg-surface text-muted hover:bg-border"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted mb-2 font-medium">カテゴリ</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_LIST.map((cat) => (
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
          <p className="text-xs text-muted mb-2 font-medium">旅のスタイル</p>
          <div className="flex flex-wrap gap-2">
            {TAG_LIST.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  selectedTag === tag
                    ? "bg-foreground text-background"
                    : "bg-surface text-muted hover:bg-border"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-accent hover:underline">
            フィルターをクリア
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted mb-6">
        {filtered.length}件の観光地{hasFilters ? "（絞り込み中）" : ""}
      </p>

      {/* 非均一パネルレイアウト */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl font-bold mb-2">条件に合う観光地が見つかりません</p>
          <p className="text-muted">フィルターを変えてみてください。</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 最初の1件: 大きくフィーチャー */}
          {filtered[0] && (
            <Link href={`/destinations/${filtered[0].id}`} className="group block">
              <div className="relative bg-surface rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-[4/3] md:aspect-auto bg-foreground/10 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/20 to-foreground/5" />
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                        {filtered[0].area}
                      </span>
                      <span className="text-xs text-muted">{filtered[0].prefecture}</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-3 group-hover:text-accent transition-colors">
                      {filtered[0].name}
                    </h2>
                    <p className="text-muted leading-relaxed mb-4">
                      {filtered[0].description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {filtered[0].category.map((c) => (
                        <span key={c} className="text-xs bg-background px-3 py-1 rounded-full text-muted">
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted">
                      <span>{filtered[0].budgetRange}</span>
                      <span>{filtered[0].stayDuration[0]}</span>
                      <span>{filtered[0].bestSeason.join("・")}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {filtered[0].tags.slice(0, 5).map((tag) => (
                        <span key={tag} className="text-xs text-muted bg-border/50 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* 2-3件目: 中サイズ横並び */}
          {filtered.length > 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.slice(1, 3).map((dest) => (
                <Link key={dest.id} href={`/destinations/${dest.id}`} className="group block">
                  <div className="bg-surface rounded-2xl overflow-hidden h-full">
                    <div className="aspect-[16/9] bg-foreground/10 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-xs text-white/60 mb-1">{dest.area} / {dest.prefecture}</p>
                        <h3 className="text-xl font-bold text-white group-hover:text-accent-light transition-colors">
                          {dest.name}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-muted leading-relaxed line-clamp-2">{dest.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                        <span>{dest.budgetRange}</span>
                        <span>{dest.stayDuration[0]}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {dest.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-muted bg-background px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 4件目以降: コンパクトなリスト */}
          {filtered.length > 3 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.slice(3).map((dest) => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.id}`}
                  className="group bg-surface rounded-xl p-5 hover:bg-border/60 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs text-muted">
                      {dest.area} · {dest.category[0]}
                    </p>
                    {dest.rating && (
                      <span className="text-xs font-medium text-accent">{dest.rating}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-base mb-2 group-hover:text-accent transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2 mb-3">{dest.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dest.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-muted bg-background px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
