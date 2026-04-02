"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getAllSpots,
  getSpotsByPrefecture,
  getSpotsByTag,
  getAllArticles,
  getPrefectureById,
} from "@/lib/contentLoader";
import { useItinerary } from "@/store/itinerary";
import type { Spot } from "@/types/spot";
import type { TravelerInfo } from "@/types/itinerary";

/* ── helpers ──────────────────────────────────── */

const TRAVELER_LABELS: Record<TravelerInfo["type"], string> = {
  solo: "ひとり旅", couple: "ふたり旅", family: "家族旅行", friends: "友達旅", group: "グループ旅",
};

const PACE_LABELS: Record<string, string> = {
  relaxed: "ゆったり", moderate: "ふつう", packed: "がっつり",
};

const BUDGET_LABELS: Record<string, string> = {
  budget: "節約", moderate: "ふつう", luxury: "贅沢",
};

function parseParams(sp: URLSearchParams) {
  const raw = sp.get("travelers") || "couple:2";
  const [type, countStr] = raw.split(":");
  const travelers: TravelerInfo = {
    type: (type as TravelerInfo["type"]) || "couple",
    count: parseInt(countStr) || 2,
  };
  const prefectures = (sp.get("prefectures") || "").split(",").filter(Boolean);
  const days = parseInt(sp.get("days") || "2") || 2;
  const interests = (sp.get("interests") || "").split(",").filter(Boolean);
  const pace = sp.get("pace") || "moderate";
  const budget = sp.get("budget") || "moderate";
  return { travelers, prefectures, days, interests, pace, budget };
}

function scoreSpot(spot: Spot, interests: string[]): number {
  return spot.tags.filter((t) => interests.includes(t)).length;
}

function buildStoryText(
  prefNames: string[],
  interests: string[],
  travelers: TravelerInfo,
  pace: string,
): string {
  const area = prefNames.length > 0 ? prefNames.join("と") : "近畿";
  const theme = interests.slice(0, 3).join("、");
  const style = TRAVELER_LABELS[travelers.type] || "旅";
  const paceLabel = PACE_LABELS[pace] || "ふつう";
  return `${area}を巡る${style}。${theme}を軸に、${paceLabel}ペースで回れるスポットを選びました。あなたの旅に合う場所が、きっと見つかるはず。`;
}

/* ── inner component (uses useSearchParams) ──── */

function ResultContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const itinerary = useItinerary();
  const { travelers, prefectures, days, interests, pace, budget } = parseParams(sp);

  /* collect & score spots */
  const { picked, dayPlan } = useMemo(() => {
    const prefSpots = prefectures.length > 0
      ? [...new Map(prefectures.flatMap((pid) => getSpotsByPrefecture(pid)).map((s) => [s.id, s])).values()]
      : getAllSpots();

    const tagSpots = interests.length > 0
      ? [...new Map(interests.flatMap((tag) => getSpotsByTag(tag)).map((s) => [s.id, s])).values()]
      : [];

    const merged = new Map<string, Spot>();
    for (const s of prefSpots) merged.set(s.id, s);
    for (const s of tagSpots) merged.set(s.id, s);

    const scored = [...merged.values()]
      .map((s) => ({ spot: s, score: scoreSpot(s, interests) }))
      .sort((a, b) => b.score - a.score);

    const maxSpots = Math.min(scored.length, Math.max(3, days * 2));
    const picked = scored.slice(0, maxSpots).map((x) => x.spot);

    /* day plan */
    const spotsPerDay = Math.max(1, Math.ceil(picked.length / days));
    const dayPlan: { day: number; spots: Spot[] }[] = [];
    for (let d = 0; d < days; d++) {
      const chunk = picked.slice(d * spotsPerDay, (d + 1) * spotsPerDay);
      if (chunk.length > 0) dayPlan.push({ day: d + 1, spots: chunk });
    }

    return { picked, dayPlan };
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  }, [prefectures, interests, days]);

  const prefNames = prefectures.map((pid) => getPrefectureById(pid)?.name || pid);
  const storyText = buildStoryText(prefNames, interests, travelers, pace);
  const articles = getAllArticles().slice(0, 3);

  const handleCreateItinerary = () => {
    itinerary.reset();
    itinerary.setTravelers(travelers);

    if (picked.length > 0) {
      itinerary.initFrom(`${prefNames[0] || "近畿"}の旅`, {
        spotId: picked[0].id,
        name: picked[0].title,
        time: "10:00",
        type: "sightseeing",
      });
    }

    for (let di = 0; di < dayPlan.length; di++) {
      if (di > 0) itinerary.addDay();
      const spots = di === 0 ? dayPlan[di].spots.slice(1) : dayPlan[di].spots;
      for (const spot of spots) {
        itinerary.addSpot(di, {
          spotId: spot.id,
          name: spot.title,
          time: "10:00",
          type: "sightseeing",
        });
      }
    }

    router.push("/itinerary");
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-[800px] mx-auto px-[20px] md:px-[48px]">

        {/* ═══ 1. heading ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-[120px] mb-[48px]"
        >
          <p className="mono text-[10px] tracking-[0.2em] uppercase text-g4 mb-[10px]">Your Trip</p>
          <h1 className="serif text-[40px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.1] mb-[12px]">
            あなたの旅
          </h1>
          <div className="flex flex-wrap gap-[8px] mb-[16px]">
            <span className="mono text-[10px] bg-accent/[0.08] text-accent px-[10px] py-[3px] rounded-full">
              {TRAVELER_LABELS[travelers.type]} {travelers.count > 1 ? `${travelers.count}人` : ""}
            </span>
            <span className="mono text-[10px] bg-gold/[0.08] text-gold px-[10px] py-[3px] rounded-full">
              {days}日間
            </span>
            <span className="mono text-[10px] bg-g1 text-g5 px-[10px] py-[3px] rounded-full">
              {PACE_LABELS[pace]}
            </span>
            <span className="mono text-[10px] bg-g1 text-g5 px-[10px] py-[3px] rounded-full">
              {BUDGET_LABELS[budget]}
            </span>
          </div>
          <p className="text-[14px] text-g5 leading-[1.9] max-w-[520px]">
            {storyText}
          </p>
        </motion.div>

        {/* ═══ 2. spot cards ═══ */}
        {picked.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-[64px]"
          >
            <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[14px]">Recommended Spots</p>

            {/* hero card */}
            <Link
              href={`/destinations/${picked[0].id}`}
              className="group block relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40 mb-[12px]"
              style={{ aspectRatio: "21/9" }}
            >
              <Image
                src={picked[0].images[0]}
                alt={picked[0].title}
                fill
                className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
                sizes="90vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-[20px] md:p-[36px] z-10 max-w-[400px]">
                <p className="mono text-[10px] text-white/40 tracking-wider uppercase mb-[4px]">
                  {picked[0].area} / {picked[0].prefecture}
                </p>
                <h2 className="serif text-[22px] md:text-[32px] text-white font-bold leading-[1.15] group-hover:text-gold transition-colors">
                  {picked[0].title}
                </h2>
                <p className="text-[12px] text-white/35 mt-[6px] line-clamp-2">
                  {picked[0].description}
                </p>
              </div>
            </Link>

            {/* smaller cards */}
            <div className="grid grid-cols-2 gap-[10px]">
              {picked.slice(1, 5).map((spot, i) => (
                <motion.div
                  key={spot.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                >
                  <Link
                    href={`/destinations/${spot.id}`}
                    className="group block relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <Image
                      src={spot.images[0]}
                      alt={spot.title}
                      fill
                      className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]"
                      sizes="45vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-0 p-[14px] z-10">
                      <p className="mono text-[9px] text-white/40 mb-[2px]">{spot.area}</p>
                      <p className="serif text-[14px] md:text-[16px] text-white font-bold leading-[1.2]">
                        {spot.title}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ═══ 3. day plan ═══ */}
        {dayPlan.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-[72px]"
          >
            <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[14px]">Day Plan</p>
            <div className="border-l-[2px] border-g2 ml-[8px]">
              {dayPlan.map((dp) => (
                <div key={dp.day} className="pl-[24px] pb-[28px] relative">
                  <div className="absolute left-[-6px] top-[2px] w-[10px] h-[10px] rounded-full bg-accent" />
                  <p className="mono text-[11px] text-accent font-bold mb-[6px]">Day {dp.day}</p>
                  <div className="flex flex-wrap items-center gap-[4px]">
                    {dp.spots.map((spot, si) => (
                      <span key={spot.id} className="text-[13px] text-ink">
                        {si > 0 && <span className="text-g3 mx-[6px]">→</span>}
                        <Link href={`/destinations/${spot.id}`} className="hover:text-accent transition-colors">
                          {spot.title}
                        </Link>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ═══ 4. related articles ═══ */}
        {articles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-[72px]"
          >
            <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[14px]">Related Articles</p>
            <div className="border-t border-g1">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group flex items-center gap-[16px] py-[16px] border-b border-g1/60 hover:bg-white/40 transition-colors"
                >
                  <div className="w-[56px] h-[56px] rounded-[6px] overflow-hidden shrink-0 relative outline outline-1 outline-g2/30">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="mono text-[9px] text-g3 mb-[1px]">{article.category}</p>
                    <p className="serif text-[14px] font-bold group-hover:text-accent transition-colors truncate">
                      {article.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* ═══ 5. CTAs ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="pb-[120px]"
        >
          <div className="flex flex-col gap-[12px]">
            <button
              onClick={handleCreateItinerary}
              className="w-full bg-gold text-white py-[16px] rounded-full serif text-[15px] font-bold hover:bg-[#a68840] transition-colors active:scale-[0.98]"
            >
              このしおりを作る
            </button>
            <Link
              href="/create"
              className="w-full block text-center border border-g2 text-g5 py-[14px] rounded-full mono text-[12px] hover:border-accent hover:text-accent transition-colors"
            >
              条件を変える
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── page (Suspense wrapper) ─────────────────── */

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <p className="mono text-[12px] text-g4">Loading...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
