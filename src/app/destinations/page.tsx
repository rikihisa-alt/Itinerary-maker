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
        (d) => d.name.includes(q) || d.description.includes(q) || d.prefecture.includes(q) || d.tags.some((t) => t.includes(q))
      );
    }
    return result;
  }, [allDestinations, selectedArea, selectedCategory, selectedTag, query]);

  const clearFilters = () => { setSelectedArea(""); setSelectedCategory(""); setSelectedTag(""); setQuery(""); };
  const hasFilters = selectedArea || selectedCategory || selectedTag || query;

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="text-accent text-xs font-medium tracking-[0.15em] uppercase mb-3">Destinations</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">観光地を探す</h1>
        <p className="text-muted">条件で絞って、自分に刺さる場所を見つける。</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="地名・キーワードで探す..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md bg-white border border-border rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent placeholder:text-muted"
        />
      </div>

      {/* Filters - horizontal scroll on mobile */}
      <div className="space-y-3 mb-8">
        <div>
          <p className="text-xs text-muted mb-2 font-medium">エリア</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {AREA_LIST.map((area) => (
              <button key={area} onClick={() => setSelectedArea(selectedArea === area ? "" : area)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                  selectedArea === area ? "bg-foreground text-background" : "bg-surface text-muted hover:bg-border"
                }`}>{area}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted mb-2 font-medium">カテゴリ</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORY_LIST.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                  selectedCategory === cat ? "bg-foreground text-background" : "bg-surface text-muted hover:bg-border"
                }`}>{cat}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted mb-2 font-medium">スタイル</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {TAG_LIST.map((tag) => (
              <button key={tag} onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                  selectedTag === tag ? "bg-foreground text-background" : "bg-surface text-muted hover:bg-border"
                }`}>{tag}</button>
            ))}
          </div>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-accent hover:underline">フィルターをクリア</button>
        )}
      </div>

      <p className="text-sm text-muted mb-6">{filtered.length}件{hasFilters ? "（絞り込み中）" : ""}</p>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-xl font-bold mb-2">条件に合う観光地が見つかりません</p>
          <p className="text-muted text-sm">フィルターを変えてみてください。</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Hero card */}
          {filtered[0] && (
            <Link href={`/destinations/${filtered[0].id}`} className="group block">
              <div className="bg-foreground rounded-2xl overflow-hidden card-hover">
                <div className="grid md:grid-cols-2">
                  <div className="aspect-[4/3] md:aspect-auto bg-foreground/80 relative min-h-[200px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                  </div>
                  <div className="p-7 md:p-10 flex flex-col justify-center text-background">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-accent-light bg-accent-light/10 px-3 py-1 rounded-full">{filtered[0].area}</span>
                      <span className="text-xs text-background/40">{filtered[0].prefecture}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-accent-light transition-colors">{filtered[0].name}</h2>
                    <p className="text-background/50 text-sm leading-relaxed mb-4">{filtered[0].description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {filtered[0].category.map((c) => (
                        <span key={c} className="text-xs bg-background/10 px-3 py-1 rounded-full text-background/60">{c}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-background/40">
                      <span>{filtered[0].budgetRange}</span>
                      <span>{filtered[0].stayDuration[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Medium cards */}
          {filtered.length > 1 && (
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.slice(1, 3).map((dest) => (
                <Link key={dest.id} href={`/destinations/${dest.id}`} className="group block">
                  <div className="bg-surface rounded-2xl overflow-hidden card-hover h-full">
                    <div className="aspect-[16/9] bg-foreground/5 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-0 p-5">
                        <p className="text-xs text-white/50 mb-1">{dest.area}</p>
                        <h3 className="text-lg font-bold text-white group-hover:text-accent-light transition-colors">{dest.name}</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-muted line-clamp-2">{dest.description}</p>
                      <div className="flex gap-2 mt-3">
                        {dest.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-xs text-muted bg-background px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Compact grid */}
          {filtered.length > 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.slice(3).map((dest) => (
                <Link key={dest.id} href={`/destinations/${dest.id}`} className="group card-hover">
                  <div className="bg-white rounded-xl p-5 border border-border/50 h-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted">{dest.area} · {dest.category[0]}</p>
                      {dest.rating && <span className="text-xs font-medium text-accent">★ {dest.rating}</span>}
                    </div>
                    <h3 className="font-bold text-sm md:text-base mb-2 group-hover:text-accent transition-colors">{dest.name}</h3>
                    <p className="text-xs text-muted line-clamp-2 mb-3">{dest.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-xs text-muted bg-surface px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
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
