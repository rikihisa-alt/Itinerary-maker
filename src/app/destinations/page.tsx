"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllDestinations } from "@/lib/contentLoader";
import { AREA_LIST, CATEGORY_LIST, TAG_LIST } from "@/lib/helpers";
import { Area, DestinationCategory, TravelTag } from "@/types/destination";

export default function DestinationsPage() {
  const all = getAllDestinations();
  const [area, setArea] = useState<Area | "">("");
  const [cat, setCat] = useState<DestinationCategory | "">("");
  const [tag, setTag] = useState<TravelTag | "">("");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let r = all;
    if (area) r = r.filter((d) => d.area === area);
    if (cat) r = r.filter((d) => d.category.includes(cat));
    if (tag) r = r.filter((d) => d.tags.includes(tag));
    if (q) r = r.filter((d) => d.name.includes(q) || d.description.includes(q) || d.prefecture.includes(q));
    return r;
  }, [all, area, cat, tag, q]);

  const clear = () => { setArea(""); setCat(""); setTag(""); setQ(""); };
  const has = area || cat || tag || q;

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10 md:py-20">
      <div className="mb-12">
        <div className="divider mb-4" />
        <h1 className="text-display text-3xl md:text-5xl mb-3">観光地</h1>
        <p className="text-stone">条件で絞って、自分に刺さる場所を見つける。</p>
      </div>

      <input type="text" placeholder="地名・キーワードで探す…" value={q} onChange={(e) => setQ(e.target.value)}
        className="w-full max-w-md bg-cloud border border-sand/60 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-accent mb-6" />

      <div className="space-y-3 mb-10">
        <FilterRow label="エリア" items={AREA_LIST} selected={area} onSelect={(v) => setArea(area === v ? "" : v as Area)} />
        <FilterRow label="カテゴリ" items={[...CATEGORY_LIST]} selected={cat} onSelect={(v) => setCat(cat === v ? "" : v as DestinationCategory)} />
        <FilterRow label="スタイル" items={[...TAG_LIST]} selected={tag} onSelect={(v) => setTag(tag === v ? "" : v as TravelTag)} />
        {has && <button onClick={clear} className="text-xs text-accent hover:underline">クリア</button>}
      </div>

      <p className="text-sm text-stone mb-8">{filtered.length}件{has ? "（絞り込み中）" : ""}</p>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-editorial text-2xl mb-2">見つかりません</p>
          <p className="text-stone text-sm">フィルターを変えてみてください。</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Hero */}
          <Link href={`/destinations/${filtered[0].id}`} className="group block lift">
            <div className="bg-ink text-cloud rounded-2xl overflow-hidden md:grid md:grid-cols-2">
              <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-ink/80 via-ink/60 to-accent/20 min-h-[200px] relative img-overlay">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent z-[1]" />
              </div>
              <div className="p-7 md:p-10 flex flex-col justify-center">
                <p className="text-[11px] tracking-[0.15em] uppercase text-accent-soft mb-2">{filtered[0].area} — {filtered[0].prefecture}</p>
                <h2 className="font-editorial text-2xl md:text-4xl font-bold mb-3 group-hover:text-accent-soft transition-colors">{filtered[0].name}</h2>
                <p className="text-cloud/50 text-sm leading-relaxed mb-4">{filtered[0].description}</p>
                <div className="flex flex-wrap gap-2">
                  {filtered[0].category.map((c) => (
                    <span key={c} className="text-[11px] bg-cloud/10 px-3 py-1 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>

          {/* Medium */}
          {filtered.length > 1 && (
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.slice(1, 3).map((d) => (
                <Link key={d.id} href={`/destinations/${d.id}`} className="group block lift">
                  <div className="bg-cream rounded-2xl overflow-hidden h-full">
                    <div className="aspect-[16/9] bg-ink/5 relative img-overlay">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-[1]" />
                      <div className="absolute bottom-0 p-5 z-10">
                        <p className="text-[11px] text-white/50">{d.area}</p>
                        <h3 className="font-editorial text-xl font-bold text-white">{d.name}</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-stone line-clamp-2">{d.description}</p>
                      <div className="flex gap-2 mt-3">
                        {d.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[11px] text-stone bg-bg px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Grid */}
          {filtered.length > 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.slice(3).map((d) => (
                <Link key={d.id} href={`/destinations/${d.id}`} className="group lift">
                  <div className="bg-cloud rounded-xl p-5 border border-sand/40 h-full">
                    <div className="flex justify-between mb-2">
                      <p className="text-[11px] text-stone">{d.area} · {d.category[0]}</p>
                      {d.rating && <span className="text-[11px] font-medium text-accent">★ {d.rating}</span>}
                    </div>
                    <h3 className="font-editorial font-bold mb-2 group-hover:text-accent transition-colors">{d.name}</h3>
                    <p className="text-[13px] text-stone line-clamp-2">{d.description}</p>
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

function FilterRow({ label, items, selected, onSelect }: { label: string; items: string[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <div>
      <p className="text-[11px] text-stone mb-1.5 font-medium tracking-wider">{label}</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {items.map((v) => (
          <button key={v} onClick={() => onSelect(v)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] transition-all ${
              selected === v ? "bg-fg text-bg" : "bg-cream text-stone hover:bg-sand/60"
            }`}>{v}</button>
        ))}
      </div>
    </div>
  );
}
