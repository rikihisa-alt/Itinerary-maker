"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTripCreation } from "@/store/tripCreation";
import { getKinkiPrefectures } from "@/lib/contentLoader";
import { TravelerInfo } from "@/types/itinerary";

/* ── constants ────────────────────────────────── */

const TRAVELER_OPTIONS: { type: TravelerInfo["type"]; label: string; sub: string; defaultCount: number }[] = [
  { type: "solo",    label: "ひとり旅",     sub: "Solo",    defaultCount: 1 },
  { type: "couple",  label: "ふたり旅",     sub: "Couple",  defaultCount: 2 },
  { type: "family",  label: "家族旅行",     sub: "Family",  defaultCount: 4 },
  { type: "friends", label: "友達と",       sub: "Friends", defaultCount: 3 },
  { type: "group",   label: "グループ",     sub: "Group",   defaultCount: 6 },
];

const INTEREST_TAGS = [
  "神社", "グルメ", "温泉", "自然", "写真映え", "街歩き",
  "カフェ", "歴史", "ビーチ", "一人旅", "カップル", "家族",
];

const PACE_OPTIONS: { value: "relaxed" | "moderate" | "packed"; label: string; sub: string }[] = [
  { value: "relaxed",  label: "ゆったり", sub: "Relaxed" },
  { value: "moderate", label: "ふつう",   sub: "Moderate" },
  { value: "packed",   label: "がっつり", sub: "Packed" },
];

const BUDGET_OPTIONS: { value: "budget" | "moderate" | "luxury"; label: string; sub: string }[] = [
  { value: "budget",   label: "節約",   sub: "Budget" },
  { value: "moderate", label: "ふつう", sub: "Moderate" },
  { value: "luxury",   label: "贅沢",   sub: "Luxury" },
];

const STEP_COUNT = 5;

/* ── motion variants ──────────────────────────── */

const stepVariants = {
  enter:  { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit:   { opacity: 0, x: -60 },
};

/* ── page ─────────────────────────────────────── */

export default function CreatePage() {
  const router = useRouter();
  const s = useTripCreation();
  const kinkiPrefs = getKinkiPrefectures();

  const canAdvance = useCallback(() => {
    if (s.step === 0) return true;
    if (s.step === 1) return s.prefectureIds.length > 0;
    if (s.step === 2) return s.days >= 1;
    if (s.step === 3) return s.interests.length > 0;
    return true;
  }, [s.step, s.prefectureIds, s.days, s.interests]);

  const next = () => { if (canAdvance() && s.step < STEP_COUNT - 1) s.setStep(s.step + 1); };
  const back = () => { if (s.step > 0) s.setStep(s.step - 1); };

  const submit = () => {
    const params = new URLSearchParams();
    params.set("travelers", `${s.travelers.type}:${s.travelers.count}`);
    params.set("prefectures", s.prefectureIds.join(","));
    params.set("days", String(s.days));
    params.set("interests", s.interests.join(","));
    params.set("pace", s.pace);
    params.set("budget", s.budget);
    router.push(`/result?${params.toString()}`);
  };

  const progress = ((s.step + 1) / STEP_COUNT) * 100;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* ── progress bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-g1">
        <motion.div
          className="h-full bg-gold"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="max-w-[640px] w-full mx-auto px-[20px] md:px-[36px] flex-1 flex flex-col justify-center items-center">
        {/* ── back button ── */}
        {s.step > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={back}
            className="fixed top-[20px] left-[20px] z-50 mono text-[11px] text-g4 hover:text-accent transition-colors"
          >
            ← 戻る
          </motion.button>
        )}

        <AnimatePresence mode="wait">
          {/* ═══ Step 0: Who? ═══ */}
          {s.step === 0 && (
            <motion.div
              key="step0"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="py-[40px] text-center w-full"
            >
              <p className="mono text-[10px] tracking-[0.2em] uppercase text-g4 mb-[12px]">Step 1 / {STEP_COUNT}</p>
              <h1 className="serif text-[40px] font-bold tracking-[-0.03em] leading-[1.15] mb-[8px]">
                誰と行く？
              </h1>
              <p className="text-[13px] text-g5 leading-[1.8] mb-[40px]">
                旅のスタイルに合わせて、最適なプランを提案します。
              </p>

              <div className="grid grid-cols-2 gap-[10px] mb-[32px]">
                {TRAVELER_OPTIONS.map((opt) => {
                  const active = s.travelers.type === opt.type;
                  return (
                    <button
                      key={opt.type}
                      onClick={() => s.setTravelers({ type: opt.type, count: opt.defaultCount })}
                      className={`text-center rounded-[8px] border p-[18px] transition-all duration-200 ${
                        active
                          ? "border-accent bg-accent/[0.04]"
                          : "border-g2/60 hover:border-g3"
                      }`}
                    >
                      <p className={`serif text-[16px] font-bold ${active ? "text-accent" : "text-ink"}`}>
                        {opt.label}
                      </p>
                      <p className="mono text-[10px] text-g4 mt-[2px]">{opt.sub}</p>
                    </button>
                  );
                })}
              </div>

              {/* count adjuster */}
              {s.travelers.type !== "solo" && (
                <div className="flex items-center justify-center gap-[16px] mb-[48px]">
                  <p className="mono text-[11px] text-g4">人数</p>
                  <button
                    onClick={() => s.setTravelers({ ...s.travelers, count: Math.max(2, s.travelers.count - 1) })}
                    className="w-[32px] h-[32px] rounded-full border border-g2 text-[14px] text-g5 hover:border-accent hover:text-accent transition-colors"
                  >
                    -
                  </button>
                  <span className="mono text-[18px] font-bold text-accent w-[28px] text-center">
                    {s.travelers.count}
                  </span>
                  <button
                    onClick={() => s.setTravelers({ ...s.travelers, count: Math.min(20, s.travelers.count + 1) })}
                    className="w-[32px] h-[32px] rounded-full border border-g2 text-[14px] text-g5 hover:border-accent hover:text-accent transition-colors"
                  >
                    +
                  </button>
                </div>
              )}

              <button onClick={next} className="mono text-[12px] text-accent border border-accent/30 px-[24px] py-[10px] rounded-full hover:bg-accent/[0.04] transition-colors">
                次へ →
              </button>
            </motion.div>
          )}

          {/* ═══ Step 1: Where? ═══ */}
          {s.step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="py-[40px] text-center w-full"
            >
              <p className="mono text-[10px] tracking-[0.2em] uppercase text-g4 mb-[12px]">Step 2 / {STEP_COUNT}</p>
              <h1 className="serif text-[40px] font-bold tracking-[-0.03em] leading-[1.15] mb-[8px]">
                どこへ行く？
              </h1>
              <p className="text-[13px] text-g5 leading-[1.8] mb-[40px]">
                近畿エリアから、行きたい場所を選んでください。複数選択できます。
              </p>

              <div className="grid grid-cols-2 gap-[10px] mb-[48px]">
                {kinkiPrefs.map((pref) => {
                  const active = s.prefectureIds.includes(pref.id);
                  return (
                    <button
                      key={pref.id}
                      onClick={() => s.togglePrefecture(pref.id)}
                      className={`text-center rounded-[8px] border p-[18px] transition-all duration-200 ${
                        active
                          ? "border-accent bg-accent/[0.04]"
                          : "border-g2/60 hover:border-g3"
                      }`}
                    >
                      <p className={`serif text-[16px] font-bold ${active ? "text-accent" : "text-ink"}`}>
                        {pref.name}
                      </p>
                      <p className="mono text-[10px] text-g4 mt-[2px]">{pref.nameEn}</p>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={next}
                disabled={!canAdvance()}
                className={`mono text-[12px] border px-[24px] py-[10px] rounded-full transition-colors ${
                  canAdvance()
                    ? "text-accent border-accent/30 hover:bg-accent/[0.04]"
                    : "text-g3 border-g2 cursor-not-allowed"
                }`}
              >
                次へ →
              </button>
            </motion.div>
          )}

          {/* ═══ Step 2: How many days? ═══ */}
          {s.step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="py-[40px] text-center w-full"
            >
              <p className="mono text-[10px] tracking-[0.2em] uppercase text-g4 mb-[12px]">Step 3 / {STEP_COUNT}</p>
              <h1 className="serif text-[40px] font-bold tracking-[-0.03em] leading-[1.15] mb-[8px]">
                何日間？
              </h1>
              <p className="text-[13px] text-g5 leading-[1.8] mb-[40px]">
                旅の日数を選んでください。
              </p>

              <div className="flex flex-wrap gap-[10px] mb-[48px]">
                {Array.from({ length: 7 }, (_, i) => i + 1).map((d) => {
                  const active = s.days === d;
                  return (
                    <button
                      key={d}
                      onClick={() => s.setDays(d)}
                      className={`w-[56px] h-[56px] rounded-[8px] border text-center transition-all duration-200 ${
                        active
                          ? "border-accent bg-accent text-white"
                          : "border-g2/60 hover:border-g3 text-ink"
                      }`}
                    >
                      <span className="mono text-[18px] font-bold">{d}</span>
                      <span className="block mono text-[9px] mt-[-2px] opacity-60">
                        {d === 1 ? "day" : "days"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button onClick={next} className="mono text-[12px] text-accent border border-accent/30 px-[24px] py-[10px] rounded-full hover:bg-accent/[0.04] transition-colors">
                次へ →
              </button>
            </motion.div>
          )}

          {/* ═══ Step 3: Interests ═══ */}
          {s.step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="py-[40px] text-center w-full"
            >
              <p className="mono text-[10px] tracking-[0.2em] uppercase text-g4 mb-[12px]">Step 4 / {STEP_COUNT}</p>
              <h1 className="serif text-[40px] font-bold tracking-[-0.03em] leading-[1.15] mb-[8px]">
                どんな旅にしたい？
              </h1>
              <p className="text-[13px] text-g5 leading-[1.8] mb-[40px]">
                興味のあるテーマを選んでください。複数選択できます。
              </p>

              <div className="flex flex-wrap gap-[8px] mb-[48px]">
                {INTEREST_TAGS.map((tag) => {
                  const active = s.interests.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => s.toggleInterest(tag)}
                      className={`px-[16px] py-[8px] rounded-full border text-[13px] transition-all duration-200 ${
                        active
                          ? "border-accent bg-accent text-white"
                          : "border-g2/60 text-g5 hover:border-g3"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={next}
                disabled={!canAdvance()}
                className={`mono text-[12px] border px-[24px] py-[10px] rounded-full transition-colors ${
                  canAdvance()
                    ? "text-accent border-accent/30 hover:bg-accent/[0.04]"
                    : "text-g3 border-g2 cursor-not-allowed"
                }`}
              >
                次へ →
              </button>
            </motion.div>
          )}

          {/* ═══ Step 4: Pace + Budget ═══ */}
          {s.step === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="pt-[120px] pb-[80px]"
            >
              <p className="mono text-[10px] tracking-[0.2em] uppercase text-g4 mb-[12px]">Step 5 / {STEP_COUNT}</p>
              <h1 className="serif text-[40px] font-bold tracking-[-0.03em] leading-[1.15] mb-[8px]">
                旅のペースと予算
              </h1>
              <p className="text-[13px] text-g5 leading-[1.8] mb-[44px]">
                どのくらいのペースで回りたいですか？
              </p>

              {/* pace */}
              <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[10px]">Pace</p>
              <div className="grid grid-cols-3 gap-[10px] mb-[36px]">
                {PACE_OPTIONS.map((opt) => {
                  const active = s.pace === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => s.setPace(opt.value)}
                      className={`rounded-[8px] border p-[14px] text-center transition-all duration-200 ${
                        active
                          ? "border-accent bg-accent/[0.04]"
                          : "border-g2/60 hover:border-g3"
                      }`}
                    >
                      <p className={`serif text-[15px] font-bold ${active ? "text-accent" : "text-ink"}`}>
                        {opt.label}
                      </p>
                      <p className="mono text-[9px] text-g4 mt-[2px]">{opt.sub}</p>
                    </button>
                  );
                })}
              </div>

              {/* budget */}
              <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[10px]">Budget</p>
              <div className="grid grid-cols-3 gap-[10px] mb-[56px]">
                {BUDGET_OPTIONS.map((opt) => {
                  const active = s.budget === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => s.setBudget(opt.value)}
                      className={`rounded-[8px] border p-[14px] text-center transition-all duration-200 ${
                        active
                          ? "border-gold bg-gold/[0.04]"
                          : "border-g2/60 hover:border-g3"
                      }`}
                    >
                      <p className={`serif text-[15px] font-bold ${active ? "text-gold" : "text-ink"}`}>
                        {opt.label}
                      </p>
                      <p className="mono text-[9px] text-g4 mt-[2px]">{opt.sub}</p>
                    </button>
                  );
                })}
              </div>

              {/* submit CTA */}
              <button
                onClick={submit}
                className="w-full bg-gold text-white py-[16px] rounded-full serif text-[15px] font-bold hover:bg-[#a68840] transition-colors active:scale-[0.98]"
              >
                この条件でしおりを作る
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
