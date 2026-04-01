"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDestinationById, getAllDestinations } from "@/lib/contentLoader";
import { Itinerary, ItinerarySpot } from "@/types/itinerary";

const SPOT_CATEGORIES = ["観光", "食事", "移動", "宿泊", "休憩", "その他"] as const;
const CATEGORY_STYLES: Record<string, { bg: string; text: string; emoji: string }> = {
  観光: { bg: "bg-blue-50", text: "text-blue-600", emoji: "📍" },
  食事: { bg: "bg-orange-50", text: "text-orange-600", emoji: "🍽" },
  移動: { bg: "bg-gray-50", text: "text-gray-500", emoji: "🚃" },
  宿泊: { bg: "bg-purple-50", text: "text-purple-600", emoji: "🏨" },
  休憩: { bg: "bg-green-50", text: "text-green-600", emoji: "☕" },
  その他: { bg: "bg-surface", text: "text-muted", emoji: "📌" },
};

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function ItineraryEditor() {
  const searchParams = useSearchParams();
  const addDestId = searchParams.get("add");
  const fromDestId = searchParams.get("from");

  const [itinerary, setItinerary] = useState<Itinerary>({
    id: generateId(),
    title: "新しい旅のしおり",
    days: [{ dayNumber: 1, spots: [], memo: "" }],
    createdAt: new Date().toISOString(),
  });
  const [editingTitle, setEditingTitle] = useState(false);
  const [showAddSpot, setShowAddSpot] = useState<{ dayIndex: number } | null>(null);
  const [showDestPicker, setShowDestPicker] = useState<{ dayIndex: number } | null>(null);
  const [newSpot, setNewSpot] = useState<Partial<ItinerarySpot>>({ time: "10:00", category: "観光" });
  const [destSearch, setDestSearch] = useState("");
  const [stickyNote, setStickyNote] = useState<{ dayIndex: number; text: string } | null>(null);

  const paramProcessed = useState(false);
  useEffect(() => {
    if (paramProcessed[0]) return;
    const destId = addDestId || fromDestId;
    if (destId) {
      const dest = getDestinationById(destId);
      if (dest) {
        setItinerary({
          id: generateId(),
          title: `${dest.name}の旅`,
          area: dest.area,
          days: [{
            dayNumber: 1,
            spots: [{
              destinationId: dest.id,
              name: dest.name,
              time: "10:00",
              category: "観光",
              note: dest.features[0]?.label,
            }],
            memo: "",
          }],
          createdAt: new Date().toISOString(),
        });
        paramProcessed[1](true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addDay = () => {
    setItinerary((prev) => ({
      ...prev,
      days: [...prev.days, { dayNumber: prev.days.length + 1, spots: [], memo: "" }],
    }));
  };

  const removeDay = (dayIndex: number) => {
    if (itinerary.days.length <= 1) return;
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.filter((_, i) => i !== dayIndex).map((d, i) => ({ ...d, dayNumber: i + 1 })),
    }));
  };

  const addSpotToDay = (dayIndex: number, spot: ItinerarySpot) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === dayIndex
          ? { ...d, spots: [...d.spots, spot].sort((a, b) => a.time.localeCompare(b.time)) }
          : d
      ),
    }));
  };

  const removeSpot = (dayIndex: number, spotIndex: number) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === dayIndex ? { ...d, spots: d.spots.filter((_, si) => si !== spotIndex) } : d
      ),
    }));
  };

  const updateMemo = (dayIndex: number, memo: string) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((d, i) => (i === dayIndex ? { ...d, memo } : d)),
    }));
  };

  const handleAddSpot = (dayIndex: number) => {
    if (!newSpot.name) return;
    addSpotToDay(dayIndex, {
      name: newSpot.name || "",
      time: newSpot.time || "10:00",
      duration: newSpot.duration,
      category: newSpot.category as ItinerarySpot["category"],
      note: newSpot.note,
    });
    setNewSpot({ time: "10:00", category: "観光" });
    setShowAddSpot(null);
  };

  const handleAddDest = (dayIndex: number, destId: string) => {
    const dest = getDestinationById(destId);
    if (!dest) return;
    addSpotToDay(dayIndex, {
      destinationId: dest.id,
      name: dest.name,
      time: "10:00",
      category: "観光",
      note: dest.features[0]?.label,
    });
    setShowDestPicker(null);
    setDestSearch("");
  };

  const filteredDests = getAllDestinations().filter(
    (d) => !destSearch || d.name.includes(destSearch) || d.area.includes(destSearch) || d.prefecture.includes(destSearch)
  );

  const totalSpots = itinerary.days.reduce((acc, d) => acc + d.spots.length, 0);

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-10 md:py-16">
      {/* ── Header: 手帳風 ── */}
      <div className="mb-10 md:mb-14">
        <p className="text-accent text-xs font-medium tracking-[0.15em] uppercase mb-4">My Itinerary</p>
        {editingTitle ? (
          <input
            type="text"
            value={itinerary.title}
            onChange={(e) => setItinerary({ ...itinerary, title: e.target.value })}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
            autoFocus
            className="text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-accent outline-none w-full pb-2"
          />
        ) : (
          <button onClick={() => setEditingTitle(true)} className="text-left w-full group">
            <h1 className="text-3xl md:text-4xl font-bold group-hover:text-accent transition-colors inline">
              {itinerary.title}
            </h1>
            <span className="text-muted ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm">編集</span>
          </button>
        )}
        <div className="flex items-center gap-4 mt-3 text-sm text-muted">
          <span>{itinerary.days.length}日間</span>
          <span>·</span>
          <span>{totalSpots}スポット</span>
        </div>
      </div>

      {/* ── Days ── */}
      <div className="space-y-6">
        {itinerary.days.map((day, dayIndex) => (
          <div key={dayIndex} className="relative">
            {/* Day card - 手帳風 */}
            <div className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden">
              {/* Day header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 bg-surface/30">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {day.dayNumber}
                  </span>
                  <div>
                    <h2 className="font-bold text-base">Day {day.dayNumber}</h2>
                    {day.date && <p className="text-xs text-muted">{day.date}</p>}
                  </div>
                </div>
                {itinerary.days.length > 1 && (
                  <button
                    onClick={() => removeDay(dayIndex)}
                    className="text-xs text-muted hover:text-red-500 transition-colors"
                  >
                    削除
                  </button>
                )}
              </div>

              {/* Timeline */}
              <div className="px-6 py-5">
                {day.spots.length > 0 ? (
                  <div className="relative pl-8 border-l-2 border-border/60 space-y-3">
                    {day.spots.map((spot, spotIndex) => {
                      const style = CATEGORY_STYLES[spot.category || "その他"];
                      return (
                        <div key={spotIndex} className="relative group animate-slide-in">
                          <div className={`absolute -left-[25px] top-3 w-3 h-3 rounded-full border-2 border-white ${style.bg.replace("bg-", "bg-")} ${style.text}`}
                            style={{ backgroundColor: "currentColor" }} />
                          <div className={`${style.bg} rounded-xl p-4 transition-all`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-bold">{spot.time}</span>
                                  <span className={`text-xs ${style.text} ${style.bg} px-2 py-0.5 rounded-full font-medium`}>
                                    {style.emoji} {spot.category}
                                  </span>
                                  {spot.duration && <span className="text-xs text-muted">{spot.duration}</span>}
                                </div>
                                <p className="font-medium text-sm">{spot.name}</p>
                                {spot.note && (
                                  <p className="text-xs text-muted mt-1">{spot.note}</p>
                                )}
                                {spot.destinationId && (
                                  <Link
                                    href={`/destinations/${spot.destinationId}`}
                                    className="text-xs text-accent hover:underline mt-1.5 inline-block"
                                  >
                                    詳しく見る →
                                  </Link>
                                )}
                              </div>
                              <button
                                onClick={() => removeSpot(dayIndex, spotIndex)}
                                className="opacity-0 group-hover:opacity-100 text-xs text-muted hover:text-red-500 transition-all p-1"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-border/50 rounded-xl">
                    <p className="text-3xl mb-2">🗺</p>
                    <p className="text-muted text-sm">スポットを追加しよう</p>
                  </div>
                )}

                {/* Memo display */}
                {day.memo && !stickyNote && (
                  <button
                    onClick={() => setStickyNote({ dayIndex, text: day.memo || "" })}
                    className="mt-4 w-full text-left bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl hover:bg-yellow-100/70 transition-colors"
                  >
                    <p className="text-xs font-medium text-yellow-700 mb-1">📝 メモ</p>
                    <p className="text-sm text-yellow-800 whitespace-pre-line">{day.memo}</p>
                  </button>
                )}
              </div>

              {/* Action buttons */}
              <div className="px-6 pb-5 flex flex-wrap gap-2">
                <button
                  onClick={() => { setShowAddSpot({ dayIndex }); setShowDestPicker(null); }}
                  className="text-xs bg-surface hover:bg-border px-4 py-2.5 rounded-full transition-colors font-medium"
                >
                  + スポット追加
                </button>
                <button
                  onClick={() => { setShowDestPicker({ dayIndex }); setShowAddSpot(null); }}
                  className="text-xs bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2.5 rounded-full transition-colors font-medium"
                >
                  📍 観光地から追加
                </button>
                <button
                  onClick={() => setStickyNote({ dayIndex, text: day.memo || "" })}
                  className="text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-4 py-2.5 rounded-full transition-colors font-medium"
                >
                  📝 メモ
                </button>
              </div>

              {/* Inline forms */}
              {showAddSpot?.dayIndex === dayIndex && (
                <div className="px-6 pb-6">
                  <div className="bg-surface rounded-xl p-5 animate-fade-up">
                    <p className="text-xs font-medium text-muted mb-3">スポットを追加</p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input type="time" value={newSpot.time || "10:00"} onChange={(e) => setNewSpot({ ...newSpot, time: e.target.value })}
                        className="bg-white rounded-lg px-3 py-2.5 text-sm border border-border/50" />
                      <select value={newSpot.category || "観光"} onChange={(e) => setNewSpot({ ...newSpot, category: e.target.value as ItinerarySpot["category"] })}
                        className="bg-white rounded-lg px-3 py-2.5 text-sm border border-border/50">
                        {SPOT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <input type="text" placeholder="スポット名" value={newSpot.name || ""} onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })}
                      className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-border/50 mb-2" autoFocus />
                    <input type="text" placeholder="メモ（任意）" value={newSpot.note || ""} onChange={(e) => setNewSpot({ ...newSpot, note: e.target.value })}
                      className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-border/50 mb-3" />
                    <div className="flex gap-2">
                      <button onClick={() => handleAddSpot(dayIndex)} className="bg-accent text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90">追加</button>
                      <button onClick={() => setShowAddSpot(null)} className="text-sm text-muted hover:text-foreground px-4 py-2">キャンセル</button>
                    </div>
                  </div>
                </div>
              )}

              {showDestPicker?.dayIndex === dayIndex && (
                <div className="px-6 pb-6">
                  <div className="bg-surface rounded-xl p-5 animate-fade-up max-h-72 overflow-y-auto">
                    <p className="text-xs font-medium text-muted mb-3">観光地を選ぶ</p>
                    <input type="text" placeholder="名前・エリアで検索..." value={destSearch} onChange={(e) => setDestSearch(e.target.value)}
                      className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-border/50 mb-3" autoFocus />
                    <div className="space-y-1">
                      {filteredDests.slice(0, 10).map((dest) => (
                        <button key={dest.id} onClick={() => handleAddDest(dayIndex, dest.id)}
                          className="w-full text-left p-3 rounded-lg hover:bg-white transition-colors flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{dest.name}</p>
                            <p className="text-xs text-muted">{dest.area} · {dest.category[0]}</p>
                          </div>
                          <span className="text-accent text-xs">追加</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setShowDestPicker(null)} className="text-xs text-muted hover:text-foreground mt-2">閉じる</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add day */}
      <button
        onClick={addDay}
        className="w-full mt-5 py-5 border-2 border-dashed border-border/50 rounded-2xl text-muted hover:text-accent hover:border-accent/30 transition-all text-sm font-medium"
      >
        + Day {itinerary.days.length + 1} を追加
      </button>

      {/* Sticky note modal */}
      {stickyNote && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-5" onClick={() => setStickyNote(null)}>
          <div className="bg-yellow-50 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold mb-3 text-yellow-800 flex items-center gap-2">
              <span>📝</span> Day {stickyNote.dayIndex + 1} のメモ
            </h3>
            <textarea
              value={stickyNote.text}
              onChange={(e) => setStickyNote({ ...stickyNote, text: e.target.value })}
              placeholder="持ち物、注意事項、やりたいこと..."
              rows={5}
              className="w-full bg-yellow-100/50 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => { updateMemo(stickyNote.dayIndex, stickyNote.text); setStickyNote(null); }}
                className="bg-yellow-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90">保存</button>
              <button onClick={() => setStickyNote(null)} className="text-sm text-yellow-700 hover:text-yellow-900 px-4 py-2.5">キャンセル</button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/destinations" className="text-sm bg-surface hover:bg-border px-6 py-3 rounded-full transition-colors text-center font-medium">
          📍 観光地を探して追加
        </Link>
        <Link href="/result" className="text-sm bg-accent/10 text-accent hover:bg-accent/20 px-6 py-3 rounded-full transition-colors text-center font-medium">
          🎯 旅を提案してもらう
        </Link>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-5 py-16 text-muted animate-pulse">読み込み中...</div>}>
      <ItineraryEditor />
    </Suspense>
  );
}
