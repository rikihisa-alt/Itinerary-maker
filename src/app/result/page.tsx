"use client";

import { useState } from "react";
import Link from "next/link";
import { generateProposal } from "@/lib/travelLogic";
import { getDestinationById, getArticleById } from "@/lib/contentLoader";
import { TravelDiagnosis, TravelProposal } from "@/types/itinerary";
import { Area } from "@/types/destination";
import { AREA_LIST } from "@/lib/helpers";

const RELATIONSHIPS = [
  { value: "カップル" as const, emoji: "💑", desc: "二人の距離が縮まる旅" },
  { value: "友達" as const, emoji: "👯", desc: "笑いが止まらない旅" },
  { value: "家族" as const, emoji: "👨‍👩‍👧", desc: "みんなが笑顔になる旅" },
  { value: "一人" as const, emoji: "🧳", desc: "自分だけの時間に浸る旅" },
  { value: "夫婦" as const, emoji: "👫", desc: "日常を離れる旅" },
  { value: "同僚" as const, emoji: "🤝", desc: "気兼ねなく楽しむ旅" },
];

const EXPERIENCE_TYPES = [
  { value: "のんびり" as const, emoji: "🌿", desc: "温泉、カフェ、ぼーっとする時間。" },
  { value: "アクティブ" as const, emoji: "🏔", desc: "体を動かす。自然の中へ。" },
  { value: "バランス" as const, emoji: "⚖️", desc: "観光もグルメもちょうどよく。" },
  { value: "グルメ中心" as const, emoji: "🍽", desc: "食べることが旅の目的。" },
  { value: "観光中心" as const, emoji: "📸", desc: "名所を自分の目で見たい。" },
];

const INTEREST_OPTIONS = [
  { label: "温泉", emoji: "♨️" }, { label: "自然", emoji: "🌳" },
  { label: "歴史", emoji: "🏯" }, { label: "グルメ", emoji: "🍜" },
  { label: "アート", emoji: "🎨" }, { label: "アクティビティ", emoji: "🚴" },
  { label: "街歩き", emoji: "🚶" }, { label: "絶景", emoji: "🌅" },
  { label: "神社仏閣", emoji: "⛩" }, { label: "リゾート", emoji: "🏖" },
  { label: "写真映え", emoji: "📷" }, { label: "ローカル体験", emoji: "🎎" },
];

export default function ResultPage() {
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Partial<TravelDiagnosis>>({
    travelers: 2,
    interests: [],
  });
  const [proposal, setProposal] = useState<TravelProposal | null>(null);

  const goNext = (nextStep: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setTransitioning(false);
    }, 200);
  };

  const toggleInterest = (interest: string) => {
    const current = diagnosis.interests || [];
    if (current.includes(interest)) {
      setDiagnosis({ ...diagnosis, interests: current.filter((i) => i !== interest) });
    } else {
      setDiagnosis({ ...diagnosis, interests: [...current, interest] });
    }
  };

  const handleSubmit = () => {
    setTransitioning(true);
    setTimeout(() => {
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
      setTransitioning(false);
    }, 600);
  };

  const steps = [
    // Step 0: 関係性
    <div key="rel" className="text-center animate-fade-up">
      <p className="text-accent text-xs font-medium tracking-[0.15em] uppercase mb-6">Step 1 of 4</p>
      <h2 className="text-3xl md:text-5xl font-bold mb-3">誰と行く？</h2>
      <p className="text-muted mb-12">旅の相手で、刺さる場所が変わる。</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
        {RELATIONSHIPS.map((rel) => (
          <button
            key={rel.value}
            onClick={() => {
              setDiagnosis({ ...diagnosis, relationship: rel.value });
              goNext(1);
            }}
            className={`group py-6 px-4 rounded-2xl text-left transition-all hover:scale-[1.03] ${
              diagnosis.relationship === rel.value
                ? "bg-foreground text-background shadow-lg"
                : "bg-surface hover:bg-border/70"
            }`}
          >
            <span className="text-2xl block mb-2">{rel.emoji}</span>
            <span className="font-bold text-sm block">{rel.value}</span>
            <span className={`text-xs block mt-1 ${
              diagnosis.relationship === rel.value ? "text-background/50" : "text-muted"
            }`}>{rel.desc}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 1: 体験タイプ
    <div key="exp" className="text-center animate-fade-up">
      <p className="text-accent text-xs font-medium tracking-[0.15em] uppercase mb-6">Step 2 of 4</p>
      <h2 className="text-3xl md:text-5xl font-bold mb-3">どんな旅がしたい？</h2>
      <p className="text-muted mb-12">気分で選んでいい。</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
        {EXPERIENCE_TYPES.map((exp) => (
          <button
            key={exp.value}
            onClick={() => {
              setDiagnosis({ ...diagnosis, experienceType: exp.value });
              goNext(2);
            }}
            className={`group p-6 rounded-2xl text-left transition-all hover:scale-[1.02] ${
              diagnosis.experienceType === exp.value
                ? "bg-foreground text-background shadow-lg"
                : "bg-surface hover:bg-border/70"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{exp.emoji}</span>
              <div>
                <p className="font-bold">{exp.value}</p>
                <p className={`text-xs mt-0.5 ${
                  diagnosis.experienceType === exp.value ? "text-background/50" : "text-muted"
                }`}>{exp.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Step 2: 興味
    <div key="int" className="text-center animate-fade-up">
      <p className="text-accent text-xs font-medium tracking-[0.15em] uppercase mb-6">Step 3 of 4</p>
      <h2 className="text-3xl md:text-5xl font-bold mb-3">気になるのは？</h2>
      <p className="text-muted mb-12">いくつでも選べる。直感で。</p>
      <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto mb-12">
        {INTEREST_OPTIONS.map((interest) => {
          const selected = (diagnosis.interests || []).includes(interest.label);
          return (
            <button
              key={interest.label}
              onClick={() => toggleInterest(interest.label)}
              className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                selected
                  ? "bg-foreground text-background shadow-lg scale-105"
                  : "bg-surface hover:bg-border/70 text-muted hover:text-foreground"
              }`}
            >
              <span className="mr-1.5">{interest.emoji}</span>
              {interest.label}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => goNext(3)}
        disabled={(diagnosis.interests || []).length === 0}
        className="bg-accent text-white px-10 py-4 rounded-full font-medium hover:shadow-xl hover:shadow-accent/30 transition-all disabled:opacity-30 disabled:hover:shadow-none"
      >
        次へ →
      </button>
    </div>,

    // Step 3: エリア
    <div key="area" className="text-center animate-fade-up">
      <p className="text-accent text-xs font-medium tracking-[0.15em] uppercase mb-6">Step 4 of 4</p>
      <h2 className="text-3xl md:text-5xl font-bold mb-3">行きたいエリアは？</h2>
      <p className="text-muted mb-12">決まってなければ「おまかせ」で。</p>
      <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto mb-12">
        <button
          onClick={() => setDiagnosis({ ...diagnosis, area: undefined })}
          className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
            !diagnosis.area
              ? "bg-foreground text-background shadow-lg"
              : "bg-surface text-muted hover:bg-border/70"
          }`}
        >
          🎲 おまかせ
        </button>
        {AREA_LIST.map((area) => (
          <button
            key={area}
            onClick={() => setDiagnosis({ ...diagnosis, area: area as Area })}
            className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
              diagnosis.area === area
                ? "bg-foreground text-background shadow-lg"
                : "bg-surface text-muted hover:bg-border/70"
            }`}
          >
            {area}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="group bg-accent text-white px-12 py-5 rounded-full text-lg font-medium hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center gap-2 mx-auto"
      >
        この条件で提案してもらう
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </div>,
  ];

  // ── Result view ──
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
      <div className="animate-fade-up">
        {/* Main proposal - hero */}
        <section className="bg-foreground text-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 70% 30%, rgba(196,93,62,0.4) 0%, transparent 50%)"
          }} />
          <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-28">
            <p className="text-accent-light text-xs font-medium tracking-[0.2em] uppercase mb-6">Your Best Match</p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
              {mainDest?.name || "提案"}
            </h1>
            <p className="text-lg md:text-xl text-background/50 max-w-2xl leading-relaxed mb-8">
              {proposal.main.story}
            </p>
            {mainDest && (
              <div className="flex flex-wrap gap-3 mb-6">
                {mainDest.category.map((c) => (
                  <span key={c} className="text-sm bg-background/10 px-4 py-1.5 rounded-full">{c}</span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {proposal.main.highlights.map((h) => (
                <span key={h} className="text-sm bg-background/5 border border-background/10 px-4 py-2 rounded-full text-background/60">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
          {/* Model course */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-10">この旅はこう回るのが気持ちいい</h2>
            <div className="space-y-10">
              {proposal.main.itinerary.map((day) => (
                <div key={day.dayNumber}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {day.dayNumber}
                    </span>
                    <h3 className="text-lg font-bold">Day {day.dayNumber}</h3>
                  </div>
                  <div className="relative pl-10 border-l-2 border-border space-y-4 ml-5">
                    {day.spots.map((spot, si) => (
                      <div key={si} className="relative animate-slide-in" style={{ animationDelay: `${si * 0.05}s` }}>
                        <div className="absolute -left-[29px] top-4 w-3.5 h-3.5 rounded-full bg-accent border-3 border-background" />
                        <div className="bg-surface rounded-xl p-5">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-bold text-accent">{spot.time}</span>
                            {spot.category && (
                              <span className="text-xs bg-background px-2 py-0.5 rounded text-muted">{spot.category}</span>
                            )}
                            {spot.duration && <span className="text-xs text-muted">{spot.duration}</span>}
                          </div>
                          <p className="font-medium">{spot.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison table */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-10">比較して選ぶ</h2>
            <div className="bg-surface rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-6 text-muted font-medium w-28"></th>
                      <th className="text-left py-4 px-6">
                        <span className="font-bold text-accent text-base">{mainDest?.name}</span>
                        <span className="block text-xs font-normal text-accent/60 mt-0.5">おすすめ</span>
                      </th>
                      {alts.map((a, i) => (
                        <th key={i} className="text-left py-4 px-6 font-medium text-base">
                          {a.dest?.name || "—"}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.comparison.map((row, ri) => (
                      <tr key={row.label} className={ri < proposal.comparison.length - 1 ? "border-b border-border/50" : ""}>
                        <td className="py-4 px-6 text-muted text-xs">{row.label}</td>
                        <td className="py-4 px-6 font-medium">{row.main}</td>
                        <td className="py-4 px-6 text-muted">{row.alt1}</td>
                        <td className="py-4 px-6 text-muted">{row.alt2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Alternatives */}
          {alts.length > 0 && (
            <section className="mb-20">
              <h2 className="text-2xl md:text-3xl font-bold mb-10">こっちもアリ</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {alts.map((alt, i) => alt.dest && (
                  <Link key={i} href={`/destinations/${alt.dest.id}`} className="group block">
                    <div className="bg-surface rounded-2xl p-7 md:p-8 card-hover h-full">
                      <p className="text-xs text-muted mb-2">{alt.dest.area} / {alt.dest.prefecture}</p>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">{alt.dest.name}</h3>
                      <p className="text-sm text-muted leading-relaxed mb-4">{alt.story.slice(0, 120)}...</p>
                      <p className="text-sm text-accent font-medium">{alt.reason}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related articles */}
          {relArticles.length > 0 && (
            <section className="mb-20">
              <h2 className="text-2xl md:text-3xl font-bold mb-10">もっと深く知る</h2>
              <div className="space-y-4">
                {relArticles.map((article) => (
                  <Link key={article.id} href={`/articles/${article.slug}`} className="group block bg-surface rounded-xl p-6 card-hover">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">{article.category}</span>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{article.title}</h3>
                    <p className="text-sm text-muted mt-2">{article.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTAs */}
          <section className="flex flex-col sm:flex-row gap-4 justify-center py-12 border-t border-border">
            <Link
              href={`/itinerary?from=${proposal.main.destination}`}
              className="group bg-accent text-white px-8 py-4 rounded-full font-medium hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center justify-center gap-2"
            >
              この旅のしおりを作る
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <button
              onClick={() => { setStep(0); setProposal(null); }}
              className="bg-surface px-8 py-4 rounded-full font-medium hover:bg-border transition-colors"
            >
              条件を変えてもう一度
            </button>
          </section>
        </div>
      </div>
    );
  }

  // ── Loading state ──
  if (transitioning && step !== 99) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      </div>
    );
  }

  // ── Diagnosis steps ──
  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24 min-h-[80vh] flex flex-col justify-center">
      {/* Progress bar */}
      <div className="flex justify-center gap-2 mb-16">
        {[0, 1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => s < step && goNext(s)}
            className={`h-1.5 rounded-full transition-all ${
              s === step ? "bg-accent w-16" : s < step ? "bg-accent/40 w-10 cursor-pointer" : "bg-border w-8"
            }`}
          />
        ))}
      </div>

      <div className={`transition-opacity duration-200 ${transitioning ? "opacity-0" : "opacity-100"}`}>
        {steps[step]}
      </div>

      {step > 0 && step < 99 && (
        <div className="text-center mt-12">
          <button onClick={() => goNext(step - 1)} className="text-sm text-muted hover:text-foreground transition-colors">
            ← 戻る
          </button>
        </div>
      )}
    </div>
  );
}
