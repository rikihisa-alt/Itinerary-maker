"use client";

import { useState } from "react";
import Link from "next/link";
import { generateProposal } from "@/lib/travelLogic";
import { getDestinationById, getArticleById } from "@/lib/contentLoader";
import { TravelDiagnosis, TravelProposal } from "@/types/itinerary";
import { Area } from "@/types/destination";
import { AREA_LIST } from "@/lib/helpers";

const RELS = [
  { v: "カップル" as const, d: "二人の距離が縮まる" },
  { v: "友達" as const, d: "笑いが止まらない" },
  { v: "家族" as const, d: "みんなが笑顔" },
  { v: "一人" as const, d: "自分だけの時間" },
  { v: "夫婦" as const, d: "日常を離れる" },
  { v: "同僚" as const, d: "気兼ねなく" },
];
const EXPS = [
  { v: "のんびり" as const, d: "温泉、カフェ、ぼーっと。" },
  { v: "アクティブ" as const, d: "体を動かす。自然の中へ。" },
  { v: "バランス" as const, d: "観光もグルメも。" },
  { v: "グルメ中心" as const, d: "食が旅の目的。" },
  { v: "観光中心" as const, d: "名所を自分の目で。" },
];
const INTS = ["温泉","自然","歴史","グルメ","アート","アクティビティ","街歩き","絶景","神社仏閣","リゾート","写真映え","ローカル体験"];

export default function ResultPage() {
  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);
  const [diag, setDiag] = useState<Partial<TravelDiagnosis>>({ travelers: 2, interests: [] });
  const [prop, setProp] = useState<TravelProposal | null>(null);

  const go = (n: number) => { setFading(true); setTimeout(() => { setStep(n); setFading(false); }, 180); };
  const toggle = (x: string) => {
    const c = diag.interests || [];
    setDiag({ ...diag, interests: c.includes(x) ? c.filter((i) => i !== x) : [...c, x] });
  };
  const submit = () => {
    setFading(true);
    setTimeout(() => {
      setProp(generateProposal({
        dateRange: { start: "", end: "" }, travelers: diag.travelers || 2,
        relationship: diag.relationship || "カップル", interests: diag.interests || [],
        experienceType: diag.experienceType || "バランス", budget: diag.budget, area: diag.area,
      }));
      setStep(99); setFading(false);
    }, 400);
  };

  // ── Result ──
  if (step === 99 && prop) {
    const main = getDestinationById(prop.main.destination);
    const alts = prop.alternatives.map((a) => ({ ...a, d: getDestinationById(a.destination) }));
    const arts = prop.relatedArticleIds.map((id) => getArticleById(id)).filter(Boolean);

    return (
      <div className="afade">
        {/* メイン提案 — デカい */}
        <section className="bg-navy text-white pt-[100px] pb-[64px] md:pt-[140px] md:pb-[80px]">
          <div className="max-w-[900px] mx-auto px-[20px] md:px-[48px]">
            <p className="text-[11px] font-[--mono] tracking-[0.2em] uppercase text-gold mb-[20px]">Your Best Match</p>
            <h1 className="font-[--serif] text-[40px] md:text-[64px] font-bold leading-[1.1] tracking-[-0.02em] mb-[16px]">{main?.name}</h1>
            <p className="text-[15px] text-white/40 max-w-[560px] leading-[1.9] mb-[24px]">{prop.main.story}</p>
            <div className="flex flex-wrap gap-[8px]">
              {prop.main.highlights.map((h) => (
                <span key={h} className="text-[12px] border border-white/10 px-[12px] py-[5px] rounded-full text-white/40">{h}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-[800px] mx-auto px-[20px] md:px-[40px] py-[64px]">
          {/* タイムライン */}
          <section className="mb-[80px]">
            <h2 className="font-[--serif] text-[26px] font-bold mb-[32px]">この旅はこう回る</h2>
            {prop.main.itinerary.map((day) => (
              <div key={day.dayNumber} className="mb-[40px]">
                <p className="font-[--mono] text-[12px] text-navy font-medium mb-[16px]">Day {day.dayNumber}</p>
                {day.spots.map((s, si) => (
                  <div key={si} className="flex gap-[20px] mb-[4px]">
                    <span className="w-[48px] text-right font-[--mono] text-[13px] font-medium text-dark shrink-0 pt-[2px]">{s.time}</span>
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-[8px] h-[8px] rounded-full bg-navy border-[2px] border-off z-10" />
                      <div className="w-[1px] flex-1 bg-warm" />
                    </div>
                    <div className="flex-1 pb-[20px]">
                      <p className="text-[14px] font-medium">{s.name}</p>
                      {s.category && <p className="text-[11px] text-mute">{s.category}{s.duration ? ` · ${s.duration}` : ""}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* 比較テーブル */}
          <section className="mb-[80px]">
            <h2 className="font-[--serif] text-[26px] font-bold mb-[24px]">比較して選ぶ</h2>
            <div className="overflow-x-auto border border-warm rounded-[8px]">
              <table className="w-full text-[13px]">
                <thead><tr className="border-b border-warm bg-off/50">
                  <th className="text-left py-[12px] px-[16px] text-mute text-[11px] w-[80px]"></th>
                  <th className="text-left py-[12px] px-[16px] font-[--serif] font-bold text-navy">{main?.name}</th>
                  {alts.map((a, i) => <th key={i} className="text-left py-[12px] px-[16px] font-[--serif] font-bold">{a.d?.name}</th>)}
                </tr></thead>
                <tbody>
                  {prop.comparison.map((r, ri) => (
                    <tr key={r.label} className={ri < prop.comparison.length - 1 ? "border-b border-warm/50" : ""}>
                      <td className="py-[10px] px-[16px] text-[11px] text-mute">{r.label}</td>
                      <td className="py-[10px] px-[16px] font-medium">{r.main}</td>
                      <td className="py-[10px] px-[16px] text-dim">{r.alt1}</td>
                      <td className="py-[10px] px-[16px] text-dim">{r.alt2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* サブ案 — 小さく */}
          {alts.length > 0 && (
            <section className="mb-[64px]">
              <h3 className="text-[14px] font-medium text-dim mb-[16px]">こっちもアリ</h3>
              <div className="border-t border-warm">
                {alts.map((a, i) => a.d && (
                  <Link key={i} href={`/destinations/${a.d.id}`} className="group block py-[20px] border-b border-warm/60">
                    <p className="text-[11px] text-mute font-[--mono] mb-[4px]">{a.d.area}</p>
                    <h4 className="font-[--serif] text-[18px] font-bold group-hover:text-navy transition-colors">{a.d.name}</h4>
                    <p className="text-[13px] text-dim mt-[4px]">{a.reason}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 記事 */}
          {arts.length > 0 && (
            <section className="mb-[64px]">
              <h3 className="text-[14px] font-medium text-dim mb-[16px]">もっと深く知る</h3>
              <div className="border-t border-warm">
                {arts.map((ar) => ar && (
                  <Link key={ar.id} href={`/articles/${ar.slug}`} className="group block py-[16px] border-b border-warm/60">
                    <span className="text-[11px] text-navy bg-navy/5 px-[8px] py-[2px] rounded-full">{ar.category}</span>
                    <h4 className="font-[--serif] font-bold text-[16px] mt-[6px] group-hover:text-navy transition-colors">{ar.title}</h4>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-col sm:flex-row gap-[12px] pt-[40px] border-t border-warm">
            <Link href={`/itinerary?from=${prop.main.destination}`}
              className="inline-block bg-navy text-white px-[28px] py-[12px] rounded-full text-[14px] font-medium hover:bg-navy-light transition-colors text-center">
              この旅のしおりを作る
            </Link>
            <button onClick={() => { setStep(0); setProp(null); }}
              className="inline-block border border-warm text-dim px-[28px] py-[12px] rounded-full text-[14px] hover:border-dark hover:text-dark transition-colors">
              条件を変えてもう一度
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (fading) return <div className="min-h-[80vh] flex items-center justify-center"><div className="w-[6px] h-[6px] bg-navy rounded-full animate-ping" /></div>;

  // ── Steps ──
  return (
    <div className="max-w-[600px] mx-auto px-[20px] py-[120px] md:py-[160px] min-h-[80vh]">
      {/* Progress */}
      <div className="flex gap-[6px] mb-[56px]">
        {[0,1,2,3].map((s) => (
          <button key={s} onClick={() => s < step && go(s)}
            className={`h-[2px] rounded-full transition-all ${s === step ? "bg-navy w-[48px]" : s < step ? "bg-navy/20 w-[32px] cursor-pointer" : "bg-warm w-[24px]"}`} />
        ))}
      </div>

      <div className={`transition-opacity duration-150 ${fading ? "opacity-0" : "opacity-100"}`}>
        {step === 0 && (
          <div>
            <p className="text-[11px] font-[--mono] tracking-[0.15em] uppercase text-dim mb-[12px]">Step 1 / 4</p>
            <h2 className="font-[--serif] text-[30px] md:text-[40px] font-bold tracking-[-0.02em] mb-[8px]">誰と行く？</h2>
            <p className="text-[14px] text-dim mb-[40px]">旅の相手で、刺さる場所が変わる。</p>
            <div className="grid grid-cols-2 gap-[8px]">
              {RELS.map((r) => (
                <button key={r.v} onClick={() => { setDiag({...diag, relationship: r.v}); go(1); }}
                  className="text-left py-[20px] px-[20px] rounded-[8px] bg-white border border-warm hover:border-navy/30 transition-all active:scale-[0.98]">
                  <span className="font-[--serif] text-[16px] font-bold block">{r.v}</span>
                  <span className="text-[12px] text-mute">{r.d}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <p className="text-[11px] font-[--mono] tracking-[0.15em] uppercase text-dim mb-[12px]">Step 2 / 4</p>
            <h2 className="font-[--serif] text-[30px] md:text-[40px] font-bold tracking-[-0.02em] mb-[8px]">どんな旅？</h2>
            <p className="text-[14px] text-dim mb-[40px]">気分で選んでいい。</p>
            <div className="space-y-[8px]">
              {EXPS.map((e) => (
                <button key={e.v} onClick={() => { setDiag({...diag, experienceType: e.v}); go(2); }}
                  className="w-full text-left py-[16px] px-[20px] rounded-[8px] bg-white border border-warm hover:border-navy/30 transition-all active:scale-[0.99]">
                  <span className="font-[--serif] text-[16px] font-bold">{e.v}</span>
                  <span className="text-[12px] text-mute ml-[8px]">{e.d}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <p className="text-[11px] font-[--mono] tracking-[0.15em] uppercase text-dim mb-[12px]">Step 3 / 4</p>
            <h2 className="font-[--serif] text-[30px] md:text-[40px] font-bold tracking-[-0.02em] mb-[8px]">気になるのは？</h2>
            <p className="text-[14px] text-dim mb-[40px]">いくつでも。直感で。</p>
            <div className="flex flex-wrap gap-[8px] mb-[40px]">
              {INTS.map((x) => (
                <button key={x} onClick={() => toggle(x)}
                  className={`px-[16px] py-[8px] rounded-full text-[13px] transition-all ${
                    (diag.interests||[]).includes(x) ? "bg-navy text-white" : "bg-white text-dim border border-warm hover:border-navy/30"
                  }`}>{x}</button>
              ))}
            </div>
            <button onClick={() => go(3)} disabled={(diag.interests||[]).length===0}
              className="bg-navy text-white px-[28px] py-[12px] rounded-full text-[14px] font-medium disabled:opacity-20 hover:bg-navy-light transition-colors">
              次へ
            </button>
          </div>
        )}
        {step === 3 && (
          <div>
            <p className="text-[11px] font-[--mono] tracking-[0.15em] uppercase text-dim mb-[12px]">Step 4 / 4</p>
            <h2 className="font-[--serif] text-[30px] md:text-[40px] font-bold tracking-[-0.02em] mb-[8px]">エリアは？</h2>
            <p className="text-[14px] text-dim mb-[40px]">決まってなければ「おまかせ」で。</p>
            <div className="flex flex-wrap gap-[8px] mb-[40px]">
              <button onClick={() => setDiag({...diag, area: undefined})}
                className={`px-[16px] py-[8px] rounded-full text-[13px] transition-all ${!diag.area ? "bg-navy text-white" : "bg-white text-dim border border-warm"}`}>
                おまかせ
              </button>
              {AREA_LIST.map((a) => (
                <button key={a} onClick={() => setDiag({...diag, area: a as Area})}
                  className={`px-[16px] py-[8px] rounded-full text-[13px] transition-all ${diag.area===a ? "bg-navy text-white" : "bg-white text-dim border border-warm"}`}>
                  {a}
                </button>
              ))}
            </div>
            <button onClick={submit}
              className="bg-gold text-white px-[32px] py-[14px] rounded-full text-[14px] font-medium hover:bg-[#b8944e] transition-colors">
              この条件で提案する
            </button>
          </div>
        )}
      </div>

      {step > 0 && step < 99 && (
        <button onClick={() => go(step-1)} className="mt-[40px] text-[13px] text-mute hover:text-dark transition-colors">← 戻る</button>
      )}
    </div>
  );
}
