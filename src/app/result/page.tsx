"use client";

import { useState } from "react";
import Link from "next/link";
import { generateProposal } from "@/lib/travelLogic";
import { getDestinationById, getArticleById } from "@/lib/contentLoader";
import { TravelDiagnosis, TravelProposal } from "@/types/itinerary";
import { Area } from "@/types/destination";
import { AREA_LIST } from "@/lib/helpers";

const RELS = [
  { v: "カップル" as const, icon: "💑", d: "二人の距離が縮まる" },
  { v: "友達" as const, icon: "👯", d: "笑いが止まらない" },
  { v: "家族" as const, icon: "👨‍👩‍👧", d: "みんなが笑顔" },
  { v: "一人" as const, icon: "🧳", d: "自分だけの時間" },
  { v: "夫婦" as const, icon: "👫", d: "日常を離れる" },
  { v: "同僚" as const, icon: "🤝", d: "気兼ねなく" },
];
const EXPS = [
  { v: "のんびり" as const, icon: "🌿", d: "温泉、カフェ、ぼーっと。" },
  { v: "アクティブ" as const, icon: "🏔", d: "体を動かす。自然の中へ。" },
  { v: "バランス" as const, icon: "⚖️", d: "観光もグルメも。" },
  { v: "グルメ中心" as const, icon: "🍽", d: "食が旅の目的。" },
  { v: "観光中心" as const, icon: "📸", d: "名所を自分の目で。" },
];
const INTS = [
  { l: "温泉", i: "♨️" }, { l: "自然", i: "🌳" }, { l: "歴史", i: "🏯" },
  { l: "グルメ", i: "🍜" }, { l: "アート", i: "🎨" }, { l: "アクティビティ", i: "🚴" },
  { l: "街歩き", i: "🚶" }, { l: "絶景", i: "🌅" }, { l: "神社仏閣", i: "⛩" },
  { l: "リゾート", i: "🏖" }, { l: "写真映え", i: "📷" }, { l: "ローカル", i: "🎎" },
];

export default function ResultPage() {
  const [step, setStep] = useState(0);
  const [anim, setAnim] = useState(false);
  const [diag, setDiag] = useState<Partial<TravelDiagnosis>>({ travelers: 2, interests: [] });
  const [prop, setProp] = useState<TravelProposal | null>(null);

  const go = (n: number) => { setAnim(true); setTimeout(() => { setStep(n); setAnim(false); }, 200); };

  const toggle = (interest: string) => {
    const c = diag.interests || [];
    setDiag({ ...diag, interests: c.includes(interest) ? c.filter((x) => x !== interest) : [...c, interest] });
  };

  const submit = () => {
    setAnim(true);
    setTimeout(() => {
      const full: TravelDiagnosis = {
        dateRange: { start: "", end: "" }, travelers: diag.travelers || 2,
        relationship: diag.relationship || "カップル", interests: diag.interests || [],
        experienceType: diag.experienceType || "バランス", budget: diag.budget, area: diag.area,
      };
      setProp(generateProposal(full));
      setStep(99);
      setAnim(false);
    }, 500);
  };

  // ── Result ──
  if (step === 99 && prop) {
    const main = getDestinationById(prop.main.destination);
    const alts = prop.alternatives.map((a) => ({ ...a, d: getDestinationById(a.destination) }));
    const arts = prop.relatedArticleIds.map((id) => getArticleById(id)).filter(Boolean);

    return (
      <div className="anim-fade">
        <section className="bg-ink text-cloud relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 to-transparent" />
          <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-32">
            <p className="text-[11px] tracking-[0.3em] uppercase text-accent-soft mb-8">Your Best Match</p>
            <h1 className="text-display text-4xl md:text-7xl mb-6">{main?.name}</h1>
            <p className="text-lg text-cloud/50 max-w-2xl leading-relaxed mb-8">{prop.main.story}</p>
            <div className="flex flex-wrap gap-2">
              {prop.main.highlights.map((h) => (
                <span key={h} className="text-sm bg-cloud/5 border border-cloud/10 px-4 py-2 rounded-full text-cloud/60">{h}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-[1000px] mx-auto px-5 md:px-10 py-16">
          {/* Timeline */}
          <section className="mb-20">
            <div className="divider mb-4" />
            <h2 className="font-editorial text-2xl md:text-3xl font-bold mb-10">この旅はこう回る</h2>
            {prop.main.itinerary.map((day) => (
              <div key={day.dayNumber} className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-editorial font-bold">{day.dayNumber}</span>
                  <h3 className="font-editorial text-lg font-bold">Day {day.dayNumber}</h3>
                </div>
                <div className="pl-10 border-l-2 border-sand/50 space-y-3 ml-5">
                  {day.spots.map((s, si) => (
                    <div key={si} className="relative">
                      <div className="absolute -left-[29px] top-4 w-3 h-3 rounded-full bg-accent border-2 border-bg" />
                      <div className="bg-cream rounded-xl p-4">
                        <span className="text-sm font-bold text-accent mr-2">{s.time}</span>
                        <span className="text-[11px] text-stone bg-bg px-2 py-0.5 rounded mr-2">{s.category}</span>
                        {s.duration && <span className="text-[11px] text-stone">{s.duration}</span>}
                        <p className="font-medium text-sm mt-1">{s.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Comparison */}
          <section className="mb-20">
            <div className="divider mb-4" />
            <h2 className="font-editorial text-2xl font-bold mb-8">比較して選ぶ</h2>
            <div className="bg-cream rounded-2xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-sand/50">
                  <th className="text-left py-4 px-5 text-stone text-[11px] w-24"></th>
                  <th className="text-left py-4 px-5 font-editorial font-bold text-accent">{main?.name}<span className="block text-[11px] font-normal text-accent/50">おすすめ</span></th>
                  {alts.map((a, i) => <th key={i} className="text-left py-4 px-5 font-editorial font-bold">{a.d?.name}</th>)}
                </tr></thead>
                <tbody>
                  {prop.comparison.map((r, ri) => (
                    <tr key={r.label} className={ri < prop.comparison.length - 1 ? "border-b border-sand/30" : ""}>
                      <td className="py-3 px-5 text-[11px] text-stone">{r.label}</td>
                      <td className="py-3 px-5 font-medium">{r.main}</td>
                      <td className="py-3 px-5 text-stone">{r.alt1}</td>
                      <td className="py-3 px-5 text-stone">{r.alt2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Alts */}
          {alts.length > 0 && (
            <section className="mb-20">
              <div className="divider mb-4" />
              <h2 className="font-editorial text-2xl font-bold mb-8">こっちもアリ</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {alts.map((a, i) => a.d && (
                  <Link key={i} href={`/destinations/${a.d.id}`} className="group block bg-cream rounded-2xl p-7 lift">
                    <p className="text-[11px] text-stone mb-1">{a.d.area}</p>
                    <h3 className="font-editorial text-xl font-bold group-hover:text-accent transition-colors mb-2">{a.d.name}</h3>
                    <p className="text-sm text-stone leading-relaxed mb-3">{a.story.slice(0, 100)}…</p>
                    <p className="text-sm text-accent font-medium">{a.reason}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Articles */}
          {arts.length > 0 && (
            <section className="mb-20">
              <h2 className="font-editorial text-xl font-bold mb-6">もっと深く知る</h2>
              {arts.map((a) => a && (
                <Link key={a.id} href={`/articles/${a.slug}`} className="group block bg-cream rounded-xl p-5 mb-3 lift">
                  <span className="text-[11px] text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">{a.category}</span>
                  <h3 className="font-editorial font-bold mt-2 group-hover:text-accent transition-colors">{a.title}</h3>
                </Link>
              ))}
            </section>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center py-12 border-t border-sand/40">
            <Link href={`/itinerary?from=${prop.main.destination}`} className="pill pill-primary justify-center">しおりを作る →</Link>
            <button onClick={() => { setStep(0); setProp(null); }} className="pill pill-outline justify-center">条件を変えてもう一度</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (anim) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ── Steps ──
  const steps = [
    <div key={0} className="text-center anim-fade">
      <p className="text-[11px] tracking-[0.2em] uppercase text-accent mb-6">Step 1 / 4</p>
      <h2 className="text-display text-3xl md:text-5xl mb-3">誰と行く？</h2>
      <p className="text-stone mb-12">旅の相手で、刺さる場所が変わる。</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
        {RELS.map((r) => (
          <button key={r.v} onClick={() => { setDiag({ ...diag, relationship: r.v }); go(1); }}
            className="py-6 px-4 rounded-2xl text-left bg-cream hover:bg-sand/50 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <span className="text-2xl block mb-2">{r.icon}</span>
            <span className="font-editorial font-bold text-sm block">{r.v}</span>
            <span className="text-[11px] text-stone">{r.d}</span>
          </button>
        ))}
      </div>
    </div>,
    <div key={1} className="text-center anim-fade">
      <p className="text-[11px] tracking-[0.2em] uppercase text-accent mb-6">Step 2 / 4</p>
      <h2 className="text-display text-3xl md:text-5xl mb-3">どんな旅？</h2>
      <p className="text-stone mb-12">気分で選んでいい。</p>
      <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto">
        {EXPS.map((e) => (
          <button key={e.v} onClick={() => { setDiag({ ...diag, experienceType: e.v }); go(2); }}
            className="p-6 rounded-2xl text-left bg-cream hover:bg-sand/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-4">
            <span className="text-2xl">{e.icon}</span>
            <div><p className="font-editorial font-bold">{e.v}</p><p className="text-[11px] text-stone">{e.d}</p></div>
          </button>
        ))}
      </div>
    </div>,
    <div key={2} className="text-center anim-fade">
      <p className="text-[11px] tracking-[0.2em] uppercase text-accent mb-6">Step 3 / 4</p>
      <h2 className="text-display text-3xl md:text-5xl mb-3">気になるのは？</h2>
      <p className="text-stone mb-12">いくつでも。直感で。</p>
      <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto mb-12">
        {INTS.map((x) => {
          const sel = (diag.interests || []).includes(x.l);
          return (
            <button key={x.l} onClick={() => toggle(x.l)}
              className={`px-5 py-3 rounded-full text-sm transition-all ${sel ? "bg-fg text-bg scale-105 shadow-lg" : "bg-cream text-stone hover:bg-sand/50"}`}>
              {x.i} {x.l}
            </button>
          );
        })}
      </div>
      <button onClick={() => go(3)} disabled={(diag.interests || []).length === 0} className="pill pill-primary disabled:opacity-30">次へ →</button>
    </div>,
    <div key={3} className="text-center anim-fade">
      <p className="text-[11px] tracking-[0.2em] uppercase text-accent mb-6">Step 4 / 4</p>
      <h2 className="text-display text-3xl md:text-5xl mb-3">エリアは？</h2>
      <p className="text-stone mb-12">決まってなければ「おまかせ」で。</p>
      <div className="flex flex-wrap justify-center gap-3 max-w-xl mx-auto mb-12">
        <button onClick={() => setDiag({ ...diag, area: undefined })}
          className={`px-5 py-3 rounded-full text-sm transition-all ${!diag.area ? "bg-fg text-bg shadow-lg" : "bg-cream text-stone"}`}>
          🎲 おまかせ
        </button>
        {AREA_LIST.map((a) => (
          <button key={a} onClick={() => setDiag({ ...diag, area: a as Area })}
            className={`px-5 py-3 rounded-full text-sm transition-all ${diag.area === a ? "bg-fg text-bg shadow-lg" : "bg-cream text-stone"}`}>
            {a}
          </button>
        ))}
      </div>
      <button onClick={submit} className="pill pill-primary text-base">この条件で提案 →</button>
    </div>,
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 md:py-24 min-h-[80vh] flex flex-col justify-center">
      <div className="flex justify-center gap-2 mb-16">
        {[0,1,2,3].map((s) => (
          <button key={s} onClick={() => s < step && go(s)}
            className={`h-1 rounded-full transition-all ${s === step ? "bg-accent w-14" : s < step ? "bg-accent/30 w-8 cursor-pointer" : "bg-sand w-6"}`} />
        ))}
      </div>
      <div className={`transition-opacity duration-200 ${anim ? "opacity-0" : "opacity-100"}`}>{steps[step]}</div>
      {step > 0 && <div className="text-center mt-12"><button onClick={() => go(step - 1)} className="text-sm text-stone hover:text-fg">← 戻る</button></div>}
    </div>
  );
}
