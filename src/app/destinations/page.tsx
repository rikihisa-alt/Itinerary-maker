"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { getAllSpots, getAllCategories, getPopulatedPrefectures } from "@/lib/contentLoader";
import { SPOT_CATEGORY_LABEL } from "@/types/spot";
import { FilterBar } from "@/components/ui/FilterBar";
import { SpotCardHero, SpotCardMedium, SpotCardList } from "@/components/ui/SpotCard";

export default function DestinationsPage() {
  const spots = getAllSpots();
  const categories = getAllCategories();
  const prefectures = getPopulatedPrefectures();

  const [prefFilter, setPrefFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let r = spots;
    if (prefFilter) r = r.filter((s) => s.prefectureId === prefFilter);
    if (catFilter) r = r.filter((s) => s.category === catFilter);
    if (q) {
      const lower = q.toLowerCase();
      r = r.filter(
        (s) =>
          s.title.includes(q) ||
          s.description.includes(q) ||
          s.location.includes(q) ||
          s.tags.some((t) => t.includes(lower)) ||
          s.area.includes(q)
      );
    }
    return r;
  }, [spots, prefFilter, catFilter, q]);

  return (
    <div className="pt-[80px] pb-[120px]">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[6px]">
            Destinations
          </p>
          <h1 className="serif text-[36px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.1] mb-[32px]">
            観光地
          </h1>
        </motion.div>

        {/* Search */}
        <input
          type="text"
          placeholder="地名・キーワードで探す..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full max-w-[360px] bg-white border border-g2 rounded-[6px] px-[14px] py-[9px] text-[13px] focus:outline-none focus:border-accent mb-[20px]"
        />

        {/* Filters */}
        <div className="space-y-[12px] mb-[40px]">
          <FilterBar
            label="都道府県"
            items={[
              { value: "", label: "すべて" },
              ...prefectures.map((p) => ({ value: p.id, label: p.name })),
            ]}
            selected={prefFilter}
            onSelect={setPrefFilter}
          />
          <FilterBar
            label="カテゴリ"
            items={[
              { value: "", label: "すべて" },
              ...categories.map((c) => ({
                value: c,
                label: SPOT_CATEGORY_LABEL[c],
              })),
            ]}
            selected={catFilter}
            onSelect={setCatFilter}
          />
        </div>

        <p className="mono text-[11px] text-g3 mb-[28px]">
          {filtered.length} spots
        </p>

        {/* Spot layout */}
        <div className="space-y-[48px]">
          {/* Hero: first spot */}
          {filtered[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <SpotCardHero spot={filtered[0]} />
            </motion.div>
          )}

          {/* Asymmetric medium: next 2 */}
          {filtered.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-[14px]">
              {filtered.slice(1, 3).map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className={i === 0 ? "md:row-span-2" : ""}
                >
                  <SpotCardMedium
                    spot={s}
                    aspect={i === 0 ? "3/4" : "4/3"}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* List: the rest */}
          {filtered.length > 3 && (
            <div className="border-t border-g1">
              {filtered.slice(3).map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <SpotCardList spot={s} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
