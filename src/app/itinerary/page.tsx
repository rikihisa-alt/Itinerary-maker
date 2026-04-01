"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDestinationById, getAllDestinations } from "@/lib/contentLoader";
import { Itinerary, ItinerarySpot } from "@/types/itinerary";

const CATS = ["観光", "食事", "移動", "宿泊", "休憩", "その他"] as const;
const STYLES: Record<string, { bg: string; dot: string; emoji: string }> = {
  観光: { bg: "bg-blue-50", dot: "bg-blue-400", emoji: "📍" },
  食事: { bg: "bg-orange-50", dot: "bg-orange-400", emoji: "🍽" },
  移動: { bg: "bg-stone/10", dot: "bg-stone/40", emoji: "🚃" },
  宿泊: { bg: "bg-purple-50", dot: "bg-purple-400", emoji: "🏨" },
  休憩: { bg: "bg-green-50", dot: "bg-green-400", emoji: "☕" },
  その他: { bg: "bg-cream", dot: "bg-sand", emoji: "📌" },
};

function genId() { return Math.random().toString(36).slice(2, 10); }

function Editor() {
  const sp = useSearchParams();
  const [it, setIt] = useState<Itinerary>({
    id: genId(), title: "新しい旅のしおり", days: [{ dayNumber: 1, spots: [], memo: "" }], createdAt: new Date().toISOString(),
  });
  const [editTitle, setEditTitle] = useState(false);
  const [addForm, setAddForm] = useState<number | null>(null);
  const [picker, setPicker] = useState<number | null>(null);
  const [memo, setMemo] = useState<{ di: number; t: string } | null>(null);
  const [ns, setNs] = useState<Partial<ItinerarySpot>>({ time: "10:00", category: "観光" });
  const [dq, setDq] = useState("");

  const init = useState(false);
  useEffect(() => {
    if (init[0]) return;
    const id = sp.get("add") || sp.get("from");
    if (id) {
      const d = getDestinationById(id);
      if (d) {
        setIt({ id: genId(), title: `${d.name}の旅`, area: d.area, days: [{ dayNumber: 1, spots: [{ destinationId: d.id, name: d.name, time: "10:00", category: "観光", note: d.features[0]?.label }], memo: "" }], createdAt: new Date().toISOString() });
        init[1](true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addDay = () => setIt((p) => ({ ...p, days: [...p.days, { dayNumber: p.days.length + 1, spots: [], memo: "" }] }));
  const rmDay = (di: number) => { if (it.days.length <= 1) return; setIt((p) => ({ ...p, days: p.days.filter((_, i) => i !== di).map((d, i) => ({ ...d, dayNumber: i + 1 })) })); };
  const addSpot = (di: number, s: ItinerarySpot) => setIt((p) => ({ ...p, days: p.days.map((d, i) => i === di ? { ...d, spots: [...d.spots, s].sort((a, b) => a.time.localeCompare(b.time)) } : d) }));
  const rmSpot = (di: number, si: number) => setIt((p) => ({ ...p, days: p.days.map((d, i) => i === di ? { ...d, spots: d.spots.filter((_, j) => j !== si) } : d) }));
  const saveMemo = (di: number, m: string) => setIt((p) => ({ ...p, days: p.days.map((d, i) => i === di ? { ...d, memo: m } : d) }));

  const doAdd = (di: number) => {
    if (!ns.name) return;
    addSpot(di, { name: ns.name, time: ns.time || "10:00", duration: ns.duration, category: ns.category as ItinerarySpot["category"], note: ns.note });
    setNs({ time: "10:00", category: "観光" }); setAddForm(null);
  };

  const addDest = (di: number, id: string) => {
    const d = getDestinationById(id);
    if (!d) return;
    addSpot(di, { destinationId: d.id, name: d.name, time: "10:00", category: "観光", note: d.features[0]?.label });
    setPicker(null); setDq("");
  };

  const dests = getAllDestinations().filter((d) => !dq || d.name.includes(dq) || d.area.includes(dq));
  const total = it.days.reduce((a, d) => a + d.spots.length, 0);

  return (
    <div className="max-w-[800px] mx-auto px-5 md:px-10 py-10 md:py-20">
      {/* Header */}
      <div className="mb-12">
        <div className="divider mb-4" />
        <p className="text-[11px] tracking-[0.2em] uppercase text-accent mb-4">My Itinerary</p>
        {editTitle ? (
          <input value={it.title} onChange={(e) => setIt({ ...it, title: e.target.value })} onBlur={() => setEditTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditTitle(false)} autoFocus
            className="text-display text-3xl md:text-4xl bg-transparent border-b-2 border-accent outline-none w-full pb-1" />
        ) : (
          <button onClick={() => setEditTitle(true)} className="text-left group w-full">
            <h1 className="text-display text-3xl md:text-4xl inline group-hover:text-accent transition-colors">{it.title}</h1>
            <span className="text-stone text-sm ml-3 opacity-0 group-hover:opacity-100 transition-opacity">編集</span>
          </button>
        )}
        <p className="text-stone text-sm mt-2">{it.days.length}日間 · {total}スポット</p>
      </div>

      {/* Days */}
      <div className="space-y-6">
        {it.days.map((day, di) => (
          <div key={di} className="bg-cloud rounded-2xl border border-sand/30 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand/20 bg-cream/30">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-white font-editorial font-bold text-sm">{day.dayNumber}</span>
                <h2 className="font-editorial font-bold">Day {day.dayNumber}</h2>
              </div>
              {it.days.length > 1 && <button onClick={() => rmDay(di)} className="text-[11px] text-stone hover:text-red-500 transition-colors">削除</button>}
            </div>

            <div className="px-6 py-5">
              {day.spots.length > 0 ? (
                <div className="pl-7 border-l-2 border-sand/50 space-y-3">
                  {day.spots.map((s, si) => {
                    const st = STYLES[s.category || "その他"];
                    return (
                      <div key={si} className="relative group anim-slide" style={{ animationDelay: `${si * 0.03}s` }}>
                        <div className={`absolute -left-[21px] top-4 w-2.5 h-2.5 rounded-full ${st.dot}`} />
                        <div className={`${st.bg} rounded-xl p-4`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-sm font-bold text-accent mr-2">{s.time}</span>
                              <span className="text-[11px] text-stone">{st.emoji} {s.category}</span>
                              {s.duration && <span className="text-[11px] text-stone ml-2">{s.duration}</span>}
                              <p className="font-medium text-sm mt-1">{s.name}</p>
                              {s.note && <p className="text-[11px] text-stone mt-0.5">{s.note}</p>}
                              {s.destinationId && <Link href={`/destinations/${s.destinationId}`} className="text-[11px] text-accent hover:underline mt-1 inline-block">詳しく見る →</Link>}
                            </div>
                            <button onClick={() => rmSpot(di, si)} className="opacity-0 group-hover:opacity-100 text-stone hover:text-red-500 text-xs transition-all">✕</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-sand/40 rounded-xl">
                  <p className="text-2xl mb-1">🗺</p><p className="text-stone text-sm">スポットを追加しよう</p>
                </div>
              )}

              {day.memo && !memo && (
                <button onClick={() => setMemo({ di, t: day.memo || "" })} className="mt-4 w-full text-left bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl hover:bg-yellow-100/70 transition-colors">
                  <p className="text-[11px] font-medium text-yellow-700 mb-0.5">📝 メモ</p>
                  <p className="text-sm text-yellow-800 whitespace-pre-line">{day.memo}</p>
                </button>
              )}
            </div>

            <div className="px-6 pb-5 flex flex-wrap gap-2">
              <button onClick={() => { setAddForm(di); setPicker(null); }}
                className="text-[12px] bg-cream hover:bg-sand/50 px-4 py-2 rounded-full transition-colors">+ スポット</button>
              <button onClick={() => { setPicker(di); setAddForm(null); }}
                className="text-[12px] bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-full transition-colors">📍 観光地から</button>
              <button onClick={() => setMemo({ di, t: day.memo || "" })}
                className="text-[12px] bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-4 py-2 rounded-full transition-colors">📝 メモ</button>
            </div>

            {addForm === di && (
              <div className="px-6 pb-6"><div className="bg-cream rounded-xl p-5 anim-scale">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input type="time" value={ns.time || "10:00"} onChange={(e) => setNs({ ...ns, time: e.target.value })} className="bg-cloud border border-sand/40 rounded-lg px-3 py-2 text-sm" />
                  <select value={ns.category || "観光"} onChange={(e) => setNs({ ...ns, category: e.target.value as ItinerarySpot["category"] })} className="bg-cloud border border-sand/40 rounded-lg px-3 py-2 text-sm">
                    {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <input type="text" placeholder="スポット名" value={ns.name || ""} onChange={(e) => setNs({ ...ns, name: e.target.value })} className="w-full bg-cloud border border-sand/40 rounded-lg px-3 py-2 text-sm mb-2" autoFocus />
                <input type="text" placeholder="メモ（任意）" value={ns.note || ""} onChange={(e) => setNs({ ...ns, note: e.target.value })} className="w-full bg-cloud border border-sand/40 rounded-lg px-3 py-2 text-sm mb-3" />
                <div className="flex gap-2">
                  <button onClick={() => doAdd(di)} className="pill pill-primary !py-2 !px-5 !text-[13px]">追加</button>
                  <button onClick={() => setAddForm(null)} className="text-sm text-stone">キャンセル</button>
                </div>
              </div></div>
            )}

            {picker === di && (
              <div className="px-6 pb-6"><div className="bg-cream rounded-xl p-5 anim-scale max-h-64 overflow-y-auto">
                <input type="text" placeholder="名前・エリアで検索…" value={dq} onChange={(e) => setDq(e.target.value)} className="w-full bg-cloud border border-sand/40 rounded-lg px-3 py-2 text-sm mb-3" autoFocus />
                {dests.slice(0, 8).map((d) => (
                  <button key={d.id} onClick={() => addDest(di, d.id)} className="w-full text-left p-3 rounded-lg hover:bg-cloud transition-colors flex justify-between items-center">
                    <div><p className="font-medium text-sm">{d.name}</p><p className="text-[11px] text-stone">{d.area} · {d.category[0]}</p></div>
                    <span className="text-accent text-[11px]">追加</span>
                  </button>
                ))}
                <button onClick={() => setPicker(null)} className="text-[11px] text-stone mt-2">閉じる</button>
              </div></div>
            )}
          </div>
        ))}
      </div>

      <button onClick={addDay} className="w-full mt-5 py-5 border-2 border-dashed border-sand/40 rounded-2xl text-stone hover:text-accent hover:border-accent/30 transition-all text-sm">
        + Day {it.days.length + 1} を追加
      </button>

      {/* Memo modal */}
      {memo && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-5" onClick={() => setMemo(null)}>
          <div className="bg-yellow-50 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-editorial font-bold text-yellow-800 mb-3">📝 Day {memo.di + 1} メモ</h3>
            <textarea value={memo.t} onChange={(e) => setMemo({ ...memo, t: e.target.value })} placeholder="持ち物、注意事項…" rows={5}
              className="w-full bg-yellow-100/50 rounded-xl p-4 text-sm resize-none focus:outline-none" autoFocus />
            <div className="flex gap-2 mt-4">
              <button onClick={() => { saveMemo(memo.di, memo.t); setMemo(null); }} className="bg-yellow-600 text-white px-5 py-2 rounded-lg text-sm font-medium">保存</button>
              <button onClick={() => setMemo(null)} className="text-sm text-yellow-700">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-14 pt-8 border-t border-sand/40 flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/destinations" className="pill pill-outline justify-center">📍 観光地を探す</Link>
        <Link href="/result" className="pill pill-primary justify-center">🎯 旅を提案してもらう</Link>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  return <Suspense fallback={<div className="max-w-[800px] mx-auto px-5 py-20 text-stone">読み込み中…</div>}><Editor /></Suspense>;
}
