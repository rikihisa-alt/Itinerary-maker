"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[6px]">Destinations</p>
          <h1 className="serif text-[36px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.1] mb-[32px]">観光地</h1>
        </motion.div>

        <input type="text" placeholder="地名で探す…" value={q} onChange={(e) => setQ(e.target.value)}
          className="w-full max-w-[360px] bg-white border border-g2 rounded-[6px] px-[14px] py-[9px] text-[13px] focus:outline-none focus:border-accent mb-[20px]" />

        <div className="flex gap-[6px] overflow-x-auto mb-[40px]" style={{ scrollbarWidth: "none" }}>
          <button onClick={() => setArea("")} className={`shrink-0 px-[14px] py-[5px] rounded-full text-[12px] transition-all ${!area ? "bg-ink text-white" : "bg-white text-g4 border border-g2"}`}>すべて</button>
          {areas.map((a) => (
            <button key={a} onClick={() => setArea(area === a ? "" : a)} className={`shrink-0 px-[14px] py-[5px] rounded-full text-[12px] transition-all ${area === a ? "bg-ink text-white" : "bg-white text-g4 border border-g2"}`}>{a}</button>
          ))}
        </div>

        <p className="mono text-[11px] text-g3 mb-[28px]">{filtered.length} spots</p>

        {/* 非対称グリッド */}
        <div className="space-y-[48px]">
          {/* Hero */}
          {filtered[0] && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <Link href={`/destinations/${filtered[0].id}`} className="group block relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40" style={{ aspectRatio: "21/9" }}>
                <Image src={filtered[0].images[0]} alt={filtered[0].title} fill className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]" sizes="95vw" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-[24px] md:p-[44px] z-10 max-w-[440px]">
                  <p className="mono text-[10px] text-white/40 tracking-wider uppercase mb-[6px]">{filtered[0].area}</p>
                  <h2 className="serif text-[24px] md:text-[40px] text-white font-bold leading-[1.15] group-hover:text-gold transition-colors">{filtered[0].title}</h2>
                  <p className="text-[12px] text-white/35 mt-[8px]">{filtered[0].description}</p>
                </div>
              </Link>
            </motion.div>
          )}

          {/* 非対称2列 */}
          {filtered.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-[14px]">
              {filtered.slice(1, 3).map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }} viewport={{ once: true }}
                  className={i === 0 ? "md:row-span-2" : ""}>
                  <Link href={`/destinations/${s.id}`} className="group block relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40 h-full"
                    style={{ aspectRatio: i === 0 ? "3/4" : "4/3", minHeight: "200px" }}>
                    <Image src={s.images[0]} alt={s.title} fill className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" sizes={i === 0 ? "60vw" : "35vw"} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-0 p-[20px] z-10 translate-y-[8px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[350ms] delay-[150ms]">
                      <div className="bg-black/30 backdrop-blur-sm rounded-[6px] p-[12px]">
                        <p className="mono text-[10px] text-white/40">{s.area}</p>
                        <p className="serif text-[16px] text-white font-bold">{s.title}</p>
                        <p className="text-[11px] text-white/35 mt-[2px]">{s.description}</p>
                      </div>
                    </div>
                    <div className="absolute top-[14px] left-[14px] z-10">
                      <p className="serif text-[16px] text-white/80 font-bold drop-shadow-lg">{s.title}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* リスト */}
          {filtered.length > 3 && (
            <div className="border-t border-g1">
              {filtered.slice(3).map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.5 }} viewport={{ once: true }}>
                  <Link href={`/destinations/${s.id}`}
                    className="group flex items-center gap-[16px] md:gap-[20px] py-[16px] border-b border-g1/60 hover:bg-white/40 transition-colors active:scale-[0.99]">
                    <div className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] rounded-[6px] overflow-hidden shrink-0 relative outline outline-1 outline-g2/30">
                      <Image src={s.images[0]} alt={s.title} fill className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.08]" sizes="72px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="mono text-[10px] text-g3 mb-[1px]">{s.area} · {s.tags[0]}</p>
                      <h3 className="serif text-[16px] font-bold group-hover:text-accent transition-colors truncate">{s.title}</h3>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="mono text-[11px] text-g3">{s.stayDuration}min</p>
                      <p className="text-[10px] text-g3">{s.budget}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
