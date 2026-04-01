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
    <div className="pt-[80px]">
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] mb-[48px]">
        <p className="text-[11px] font-[--mono] tracking-[0.15em] uppercase text-dim mb-[8px]">Destinations</p>
        <h1 className="font-[--serif] text-[36px] md:text-[48px] font-bold tracking-[-0.02em] leading-[1.15]">観光地</h1>
      </div>

      {/* Filters */}
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] mb-[48px] space-y-[16px]">
        <input type="text" placeholder="地名・キーワードで探す…" value={q} onChange={(e) => setQ(e.target.value)}
          className="w-full max-w-[400px] bg-white border border-warm rounded-[8px] px-[16px] py-[10px] text-[14px] focus:outline-none focus:border-navy" />

        <Pills label="エリア" items={AREA_LIST} selected={area} onSelect={(v) => setArea(area === v ? "" : v as Area)} />
        <Pills label="カテゴリ" items={[...CATEGORY_LIST]} selected={cat} onSelect={(v) => setCat(cat === v ? "" : v as DestinationCategory)} />
        <Pills label="スタイル" items={[...TAG_LIST]} selected={tag} onSelect={(v) => setTag(tag === v ? "" : v as TravelTag)} />
        {has && <button onClick={clear} className="text-[12px] text-navy hover:underline">クリア</button>}
      </div>

      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[120px]">
        <p className="text-[12px] text-mute mb-[32px]">{filtered.length}件</p>

        {filtered.length === 0 ? (
          <p className="text-dim py-[80px] text-center">条件に合う場所が見つかりません</p>
        ) : (
          <div className="space-y-[48px]">
            {/* Main feature */}
            {filtered[0] && (
              <Link href={`/destinations/${filtered[0].id}`} className="group imgz block">
                <div className="relative rounded-[12px] overflow-hidden aspect-[21/9]">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-navy/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-[24px] md:p-[48px] z-10">
                    <p className="text-[11px] font-[--mono] text-white/30 tracking-wider uppercase mb-[6px]">{filtered[0].area} — {filtered[0].prefecture}</p>
                    <h2 className="font-[--serif] text-[26px] md:text-[40px] text-white font-bold leading-[1.2] group-hover:text-gold transition-colors mb-[8px]">{filtered[0].name}</h2>
                    <p className="text-[13px] text-white/40 max-w-[400px] leading-[1.7]">{filtered[0].description}</p>
                  </div>
                </div>
              </Link>
            )}

            {/* 非対称2列 */}
            {filtered.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-[16px]">
                {filtered.slice(1, 3).map((d, i) => (
                  <div key={d.id} className={i === 0 ? "md:col-span-7" : "md:col-span-5 md:pt-[48px]"}>
                    <Link href={`/destinations/${d.id}`} className="group imgz block">
                      <div className={`relative rounded-[12px] overflow-hidden ${i === 0 ? "aspect-[4/3]" : "aspect-[3/2]"}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-dark/30 to-dark/10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-0 p-[20px] z-10">
                          <p className="text-[11px] font-[--mono] text-white/30">{d.area}</p>
                          <h3 className="font-[--serif] text-[18px] md:text-[22px] text-white font-bold">{d.name}</h3>
                        </div>
                      </div>
                      <p className="text-[13px] text-dim mt-[10px] leading-[1.8] line-clamp-2">{d.description}</p>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* 線区切りリスト */}
            {filtered.length > 3 && (
              <div className="border-t border-warm">
                {filtered.slice(3).map((d) => (
                  <Link key={d.id} href={`/destinations/${d.id}`}
                    className="group flex items-center gap-[16px] md:gap-[32px] py-[20px] border-b border-warm/60 hover:bg-white/40 transition-colors px-[4px]">
                    <div className="hidden md:block w-[60px] shrink-0">
                      <div className="w-[60px] h-[60px] rounded-[8px] bg-gradient-to-br from-dark/10 to-dark/5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-[8px] mb-[2px]">
                        <span className="text-[11px] font-[--mono] text-mute">{d.area}</span>
                        <span className="text-[11px] text-mute">·</span>
                        <span className="text-[11px] text-mute">{d.category[0]}</span>
                      </div>
                      <h3 className="font-[--serif] text-[18px] font-bold group-hover:text-navy transition-colors">{d.name}</h3>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-[12px] text-mute">{d.budgetRange}</p>
                      <p className="text-[11px] text-mute">{d.stayDuration[0]}</p>
                    </div>
                    {d.rating && <span className="text-[12px] font-[--mono] text-gold shrink-0">{d.rating}</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Pills({ label, items, selected, onSelect }: { label: string; items: string[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <div>
      <p className="text-[11px] text-dim mb-[6px]">{label}</p>
      <div className="flex gap-[6px] overflow-x-auto pb-[4px]" style={{ scrollbarWidth: "none" }}>
        {items.map((v) => (
          <button key={v} onClick={() => onSelect(v)}
            className={`shrink-0 px-[14px] py-[6px] rounded-full text-[12px] transition-all ${
              selected === v ? "bg-dark text-white" : "bg-white text-dim border border-warm hover:border-dark/20"
            }`}>{v}</button>
        ))}
      </div>
    </div>
  );
}
