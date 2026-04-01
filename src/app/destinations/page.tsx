"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllSpots, getAreas } from "@/lib/contentLoader";

export default function DestinationsPage() {
  const spots = getAllSpots();
  const areas = getAreas();
  const [area, setArea] = useState("");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let r = spots;
    if (area) r = r.filter((s) => s.area === area);
    if (q) r = r.filter((s) => s.title.includes(q) || s.description.includes(q) || s.location.includes(q));
    return r;
  }, [spots, area, q]);

  return (
    <div className="pt-[80px] pb-[120px]">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px]">
        <div className="mb-[40px]">
          <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[6px]">Destinations</p>
          <h1 className="serif text-[36px] md:text-[48px] font-bold tracking-[-0.02em] leading-[1.12]">観光地</h1>
        </div>

        <input type="text" placeholder="地名で探す…" value={q} onChange={(e) => setQ(e.target.value)}
          className="w-full max-w-[360px] bg-white border border-g2 rounded-[6px] px-[14px] py-[9px] text-[13px] focus:outline-none focus:border-accent mb-[20px]" />

        <div className="flex gap-[6px] overflow-x-auto mb-[40px]" style={{ scrollbarWidth: "none" }}>
          <button onClick={() => setArea("")}
            className={`shrink-0 px-[14px] py-[5px] rounded-full text-[12px] transition-all ${!area ? "bg-ink text-white" : "bg-white text-g4 border border-g2"}`}>すべて</button>
          {areas.map((a) => (
            <button key={a} onClick={() => setArea(area === a ? "" : a)}
              className={`shrink-0 px-[14px] py-[5px] rounded-full text-[12px] transition-all ${area === a ? "bg-ink text-white" : "bg-white text-g4 border border-g2"}`}>{a}</button>
          ))}
        </div>

        <p className="mono text-[11px] text-g3 mb-[24px]">{filtered.length} spots</p>

        {/* 非対称グリッド */}
        <div className="space-y-[40px]">
          {/* Hero */}
          {filtered[0] && (
            <Link href={`/destinations/${filtered[0].id}`} className="group block relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40" style={{ aspectRatio: "21/9" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent transition-transform duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/15 to-transparent" />
              <div className="absolute bottom-0 left-0 p-[24px] md:p-[40px] z-10 max-w-[440px]">
                <div className="flex items-center gap-[8px] mb-[6px]">
                  <span className="mono text-[10px] text-white/30 tracking-wider uppercase">{filtered[0].area}</span>
                  <span className="text-[10px] text-white/20">·</span>
                  <span className="mono text-[10px] text-white/20">{filtered[0].stayDuration}min</span>
                  <span className="text-[10px] text-white/20">·</span>
                  <span className="text-[10px] text-white/20">{filtered[0].crowdLevel === "low" ? "混雑:低" : filtered[0].crowdLevel === "medium" ? "混雑:中" : "混雑:高"}</span>
                </div>
                <h2 className="serif text-[24px] md:text-[36px] text-white font-bold leading-[1.2] group-hover:text-gold transition-colors">{filtered[0].title}</h2>
                <p className="text-[12px] text-white/30 mt-[6px]">{filtered[0].description}</p>
              </div>
            </Link>
          )}

          {/* 2col asymmetric */}
          {filtered.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-[14px]">
              {filtered.slice(1, 3).map((s, i) => (
                <Link key={s.id} href={`/destinations/${s.id}`}
                  className={`group block relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40 ${i === 0 ? "md:row-span-2" : ""}`}
                  style={{ aspectRatio: i === 0 ? "3/4" : "4/3", minHeight: "200px" }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-ink/25 via-accent/10 to-ink/20 transition-transform duration-500 group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 p-[20px] z-10 translate-y-[6px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                    <div className="bg-black/20 backdrop-blur-sm rounded-[6px] p-[10px]">
                      <p className="mono text-[10px] text-white/30">{s.area}</p>
                      <p className="serif text-[16px] text-white font-bold">{s.title}</p>
                      <p className="text-[11px] text-white/30 mt-[2px]">{s.description}</p>
                    </div>
                  </div>
                  {/* Always visible label */}
                  <div className="absolute top-[14px] left-[14px] z-10">
                    <p className="serif text-[16px] text-white/80 font-bold">{s.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Line-separated list */}
          {filtered.length > 3 && (
            <div className="border-t border-g1">
              {filtered.slice(3).map((s) => (
                <Link key={s.id} href={`/destinations/${s.id}`}
                  className="group flex items-center gap-[20px] py-[18px] border-b border-g1/60 hover:bg-white/40 transition-colors px-[4px] active:scale-[0.99]"
                  style={{ transitionDelay: "0.15s" }}>
                  <div className="w-[48px] h-[48px] rounded-[6px] bg-gradient-to-br from-accent/15 to-ink/10 shrink-0 hidden md:block" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-[6px] mb-[1px]">
                      <span className="mono text-[10px] text-g3">{s.area}</span>
                      <span className="text-[10px] text-g3">·</span>
                      <span className="text-[10px] text-g3">{s.tags[0]}</span>
                    </div>
                    <h3 className="serif text-[16px] font-bold group-hover:text-accent transition-colors truncate">{s.title}</h3>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="mono text-[11px] text-g3">{s.stayDuration}min</p>
                    <p className="text-[10px] text-g3">{s.budget}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
