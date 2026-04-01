"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDestinationById, getAllDestinations } from "@/lib/contentLoader";
import { Itinerary, ItinerarySpot } from "@/types/itinerary";
import { TimelineSpot } from "@/components/ItineraryTimeline";

const CATS = ["観光","食事","移動","宿泊","休憩","その他"] as const;

function Editor() {
  const sp = useSearchParams();
  const [it, setIt] = useState<Itinerary>({
    id: "new", title: "新しい旅のしおり",
    days: [{ dayNumber: 1, spots: [], memo: "" }],
    createdAt: new Date().toISOString(),
  });
  const [editTitle, setEditTitle] = useState(false);
  const [addForm, setAddForm] = useState<number|null>(null);
  const [picker, setPicker] = useState<number|null>(null);
  const [memo, setMemo] = useState<{di:number;t:string}|null>(null);
  const [ns, setNs] = useState<Partial<ItinerarySpot>>({ time:"10:00", category:"観光" });
  const [dq, setDq] = useState("");

  const init = useState(false);
  useEffect(() => {
    if (init[0]) return;
    const id = sp.get("add") || sp.get("from");
    if (id) {
      const d = getDestinationById(id);
      if (d) {
        setIt({
          id:"new", title:`${d.name}の旅`, area:d.area,
          days:[{ dayNumber:1, spots:[{ destinationId:d.id, name:d.name, time:"10:00", category:"観光", note:d.features[0]?.label }], memo:"" }],
          createdAt: new Date().toISOString(),
        });
        init[1](true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addDay = () => setIt(p => ({...p, days:[...p.days, {dayNumber:p.days.length+1, spots:[], memo:""}]}));
  const rmDay = (di:number) => { if(it.days.length<=1) return; setIt(p => ({...p, days:p.days.filter((_,i)=>i!==di).map((d,i)=>({...d,dayNumber:i+1}))})); };
  const addSpot = (di:number, s:ItinerarySpot) => setIt(p => ({...p, days:p.days.map((d,i)=>i===di?{...d,spots:[...d.spots,s].sort((a,b)=>a.time.localeCompare(b.time))}:d)}));
  const rmSpot = (di:number, si:number) => setIt(p => ({...p, days:p.days.map((d,i)=>i===di?{...d,spots:d.spots.filter((_,j)=>j!==si)}:d)}));
  const saveMemo = (di:number, m:string) => setIt(p => ({...p, days:p.days.map((d,i)=>i===di?{...d,memo:m}:d)}));

  const doAdd = (di:number) => {
    if(!ns.name) return;
    addSpot(di, { name:ns.name, time:ns.time||"10:00", duration:ns.duration, category:ns.category as ItinerarySpot["category"], note:ns.note });
    setNs({time:"10:00",category:"観光"}); setAddForm(null);
  };

  const addDest = (di:number, id:string) => {
    const d = getDestinationById(id);
    if(!d) return;
    addSpot(di, { destinationId:d.id, name:d.name, time:"10:00", category:"観光", note:d.features[0]?.label });
    setPicker(null); setDq("");
  };

  const dests = getAllDestinations().filter(d => !dq || d.name.includes(dq) || d.area.includes(dq));
  const total = it.days.reduce((a,d) => a+d.spots.length, 0);

  return (
    <div className="pt-[80px] pb-[120px]">
      <div className="max-w-[640px] mx-auto px-[20px] md:px-[40px]">
        {/* Header */}
        <div className="mb-[48px]">
          <p className="text-[11px] font-[--mono] tracking-[0.15em] uppercase text-dim mb-[12px]">Itinerary</p>
          {editTitle ? (
            <input value={it.title} onChange={e => setIt({...it, title:e.target.value})} onBlur={() => setEditTitle(false)}
              onKeyDown={e => e.key==="Enter" && setEditTitle(false)} autoFocus
              className="font-[--serif] text-[30px] md:text-[40px] font-bold tracking-[-0.02em] bg-transparent border-b-[2px] border-navy outline-none w-full pb-[4px]" />
          ) : (
            <button onClick={() => setEditTitle(true)} className="text-left group w-full">
              <h1 className="font-[--serif] text-[30px] md:text-[40px] font-bold tracking-[-0.02em] inline group-hover:text-navy transition-colors">{it.title}</h1>
            </button>
          )}
          <p className="text-[12px] text-mute mt-[8px]">{it.days.length}日間 · {total}スポット</p>
        </div>

        {/* Days */}
        <div className="space-y-[40px]">
          {it.days.map((day, di) => (
            <div key={di}>
              {/* Day header */}
              <div className="flex items-center justify-between mb-[20px]">
                <div className="flex items-center gap-[12px]">
                  <span className="font-[--mono] text-[12px] font-medium text-navy">Day {day.dayNumber}</span>
                  {day.date && <span className="text-[11px] text-mute">{day.date}</span>}
                </div>
                {it.days.length > 1 && (
                  <button onClick={() => rmDay(di)} className="text-[11px] text-mute hover:text-[#c45d3e] transition-colors">削除</button>
                )}
              </div>

              {/* Timeline */}
              <div className="bg-off rounded-[8px] p-[24px] md:p-[28px]" style={{ background: "linear-gradient(135deg, #f7f5f2 0%, #faf8f5 100%)" }}>
                {day.spots.length > 0 ? (
                  <div>
                    {day.spots.map((s, si) => (
                      <TimelineSpot key={si} spot={s} onRemove={() => rmSpot(di, si)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-[32px]">
                    <p className="text-dim text-[13px]">スポットを追加しよう</p>
                  </div>
                )}

                {/* Memo */}
                {day.memo && !memo && (
                  <button onClick={() => setMemo({di, t:day.memo||""})}
                    className="w-full text-left mt-[16px] border-l-[2px] border-gold pl-[12px] py-[4px]">
                    <p className="text-[11px] text-dim mb-[2px]">メモ</p>
                    <p className="text-[13px] text-dark whitespace-pre-line">{day.memo}</p>
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-[8px] mt-[12px]">
                <button onClick={() => { setAddForm(di); setPicker(null); }}
                  className="text-[12px] text-dim border border-warm px-[14px] py-[6px] rounded-full hover:border-dark/30 transition-colors">+ スポット</button>
                <button onClick={() => { setPicker(di); setAddForm(null); }}
                  className="text-[12px] text-navy border border-navy/20 px-[14px] py-[6px] rounded-full hover:bg-navy/5 transition-colors">観光地から追加</button>
                <button onClick={() => setMemo({di, t:day.memo||""})}
                  className="text-[12px] text-gold border border-gold/20 px-[14px] py-[6px] rounded-full hover:bg-gold/5 transition-colors">メモ</button>
              </div>

              {/* Add form */}
              {addForm === di && (
                <div className="mt-[12px] bg-white border border-warm rounded-[8px] p-[20px] afade">
                  <div className="grid grid-cols-2 gap-[8px] mb-[8px]">
                    <input type="time" value={ns.time||"10:00"} onChange={e => setNs({...ns, time:e.target.value})}
                      className="bg-off border border-warm rounded-[6px] px-[12px] py-[8px] text-[13px]" />
                    <select value={ns.category||"観光"} onChange={e => setNs({...ns, category:e.target.value as ItinerarySpot["category"]})}
                      className="bg-off border border-warm rounded-[6px] px-[12px] py-[8px] text-[13px]">
                      {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <input type="text" placeholder="スポット名" value={ns.name||""} onChange={e => setNs({...ns, name:e.target.value})}
                    className="w-full bg-off border border-warm rounded-[6px] px-[12px] py-[8px] text-[13px] mb-[8px]" autoFocus />
                  <input type="text" placeholder="メモ（任意）" value={ns.note||""} onChange={e => setNs({...ns, note:e.target.value})}
                    className="w-full bg-off border border-warm rounded-[6px] px-[12px] py-[8px] text-[13px] mb-[12px]" />
                  <div className="flex gap-[8px]">
                    <button onClick={() => doAdd(di)} className="bg-navy text-white px-[20px] py-[8px] rounded-full text-[13px] font-medium">追加</button>
                    <button onClick={() => setAddForm(null)} className="text-[13px] text-mute">キャンセル</button>
                  </div>
                </div>
              )}

              {/* Picker */}
              {picker === di && (
                <div className="mt-[12px] bg-white border border-warm rounded-[8px] p-[20px] max-h-[280px] overflow-y-auto afade">
                  <input type="text" placeholder="名前・エリアで検索…" value={dq} onChange={e => setDq(e.target.value)}
                    className="w-full bg-off border border-warm rounded-[6px] px-[12px] py-[8px] text-[13px] mb-[12px]" autoFocus />
                  {dests.slice(0,8).map(d => (
                    <button key={d.id} onClick={() => addDest(di, d.id)}
                      className="w-full text-left py-[10px] border-b border-warm/60 hover:bg-off transition-colors flex justify-between">
                      <div>
                        <p className="text-[13px] font-medium">{d.name}</p>
                        <p className="text-[11px] text-mute">{d.area} · {d.category[0]}</p>
                      </div>
                      <span className="text-[11px] text-navy">追加</span>
                    </button>
                  ))}
                  <button onClick={() => setPicker(null)} className="text-[11px] text-mute mt-[8px]">閉じる</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add day */}
        <button onClick={addDay}
          className="w-full mt-[24px] py-[16px] border border-dashed border-warm rounded-[8px] text-[13px] text-dim hover:text-navy hover:border-navy/30 transition-all">
          + Day {it.days.length + 1}
        </button>

        {/* Memo modal */}
        {memo && (
          <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-[20px]" onClick={() => setMemo(null)}>
            <div className="bg-white rounded-[12px] p-[24px] max-w-[400px] w-full shadow-xl" onClick={e => e.stopPropagation()}>
              <h3 className="font-[--serif] font-bold mb-[12px]">Day {memo.di+1} メモ</h3>
              <textarea value={memo.t} onChange={e => setMemo({...memo, t:e.target.value})} placeholder="持ち物、注意事項…" rows={4}
                className="w-full bg-off border border-warm rounded-[6px] p-[12px] text-[13px] resize-none focus:outline-none" autoFocus />
              <div className="flex gap-[8px] mt-[12px]">
                <button onClick={() => { saveMemo(memo.di, memo.t); setMemo(null); }} className="bg-navy text-white px-[20px] py-[8px] rounded-full text-[13px]">保存</button>
                <button onClick={() => setMemo(null)} className="text-[13px] text-mute">キャンセル</button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-[56px] pt-[32px] border-t border-warm flex flex-col sm:flex-row gap-[12px]">
          <Link href="/destinations" className="text-center border border-warm text-dim px-[24px] py-[10px] rounded-full text-[13px] hover:border-dark/30 transition-colors">
            観光地を探して追加
          </Link>
          <Link href="/result" className="text-center bg-navy text-white px-[24px] py-[10px] rounded-full text-[13px] font-medium hover:bg-navy-light transition-colors">
            旅を提案してもらう
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  return <Suspense fallback={<div className="pt-[80px] px-[20px] text-dim">読み込み中…</div>}><Editor /></Suspense>;
}
