"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useItinerary } from "@/store/itinerary";
import { getSpotById, getAllSpots } from "@/lib/contentLoader";
import {
  SpotType,
  SPOT_TYPE_LABEL,
  SPOT_TYPE_COLOR,
  ItineraryTheme,
  PackingItem,
} from "@/types/itinerary";

const THEMES: { key: ItineraryTheme; color: string; label: string }[] = [
  { key: "default", color: "bg-[#4a5a4a]", label: "Classic" },
  { key: "vintage", color: "bg-[#8b7355]", label: "Vintage" },
  { key: "modern", color: "bg-[#2c2c2c]", label: "Modern" },
  { key: "natural", color: "bg-[#6b8a6b]", label: "Natural" },
  { key: "cute", color: "bg-[#c4809a]", label: "Cute" },
];

const PACKING_CATEGORIES: PackingItem["category"][] = [
  "clothing",
  "electronics",
  "toiletries",
  "documents",
  "other",
];
const PACKING_CATEGORY_LABEL: Record<PackingItem["category"], string> = {
  clothing: "衣類",
  electronics: "電子機器",
  toiletries: "日用品",
  documents: "書類",
  other: "その他",
};

function Editor() {
  const sp = useSearchParams();
  const store = useItinerary();
  const [editTitle, setEditTitle] = useState(false);
  const [editSubtitle, setEditSubtitle] = useState(false);
  const [addForm, setAddForm] = useState<number | null>(null);
  const [picker, setPicker] = useState<number | null>(null);
  const [memo, setMemo] = useState<{ di: number; t: string } | null>(null);
  const [ns, setNs] = useState({ name: "", time: "10:00", type: "sightseeing" as SpotType, note: "" });
  const [dq, setDq] = useState("");
  const [dragSt, setDragSt] = useState<{ di: number; si: number } | null>(null);
  const [packingOpen, setPackingOpen] = useState(false);
  const [newPackItem, setNewPackItem] = useState("");
  const [newPackCat, setNewPackCat] = useState<PackingItem["category"]>("other");

  const initDone = useState(false);
  useEffect(() => {
    if (initDone[0]) return;
    const id = sp.get("add") || sp.get("from");
    if (id) {
      const s = getSpotById(id);
      if (s) {
        store.initFrom(`${s.title}の旅`, {
          spotId: s.id,
          name: s.title,
          time: "10:00",
          type: "sightseeing",
        });
        initDone[1](true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doAdd = (di: number) => {
    if (!ns.name) return;
    store.addSpot(di, { name: ns.name, time: ns.time, type: ns.type, note: ns.note || undefined });
    setNs({ name: "", time: "10:00", type: "sightseeing", note: "" });
    setAddForm(null);
  };

  const addDest = useCallback(
    (di: number, id: string) => {
      const s = getSpotById(id);
      if (!s) return;
      store.addSpot(di, { spotId: s.id, name: s.title, time: "10:00", type: "sightseeing" });
      setPicker(null);
      setDq("");
    },
    [store]
  );

  const dests = getAllSpots().filter(
    (d) => !dq || d.title.includes(dq) || d.area.includes(dq)
  );
  const total = store.days.reduce((a, d) => a + d.spots.length, 0);

  const addPackingItem = () => {
    if (!newPackItem.trim()) return;
    store.addPackingItem(newPackItem.trim(), newPackCat);
    setNewPackItem("");
  };

  return (
    <div className="pt-[80px] pb-[120px]">
      <div className="max-w-[600px] mx-auto px-[20px] md:px-[36px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[10px]">
            Itinerary
          </p>

          {/* Editable title */}
          {editTitle ? (
            <input
              value={store.title}
              onChange={(e) => store.setTitle(e.target.value)}
              onBlur={() => setEditTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditTitle(false)}
              autoFocus
              className="serif text-[28px] md:text-[38px] font-bold tracking-[-0.02em] bg-transparent border-b-[2px] border-accent outline-none w-full pb-[2px]"
            />
          ) : (
            <button
              onClick={() => setEditTitle(true)}
              className="text-left group w-full"
            >
              <h1 className="serif text-[28px] md:text-[38px] font-bold tracking-[-0.02em] inline group-hover:text-accent transition-colors">
                {store.title}
              </h1>
            </button>
          )}

          {/* Editable subtitle */}
          {editSubtitle ? (
            <input
              value={store.subtitle}
              onChange={(e) => store.setSubtitle(e.target.value)}
              onBlur={() => setEditSubtitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditSubtitle(false)}
              autoFocus
              placeholder="サブタイトルを入力..."
              className="text-[13px] text-g4 bg-transparent border-b border-g2 outline-none w-full mt-[4px] pb-[2px]"
            />
          ) : (
            <button
              onClick={() => setEditSubtitle(true)}
              className="text-left w-full mt-[4px]"
            >
              <p className="text-[13px] text-g4 hover:text-accent transition-colors">
                {store.subtitle || "サブタイトルを追加..."}
              </p>
            </button>
          )}

          <p className="mono text-[11px] text-g3 mt-[6px]">
            {store.days.length} days / {total} spots
          </p>
        </motion.div>

        {/* Theme selector */}
        <div className="mt-[20px] flex items-center gap-[8px]">
          <p className="mono text-[10px] text-g3 mr-[4px]">Theme</p>
          {THEMES.map((t) => (
            <button
              key={t.key}
              onClick={() => store.setTheme(t.key)}
              title={t.label}
              className={`w-[24px] h-[24px] rounded-full ${t.color} transition-all ${
                store.theme === t.key
                  ? "ring-[2px] ring-accent ring-offset-[2px]"
                  : "opacity-50 hover:opacity-80"
              }`}
            />
          ))}
        </div>

        {/* Day cards */}
        <div className="mt-[44px] space-y-[36px]">
          {store.days.map((day, di) => (
            <motion.div
              key={di}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: di * 0.08 }}
            >
              <div className="flex items-center justify-between mb-[16px]">
                <span className="mono text-[11px] font-medium text-accent">
                  Day {day.dayNumber}
                </span>
                {store.days.length > 1 && (
                  <button
                    onClick={() => store.removeDay(di)}
                    className="text-[10px] text-g3 hover:text-[#c45d3e] transition-colors"
                  >
                    削除
                  </button>
                )}
              </div>

              {/* Timeline with paper bg */}
              <div
                className="rounded-[6px] p-[20px] md:p-[24px]"
                style={{
                  background:
                    "linear-gradient(145deg, #f0ede6, #f8f6f1)",
                }}
              >
                <AnimatePresence mode="popLayout">
                  {day.spots.length > 0 ? (
                    day.spots.map((spot, si) => (
                      <motion.div
                        key={spot.id}
                        layout
                        initial={{ opacity: 0, scale: 1.04, rotate: 1 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                        draggable
                        onDragStart={() => setDragSt({ di, si })}
                        onDragOver={(e: React.DragEvent) => {
                          e.preventDefault();
                        }}
                        onDrop={() => {
                          if (dragSt && dragSt.di === di && dragSt.si !== si)
                            store.moveSpot(di, dragSt.si, si);
                          setDragSt(null);
                        }}
                        className="group flex gap-[16px] cursor-grab active:cursor-grabbing"
                      >
                        {/* Left: time */}
                        <div className="w-[44px] text-right pt-[1px] shrink-0">
                          <span className="mono text-[12px] font-medium">
                            {spot.time}
                          </span>
                        </div>
                        {/* Center: dot */}
                        <div className="flex flex-col items-center shrink-0">
                          <div
                            className={`w-[8px] h-[8px] rounded-full ${
                              SPOT_TYPE_COLOR[spot.type] || "bg-g3"
                            } border-[2px] border-[#f0ede6] z-10`}
                          />
                          <div className="w-[1px] flex-1 bg-g2/60 min-h-[18px]" />
                        </div>
                        {/* Right: content */}
                        <div className="flex-1 pb-[18px] -mt-[1px]">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-[13px] font-medium">
                                {spot.name}
                              </p>
                              <div className="flex items-center gap-[6px] mt-[2px]">
                                <select
                                  value={spot.type}
                                  onChange={(e) =>
                                    store.updateSpot(di, si, {
                                      type: e.target.value as SpotType,
                                    })
                                  }
                                  className="text-[10px] text-g3 bg-transparent border border-g2 rounded-[4px] px-[4px] py-[1px]"
                                >
                                  {(Object.keys(SPOT_TYPE_LABEL) as SpotType[]).map(
                                    (t) => (
                                      <option key={t} value={t}>
                                        {SPOT_TYPE_LABEL[t]}
                                      </option>
                                    )
                                  )}
                                </select>
                                <input
                                  type="time"
                                  value={spot.time}
                                  onChange={(e) =>
                                    store.updateSpot(di, si, {
                                      time: e.target.value,
                                    })
                                  }
                                  className="text-[10px] text-g3 bg-transparent border border-g2 rounded-[4px] px-[4px] py-[1px] w-[70px]"
                                />
                              </div>
                              {/* Note */}
                              <input
                                type="text"
                                value={spot.note || ""}
                                onChange={(e) =>
                                  store.updateSpot(di, si, {
                                    note: e.target.value || undefined,
                                  })
                                }
                                placeholder="メモ..."
                                className="text-[11px] text-g4 bg-transparent border-b border-transparent hover:border-g2 focus:border-g3 outline-none mt-[3px] w-full transition-colors"
                              />
                              {spot.spotId && (
                                <Link
                                  href={`/destinations/${spot.spotId}`}
                                  className="text-[10px] text-accent hover:underline mt-[2px] inline-block"
                                >
                                  詳しく &rarr;
                                </Link>
                              )}
                            </div>
                            <button
                              onClick={() => store.removeSpot(di, si)}
                              className="opacity-0 group-hover:opacity-100 text-[10px] text-g3 hover:text-[#c45d3e] transition-all ml-[8px] shrink-0"
                            >
                              x
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.p
                      key="empty"
                      className="text-center text-g4 text-[12px] py-[28px]"
                    >
                      スポットを追加しよう
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Day memo display */}
                {day.memo && !memo && (
                  <button
                    onClick={() => setMemo({ di, t: day.memo })}
                    className="w-full text-left mt-[12px] border-l-[2px] border-gold pl-[10px] py-[3px]"
                  >
                    <p className="text-[10px] text-g4">メモ</p>
                    <p className="text-[12px] text-g5 whitespace-pre-line">
                      {day.memo}
                    </p>
                  </button>
                )}
              </div>

              {/* Add buttons */}
              <div className="flex gap-[6px] mt-[10px] flex-wrap">
                <button
                  onClick={() => {
                    setAddForm(di);
                    setPicker(null);
                  }}
                  className="text-[11px] text-g4 border border-g2 px-[12px] py-[5px] rounded-full hover:border-ink/20 transition-colors"
                >
                  + スポット追加
                </button>
                <button
                  onClick={() => {
                    setPicker(di);
                    setAddForm(null);
                  }}
                  className="text-[11px] text-accent border border-accent/20 px-[12px] py-[5px] rounded-full hover:bg-accent/5 transition-colors"
                >
                  観光地から追加
                </button>
                <button
                  onClick={() => setMemo({ di, t: day.memo })}
                  className="text-[11px] text-gold border border-gold/20 px-[12px] py-[5px] rounded-full hover:bg-gold/5 transition-colors"
                >
                  メモ
                </button>
              </div>

              {/* Manual add form */}
              <AnimatePresence>
                {addForm === di && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-[10px]"
                  >
                    <div className="bg-white border border-g2 rounded-[6px] p-[16px]">
                      <div className="grid grid-cols-2 gap-[6px] mb-[6px]">
                        <input
                          type="time"
                          value={ns.time}
                          onChange={(e) => setNs({ ...ns, time: e.target.value })}
                          className="bg-bg border border-g2 rounded-[4px] px-[10px] py-[7px] text-[12px]"
                        />
                        <select
                          value={ns.type}
                          onChange={(e) =>
                            setNs({ ...ns, type: e.target.value as SpotType })
                          }
                          className="bg-bg border border-g2 rounded-[4px] px-[10px] py-[7px] text-[12px]"
                        >
                          {(Object.keys(SPOT_TYPE_LABEL) as SpotType[]).map(
                            (t) => (
                              <option key={t} value={t}>
                                {SPOT_TYPE_LABEL[t]}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <input
                        type="text"
                        placeholder="スポット名"
                        value={ns.name}
                        onChange={(e) => setNs({ ...ns, name: e.target.value })}
                        className="w-full bg-bg border border-g2 rounded-[4px] px-[10px] py-[7px] text-[12px] mb-[6px]"
                        autoFocus
                      />
                      <input
                        type="text"
                        placeholder="メモ（任意）"
                        value={ns.note}
                        onChange={(e) => setNs({ ...ns, note: e.target.value })}
                        className="w-full bg-bg border border-g2 rounded-[4px] px-[10px] py-[7px] text-[12px] mb-[8px]"
                      />
                      <div className="flex gap-[6px]">
                        <button
                          onClick={() => doAdd(di)}
                          className="bg-accent text-white px-[16px] py-[6px] rounded-full text-[12px]"
                        >
                          追加
                        </button>
                        <button
                          onClick={() => setAddForm(null)}
                          className="text-[12px] text-g4"
                        >
                          やめる
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Destination picker */}
                {picker === di && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-[10px]"
                  >
                    <div className="bg-white border border-g2 rounded-[6px] p-[16px] max-h-[240px] overflow-y-auto">
                      <input
                        type="text"
                        placeholder="名前・エリア..."
                        value={dq}
                        onChange={(e) => setDq(e.target.value)}
                        className="w-full bg-bg border border-g2 rounded-[4px] px-[10px] py-[7px] text-[12px] mb-[8px]"
                        autoFocus
                      />
                      {dests.slice(0, 8).map((d) => (
                        <button
                          key={d.id}
                          onClick={() => addDest(di, d.id)}
                          className="w-full text-left py-[8px] border-b border-g1/60 hover:bg-bg transition-colors flex justify-between items-center"
                        >
                          <div className="flex items-center gap-[10px]">
                            <div className="w-[36px] h-[36px] rounded-[4px] overflow-hidden shrink-0 relative">
                              <Image
                                src={d.images[0]}
                                alt={d.title}
                                fill
                                className="object-cover"
                                sizes="36px"
                              />
                            </div>
                            <div>
                              <p className="text-[12px] font-medium">
                                {d.title}
                              </p>
                              <p className="text-[10px] text-g3">{d.area}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-accent shrink-0">
                            追加
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={() => setPicker(null)}
                        className="text-[10px] text-g3 mt-[6px]"
                      >
                        閉じる
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Add / remove day */}
        <button
          onClick={store.addDay}
          className="w-full mt-[20px] py-[14px] border border-dashed border-g2 rounded-[6px] text-[12px] text-g4 hover:text-accent hover:border-accent/30 transition-all active:scale-[0.99]"
        >
          + Day {store.days.length + 1}
        </button>

        {/* Packing list */}
        <section className="mt-[48px] border-t border-g1 pt-[28px]">
          <button
            onClick={() => setPackingOpen(!packingOpen)}
            className="flex items-center justify-between w-full"
          >
            <h2 className="serif text-[18px] font-bold">持ち物リスト</h2>
            <span className="mono text-[11px] text-g3">
              {packingOpen ? "閉じる" : "開く"} ({store.packingList.length})
            </span>
          </button>
          <AnimatePresence>
            {packingOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-[16px]">
                  {/* Add packing item */}
                  <div className="flex gap-[6px] mb-[14px]">
                    <select
                      value={newPackCat}
                      onChange={(e) =>
                        setNewPackCat(e.target.value as PackingItem["category"])
                      }
                      className="bg-bg border border-g2 rounded-[4px] px-[8px] py-[6px] text-[11px]"
                    >
                      {PACKING_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {PACKING_CATEGORY_LABEL[c]}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="アイテム名"
                      value={newPackItem}
                      onChange={(e) => setNewPackItem(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addPackingItem()}
                      className="flex-1 bg-bg border border-g2 rounded-[4px] px-[10px] py-[6px] text-[12px]"
                    />
                    <button
                      onClick={addPackingItem}
                      className="text-[11px] text-accent border border-accent/20 px-[10px] py-[6px] rounded-full hover:bg-accent/5 transition-colors shrink-0"
                    >
                      追加
                    </button>
                  </div>
                  {/* Items grouped by category */}
                  {PACKING_CATEGORIES.map((cat) => {
                    const items = store.packingList.filter(
                      (p) => p.category === cat
                    );
                    if (items.length === 0) return null;
                    return (
                      <div key={cat} className="mb-[14px]">
                        <p className="mono text-[10px] text-g3 mb-[6px]">
                          {PACKING_CATEGORY_LABEL[cat]}
                        </p>
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-[8px] py-[5px] border-b border-g1/40"
                          >
                            <button
                              onClick={() => store.togglePackingItem(item.id)}
                              className={`w-[16px] h-[16px] rounded-[3px] border shrink-0 flex items-center justify-center transition-colors ${
                                item.checked
                                  ? "bg-accent border-accent"
                                  : "border-g2"
                              }`}
                            >
                              {item.checked && (
                                <span className="text-white text-[10px]">
                                  v
                                </span>
                              )}
                            </button>
                            <span
                              className={`text-[12px] flex-1 ${
                                item.checked
                                  ? "line-through text-g3"
                                  : "text-g5"
                              }`}
                            >
                              {item.name}
                            </span>
                            <button
                              onClick={() => store.removePackingItem(item.id)}
                              className="text-[10px] text-g3 hover:text-[#c45d3e] transition-colors"
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Memo modal */}
        <AnimatePresence>
          {memo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/15 z-50 flex items-center justify-center p-[20px]"
              onClick={() => setMemo(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-[8px] p-[20px] max-w-[380px] w-full shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="serif font-bold text-[16px] mb-[10px]">
                  Day {memo.di + 1} メモ
                </h3>
                <textarea
                  value={memo.t}
                  onChange={(e) => setMemo({ ...memo, t: e.target.value })}
                  placeholder="持ち物、注意事項..."
                  rows={4}
                  className="w-full bg-bg border border-g2 rounded-[4px] p-[10px] text-[12px] resize-none focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-[6px] mt-[10px]">
                  <button
                    onClick={() => {
                      store.setMemo(memo.di, memo.t);
                      setMemo(null);
                    }}
                    className="bg-accent text-white px-[16px] py-[6px] rounded-full text-[12px]"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setMemo(null)}
                    className="text-[12px] text-g4"
                  >
                    やめる
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom nav */}
        <div className="mt-[48px] pt-[28px] border-t border-g1 flex flex-col sm:flex-row gap-[8px]">
          <Link
            href="/destinations"
            className="text-center border border-g2 text-g4 px-[20px] py-[9px] rounded-full text-[12px] hover:border-ink/20 transition-colors"
          >
            観光地を探す
          </Link>
          <Link
            href="/create"
            className="text-center border border-accent/20 text-accent px-[20px] py-[9px] rounded-full text-[12px] hover:bg-accent/5 transition-colors"
          >
            条件から作る
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-[80px] px-[20px] text-g4">読み込み中...</div>
      }
    >
      <Editor />
    </Suspense>
  );
}
