"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useItinerary, ItinSpot } from "@/store/itinerary";
import { getSpotById, getAllSpots } from "@/lib/contentLoader";

const CATS = ["観光", "食事", "移動", "宿泊", "休憩"] as const;
const DOT: Record<string, string> = { 観光: "bg-accent", 食事: "bg-gold", 移動: "bg-g3", 宿泊: "bg-[#7b6b8a]", 休憩: "bg-[#6b8a6b]" };

function Editor() {
  const sp = useSearchParams();
  const store = useItinerary();
  const [editTitle, setEditTitle] = useState(false);
  const [addForm, setAddForm] = useState<number | null>(null);
  const [picker, setPicker] = useState<number | null>(null);
  const [memo, setMemo] = useState<{ di: number; t: string } | null>(null);
  const [ns, setNs] = useState({ name: "", time: "10:00", cat: "観光" });
  const [dq, setDq] = useState("");
  const [dragState, setDragState] = useState<{ di: number; si: number } | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const initDone = useState(false);
  useEffect(() => {
    if (initDone[0]) return;
    const id = sp.get("add") || sp.get("from");
    if (id) {
      const s = getSpotById(id);
      if (s) {
        store.initFrom(`${s.title}の旅`, { spotId: s.id, name: s.title, time: "10:00" });
        initDone[1](true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doAdd = (di: number) => {
    if (!ns.name) return;
    store.addSpot(di, { name: ns.name, time: ns.time });
    setJustAdded(ns.name);
    setTimeout(() => setJustAdded(null), 400);
    setNs({ name: "", time: "10:00", cat: "観光" });
    setAddForm(null);
  };

  const addFromDest = useCallback((di: number, id: string) => {
    const s = getSpotById(id);
    if (!s) return;
    store.addSpot(di, { spotId: s.id, name: s.title, time: "10:00" });
    setJustAdded(s.title);
    setTimeout(() => setJustAdded(null), 400);
    setPicker(null);
    setDq("");
  }, [store]);

  const handleDragStart = (di: number, si: number) => setDragState({ di, si });
  const handleDrop = (di: number, si: number) => {
    if (dragState && dragState.di === di && dragState.si !== si) {
      store.moveSpot(di, dragState.si, si);
    }
    setDragState(null);
  };

  const dests = getAllSpots().filter((d) => !dq || d.title.includes(dq) || d.area.includes(dq));
  const total = store.days.reduce((a, d) => a + d.spots.length, 0);

  return (
    <div className="pt-[80px] pb-[120px]">
      <div className="max-w-[600px] mx-auto px-[20px] md:px-[36px]">
        <div className="mb-[44px]">
          <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[10px]">Itinerary</p>
          {editTitle ? (
            <input value={store.title} onChange={(e) => store.setTitle(e.target.value)}
              onBlur={() => setEditTitle(false)} onKeyDown={(e) => e.key === "Enter" && setEditTitle(false)} autoFocus
              className="serif text-[28px] md:text-[36px] font-bold tracking-[-0.02em] bg-transparent border-b-[2px] border-accent outline-none w-full pb-[2px]" />
          ) : (
            <button onClick={() => setEditTitle(true)} className="text-left group w-full">
              <h1 className="serif text-[28px] md:text-[36px] font-bold tracking-[-0.02em] inline group-hover:text-accent transition-colors">{store.title}</h1>
            </button>
          )}
          <p className="mono text-[11px] text-g3 mt-[6px]">{store.days.length} days · {total} spots</p>
        </div>

        <div className="space-y-[36px]">
          {store.days.map((day, di) => (
            <div key={di}>
              <div className="flex items-center justify-between mb-[16px]">
                <span className="mono text-[11px] font-medium text-accent">Day {day.dayNumber}</span>
                {store.days.length > 1 && (
                  <button onClick={() => store.removeDay(di)} className="text-[10px] text-g3 hover:text-[#c45d3e] transition-colors">削除</button>
                )}
              </div>

              {/* Timeline — paper bg */}
              <div className="rounded-[6px] p-[20px] md:p-[24px]" style={{ background: "linear-gradient(145deg, #f4f1ec, #faf8f5)" }}>
                {day.spots.length > 0 ? (
                  <div className="space-y-[4px]">
                    {day.spots.map((spot, si) => (
                      <div key={si}
                        draggable
                        onDragStart={() => handleDragStart(di, si)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(di, si)}
                        className={`group flex gap-[16px] cursor-grab active:cursor-grabbing ${justAdded === spot.name ? "apaper" : ""}`}>
                        {/* Left: time */}
                        <div className="w-[44px] text-right pt-[1px] shrink-0">
                          <span className="mono text-[12px] font-medium text-fg">{spot.time}</span>
                        </div>
                        {/* Center: line + dot */}
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-[8px] h-[8px] rounded-full ${DOT["観光"]} border-[2px] border-[#f4f1ec] z-10`} />
                          <div className="w-[1px] flex-1 bg-g2/60 min-h-[20px]" />
                        </div>
                        {/* Right: content */}
                        <div className="flex-1 pb-[18px] -mt-[1px]">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-[13px] font-medium">{spot.name}</p>
                              {spot.note && <p className="text-[11px] text-g4 mt-[1px]">{spot.note}</p>}
                              {spot.spotId && (
                                <Link href={`/destinations/${spot.spotId}`} className="text-[10px] text-accent hover:underline mt-[2px] inline-block">詳しく →</Link>
                              )}
                            </div>
                            <button onClick={() => store.removeSpot(di, si)}
                              className="opacity-0 group-hover:opacity-100 text-[10px] text-g3 hover:text-[#c45d3e] transition-all">✕</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-g4 text-[12px] py-[28px]">スポットを追加しよう</p>
                )}

                {day.memo && !memo && (
                  <button onClick={() => setMemo({ di, t: day.memo })}
                    className="w-full text-left mt-[12px] border-l-[2px] border-gold pl-[10px] py-[3px]">
                    <p className="text-[10px] text-g4">メモ</p>
                    <p className="text-[12px] text-g5 whitespace-pre-line">{day.memo}</p>
                  </button>
                )}
              </div>

              <div className="flex gap-[6px] mt-[10px]">
                <button onClick={() => { setAddForm(di); setPicker(null); }}
                  className="text-[11px] text-g4 border border-g2 px-[12px] py-[5px] rounded-full hover:border-ink/20 transition-colors">+ スポット</button>
                <button onClick={() => { setPicker(di); setAddForm(null); }}
                  className="text-[11px] text-accent border border-accent/20 px-[12px] py-[5px] rounded-full hover:bg-accent/5 transition-colors">観光地から</button>
                <button onClick={() => setMemo({ di, t: day.memo })}
                  className="text-[11px] text-gold border border-gold/20 px-[12px] py-[5px] rounded-full hover:bg-gold/5 transition-colors">メモ</button>
              </div>

              {addForm === di && (
                <div className="mt-[10px] bg-white border border-g2 rounded-[6px] p-[16px] afade">
                  <div className="grid grid-cols-2 gap-[6px] mb-[6px]">
                    <input type="time" value={ns.time} onChange={(e) => setNs({ ...ns, time: e.target.value })}
                      className="bg-bg border border-g2 rounded-[4px] px-[10px] py-[7px] text-[12px]" />
                    <select value={ns.cat} onChange={(e) => setNs({ ...ns, cat: e.target.value })}
                      className="bg-bg border border-g2 rounded-[4px] px-[10px] py-[7px] text-[12px]">
                      {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <input type="text" placeholder="スポット名" value={ns.name} onChange={(e) => setNs({ ...ns, name: e.target.value })}
                    className="w-full bg-bg border border-g2 rounded-[4px] px-[10px] py-[7px] text-[12px] mb-[8px]" autoFocus />
                  <div className="flex gap-[6px]">
                    <button onClick={() => doAdd(di)} className="bg-accent text-white px-[16px] py-[6px] rounded-full text-[12px]">追加</button>
                    <button onClick={() => setAddForm(null)} className="text-[12px] text-g4">やめる</button>
                  </div>
                </div>
              )}

              {picker === di && (
                <div className="mt-[10px] bg-white border border-g2 rounded-[6px] p-[16px] max-h-[240px] overflow-y-auto afade">
                  <input type="text" placeholder="名前・エリア…" value={dq} onChange={(e) => setDq(e.target.value)}
                    className="w-full bg-bg border border-g2 rounded-[4px] px-[10px] py-[7px] text-[12px] mb-[8px]" autoFocus />
                  {dests.slice(0, 6).map((d) => (
                    <button key={d.id} onClick={() => addFromDest(di, d.id)}
                      className="w-full text-left py-[8px] border-b border-g1/60 hover:bg-bg transition-colors flex justify-between">
                      <div><p className="text-[12px] font-medium">{d.title}</p><p className="text-[10px] text-g3">{d.area}</p></div>
                      <span className="text-[10px] text-accent">追加</span>
                    </button>
                  ))}
                  <button onClick={() => setPicker(null)} className="text-[10px] text-g3 mt-[6px]">閉じる</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={store.addDay}
          className="w-full mt-[20px] py-[14px] border border-dashed border-g2 rounded-[6px] text-[12px] text-g4 hover:text-accent hover:border-accent/30 transition-all">
          + Day {store.days.length + 1}
        </button>

        {memo && (
          <div className="fixed inset-0 bg-black/15 z-50 flex items-center justify-center p-[20px]" onClick={() => setMemo(null)}>
            <div className="bg-white rounded-[8px] p-[20px] max-w-[380px] w-full shadow-lg" onClick={(e) => e.stopPropagation()}>
              <h3 className="serif font-bold text-[16px] mb-[10px]">Day {memo.di + 1} メモ</h3>
              <textarea value={memo.t} onChange={(e) => setMemo({ ...memo, t: e.target.value })} placeholder="持ち物、注意事項…" rows={4}
                className="w-full bg-bg border border-g2 rounded-[4px] p-[10px] text-[12px] resize-none focus:outline-none" autoFocus />
              <div className="flex gap-[6px] mt-[10px]">
                <button onClick={() => { store.setMemo(memo.di, memo.t); setMemo(null); }}
                  className="bg-accent text-white px-[16px] py-[6px] rounded-full text-[12px]">保存</button>
                <button onClick={() => setMemo(null)} className="text-[12px] text-g4">やめる</button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-[48px] pt-[28px] border-t border-g1 flex flex-col sm:flex-row gap-[8px]">
          <Link href="/destinations" className="text-center border border-g2 text-g4 px-[20px] py-[9px] rounded-full text-[12px] hover:border-ink/20 transition-colors">
            観光地を探す
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  return <Suspense fallback={<div className="pt-[80px] px-[20px] text-g4 text-[13px]">読み込み中…</div>}><Editor /></Suspense>;
}
