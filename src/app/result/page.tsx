"use client";

import { useState } from "react";
import Link from "next/link";
import { generateProposal } from "@/lib/travelLogic";
import { getDestinationById, getArticleById } from "@/lib/contentLoader";
import { TravelDiagnosis, TravelProposal } from "@/types/itinerary";
import { Area } from "@/types/destination";
import { AREA_LIST } from "@/lib/helpers";

const RELATIONSHIPS = ["カップル", "友達", "家族", "一人", "夫婦", "同僚"] as const;
const EXPERIENCE_TYPES = ["のんびり", "アクティブ", "バランス", "グルメ中心", "観光中心"] as const;
const INTEREST_OPTIONS = [
  "温泉", "自然", "歴史", "グルメ", "アート", "アクティビティ",
  "街歩き", "絶景", "神社仏閣", "リゾート", "写真映え", "ローカル体験",
];

export default function ResultPage() {
  const [step, setStep] = useState(0);
  const [diagnosis, setDiagnosis] = useState<Partial<TravelDiagnosis>>({
    travelers: 2,
    interests: [],
  });
  const [proposal, setProposal] = useState<TravelProposal | null>(null);

  const toggleInterest = (interest: string) => {
    const current = diagnosis.interests || [];
    if (current.includes(interest)) {
      setDiagnosis({ ...diagnosis, interests: current.filter((i) => i !== interest) });
    } else {
      setDiagnosis({ ...diagnosis, interests: [...current, interest] });
    }
  };

  const handleSubmit = () => {
    const full: TravelDiagnosis = {
      dateRange: diagnosis.dateRange || { start: "", end: "" },
      travelers: diagnosis.travelers || 2,
      relationship: diagnosis.relationship || "カップル",
      interests: diagnosis.interests || [],
      experienceType: diagnosis.experienceType || "バランス",
      budget: diagnosis.budget,
      area: diagnosis.area,
    };
    const result = generateProposal(full);
    setProposal(result);
    setStep(99);
  };

  // Step definitions
  const steps = [
    // Step 0: 関係性
    <div key="rel" className="text-center">
      <p className="text-accent text-sm font-medium mb-2">STEP 1 / 4</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-3">誰と行く？</h2>
      <p className="text-muted mb-10">旅の相手で、刺さる場所が変わる。</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
        {RELATIONSHIPS.map((rel) => (
          <button
            key={rel}
            onClick={() => {
              setDiagnosis({ ...diagnosis, relationship: rel });
              setStep(1);
            }}
            className={`py-5 rounded-xl text-base font-medium transition-all ${
              diagnosis.relationship === rel
                ? "bg-foreground text-background scale-105"
                : "bg-surface hover:bg-border"
            }`}
          >
            {rel}
          </button>
        ))}
      </div>
    </div>,

    // Step 1: 体験タイプ
    <div key="exp" className="text-center">
      <p className="text-accent text-sm font-medium mb-2">STEP 2 / 4</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-3">どんな旅がしたい？</h2>
      <p className="text-muted mb-10">気分で選んでいい。</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        {EXPERIENCE_TYPES.map((exp) => {
          const descs: Record<string, string> = {
            のんびり: "温泉、カフェ、ぼーっとする時間。",
            アクティブ: "体を動かす。自然の中へ。",
            バランス: "観光もグルメもちょうどよく。",
            グルメ中心: "食べることが旅の目的。",
            観光中心: "名所を効率よく回りたい。",
          };
          return (
            <button
              key={exp}
              onClick={() => {
                setDiagnosis({ ...diagnosis, experienceType: exp });
                setStep(2);
              }}
              className={`p-5 rounded-xl text-left transition-all ${
                diagnosis.experienceType === exp
                  ? "bg-foreground text-background scale-[1.02]"
                  : "bg-surface hover:bg-border"
              }`}
            >
              <p className="font-bold text-base mb-1">{exp}</p>
              <p className={`text-sm ${diagnosis.experienceType === exp ? "text-background/60" : "text-muted"}`}>
                {descs[exp]}
              </p>
            </button>
          );
        })}
      </div>
    </div>,

    // Step 2: 興味
    <div key="int" className="text-center">
      <p className="text-accent text-sm font-medium mb-2">STEP 3 / 4</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-3">気になるのは？</h2>
      <p className="text-muted mb-10">複数選べる。直感でいい。</p>
      <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto mb-10">
        {INTEREST_OPTIONS.map((interest) => {
          const selected = (diagnosis.interests || []).includes(interest);
          return (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selected
                  ? "bg-foreground text-background scale-105"
                  : "bg-surface hover:bg-border text-muted"
              }`}
            >
              {interest}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => setStep(3)}
        disabled={(diagnosis.interests || []).length === 0}
        className="bg-accent text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        次へ
      </button>
    </div>,

    // Step 3: エリア（任意）+ 実行
    <div key="area" className="text-center">
      <p className="text-accent text-sm font-medium mb-2">STEP 4 / 4</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-3">行きたいエリアは？</h2>
      <p className="text-muted mb-10">決まってなければ「おまかせ」でOK。</p>
      <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto mb-10">
        <button
          onClick={() => setDiagnosis({ ...diagnosis, area: undefined })}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            !diagnosis.area
              ? "bg-foreground text-background"
              : "bg-surface hover:bg-border text-muted"
          }`}
        >
          おまかせ
        </button>
        {AREA_LIST.map((area) => (
          <button
            key={area}
            onClick={() => setDiagnosis({ ...diagnosis, area: area as Area })}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              diagnosis.area === area
                ? "bg-foreground text-background"
                : "bg-surface hover:bg-border text-muted"
            }`}
          >
            {area}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-accent text-white px-10 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
      >
        この条件で提案してもらう
      </button>
    </div>,
  ];

  // Result view
  if (step === 99 && proposal) {
    const mainDest = getDestinationById(proposal.main.destination);
    const alts = proposal.alternatives.map((a) => ({
      ...a,
      dest: getDestinationById(a.destination),
    }));
    const relArticles = proposal.relatedArticleIds
      .map((id) => getArticleById(id))
      .filter((a) => a !== undefined);

    return (
      <div>
        {/* メイン提案 - 大きく */}
        <section className="bg-foreground text-background">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <p className="text-accent-light text-sm font-medium mb-4">YOUR BEST MATCH</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {mainDest?.name || "提案"}
            </h1>
            <p className="text-lg md:text-xl text-background/60 max-w-2xl leading-relaxed mb-6">
              {proposal.main.story}
            </p>
            {mainDest && (
              <div className="flex flex-wrap gap-4 mb-8">
                {mainDest.category.map((c) => (
                  <span key={c} className="text-sm bg-background/10 px-4 py-1.5 rounded-full">
                    {c}
                  </span>
                ))}
                <span className="text-sm text-background/50">{mainDest.budgetRange}</span>
                <span className="text-sm text-background/50">{mainDest.stayDuration[0]}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {proposal.main.highlights.map((h) => (
                <span key={h} className="text-sm bg-background/10 px-4 py-2 rounded-full text-background/70">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* モデルコース */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">この旅はこう回るのが気持ちいい</h2>
            <div className="space-y-8">
              {proposal.main.itinerary.map((day) => (
                <div key={day.dayNumber}>
                  <h3 className="text-lg font-bold mb-4 text-accent">
                    Day {day.dayNumber}
                  </h3>
                  <div className="relative pl-8 border-l-2 border-border space-y-4">
                    {day.spots.map((spot, si) => (
                      <div key={si} className="relative">
                        <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-accent border-2 border-background" />
                        <div className="bg-surface rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-bold text-accent">{spot.time}</span>
                            {spot.category && (
                              <span className="text-xs bg-background px-2 py-0.5 rounded text-muted">
                                {spot.category}
                              </span>
                            )}
                          </div>
                          <p className="font-medium">{spot.name}</p>
                          {spot.duration && (
                            <p className="text-xs text-muted mt-1">所要時間: {spot.duration}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 比較表 */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">比較して選ぶ</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 text-muted font-medium"></th>
                    <th className="text-left py-3 px-4 font-bold text-accent">
                      {mainDest?.name}
                      <span className="block text-xs font-normal text-muted">おすすめ</span>
                    </th>
                    {alts.map((a, i) => (
                      <th key={i} className="text-left py-3 px-4 font-medium">
                        {a.dest?.name || "—"}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {proposal.comparison.map((row) => (
                    <tr key={row.label} className="border-b border-border/50">
                      <td className="py-3 pr-4 text-muted">{row.label}</td>
                      <td className="py-3 px-4 font-medium">{row.main}</td>
                      <td className="py-3 px-4 text-muted">{row.alt1}</td>
                      <td className="py-3 px-4 text-muted">{row.alt2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* サブ提案 */}
          {alts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8">こっちもアリ</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {alts.map(
                  (alt, i) =>
                    alt.dest && (
                      <Link
                        key={i}
                        href={`/destinations/${alt.dest.id}`}
                        className="group bg-surface rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow"
                      >
                        <p className="text-xs text-muted mb-2">
                          {alt.dest.area} / {alt.dest.prefecture}
                        </p>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {alt.dest.name}
                        </h3>
                        <p className="text-sm text-muted leading-relaxed mb-3">{alt.story.slice(0, 120)}...</p>
                        <p className="text-sm text-accent">{alt.reason}</p>
                      </Link>
                    )
                )}
              </div>
            </section>
          )}

          {/* 関連記事 */}
          {relArticles.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8">もっと深く知る</h2>
              <div className="space-y-4">
                {relArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group block bg-surface rounded-xl p-6 hover:bg-border/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted mt-2">{article.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTAs */}
          <section className="flex flex-wrap gap-4 justify-center py-10 border-t border-border">
            <Link
              href={`/itinerary?from=${proposal.main.destination}`}
              className="bg-accent text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              この旅のしおりを作る
            </Link>
            <button
              onClick={() => { setStep(0); setProposal(null); }}
              className="bg-surface px-8 py-3 rounded-full font-medium hover:bg-border transition-colors"
            >
              条件を変えてもう一度
            </button>
          </section>
        </div>
      </div>
    );
  }

  // Diagnosis steps
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 min-h-[70vh] flex flex-col justify-center">
      {/* Progress */}
      <div className="flex justify-center gap-2 mb-12">
        {[0, 1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all ${
              s <= step ? "bg-accent w-12" : "bg-border w-8"
            }`}
          />
        ))}
      </div>

      {steps[step]}

      {/* Back button */}
      {step > 0 && step < 99 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setStep(step - 1)}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            ← 戻る
          </button>
        </div>
      )}
    </div>
  );
}
