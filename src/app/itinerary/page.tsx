"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDestinationById, getAllDestinations } from "@/lib/contentLoader";
import { Itinerary, ItinerarySpot } from "@/types/itinerary";

const SPOT_CATEGORIES = ["観光", "食事", "移動", "宿泊", "休憩", "その他"] as const;

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
  const [newSpot, setNewSpot] = useState<Partial<ItinerarySpot>>({
    time: "10:00",
    category: "観光",
  });
  const [destSearch, setDestSearch] = useState("");
  const [stickyNote, setStickyNote] = useState<{ dayIndex: number; text: string } | null>(null);

  // Add destination from URL params
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
          days: [
            {
              dayNumber: 1,
              spots: [
                {
                  destinationId: dest.id,
                  name: dest.name,
                  time: "10:00",
                  category: "観光",
                  note: dest.features[0]?.label,
                },
              ],
              memo: "",
            },
          ],
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
      days: [
        ...prev.days,
        { dayNumber: prev.days.length + 1, spots: [], memo: "" },
      ],
    }));
  };

  const removeDay = (dayIndex: number) => {
    if (itinerary.days.length <= 1) return;
    setItinerary((prev) => ({
      ...prev,
      days: prev.days
        .filter((_, i) => i !== dayIndex)
        .map((d, i) => ({ ...d, dayNumber: i + 1 })),
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
    (d) =>
      !destSearch ||
      d.name.includes(destSearch) ||
      d.area.includes(destSearch) ||
      d.prefecture.includes(destSearch)
  );

  const categoryColor: Record<string, string> = {
    観光: "bg-blue-100 text-blue-700",
    食事: "bg-orange-100 text-orange-700",
    移動: "bg-gray-100 text-gray-600",
    宿泊: "bg-purple-100 text-purple-700",
    休憩: "bg-green-100 text-green-700",
    その他: "bg-surface text-muted",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-accent text-sm font-medium mb-2">MY ITINERARY</p>
        {editingTitle ? (
          <input
            type="text"
            value={itinerary.title}
            onChange={(e) => setItinerary({ ...itinerary, title: e.target.value })}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
            autoFocus
            className="text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-accent outline-none w-full"
          />
        ) : (
          <h1
            className="text-3xl md:text-4xl font-bold cursor-pointer hover:text-accent transition-colors"
            onClick={() => setEditingTitle(true)}
          >
            {itinerary.title}
            <span className="text-base text-muted font-normal ml-3">✏️</span>
          </h1>
        )}
        <p className="text-muted mt-2">
          {itinerary.days.length}日間の旅 ·{" "}
          {itinerary.days.reduce((acc, d) => acc + d.spots.length, 0)}スポット
        </p>
      </div>

      {/* Days */}
      <div className="space-y-8">
        {itinerary.days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="bg-surface rounded-2xl p-6 md:p-8 relative"
          >
            {/* Day header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Day {day.dayNumber}</h2>
                {day.date && <p className="text-sm text-muted">{day.date}</p>}
              </div>
              <div className="flex gap-2">
                {itinerary.days.length > 1 && (
                  <button
                    onClick={() => removeDay(dayIndex)}
                    className="text-xs text-muted hover:text-red-500 px-3 py-1 rounded-full bg-background transition-colors"
                  >
                    削除
                  </button>
                )}
              </div>
            </div>

            {/* Timeline */}
            {day.spots.length > 0 ? (
              <div className="relative pl-8 border-l-2 border-border space-y-3 mb-6">
                {day.spots.map((spot, spotIndex) => (
                  <div key={spotIndex} className="relative group">
                    <div className="absolute -left-[25px] top-3 w-3 h-3 rounded-full bg-accent border-2 border-surface" />
                    <div className="bg-background rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-accent">{spot.time}</span>
                            {spot.category && (
                              <span className={`text-xs px-2 py-0.5 rounded ${categoryColor[spot.category] || ""}`}>
                                {spot.category}
                              </span>
                            )}
                          </div>
                          <p className="font-medium">{spot.name}</p>
                          {spot.duration && (
                            <p className="text-xs text-muted mt-0.5">{spot.duration}</p>
                          )}
                          {spot.note && (
                            <p className="text-xs text-muted mt-1 italic">{spot.note}</p>
                          )}
                          {spot.destinationId && (
                            <Link
                              href={`/destinations/${spot.destinationId}`}
                              className="text-xs text-accent hover:underline mt-1 inline-block"
                            >
                              詳しく見る →
                            </Link>
                          )}
                        </div>
                        <button
                          onClick={() => removeSpot(dayIndex, spotIndex)}
                          className="opacity-0 group-hover:opacity-100 text-xs text-muted hover:text-red-500 transition-all ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 mb-6 border-2 border-dashed border-border rounded-xl">
                <p className="text-muted text-sm">スポットを追加しよう</p>
              </div>
            )}

            {/* Add spot buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowAddSpot({ dayIndex });
                  setShowDestPicker(null);
                }}
                className="text-sm bg-background hover:bg-border px-4 py-2 rounded-full transition-colors"
              >
                + スポットを追加
              </button>
              <button
                onClick={() => {
                  setShowDestPicker({ dayIndex });
                  setShowAddSpot(null);
                }}
                className="text-sm bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-full transition-colors"
              >
                + 観光地から追加
              </button>
              <button
                onClick={() => setStickyNote({ dayIndex, text: day.memo || "" })}
                className="text-sm bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-4 py-2 rounded-full transition-colors"
              >
                📝 メモ
              </button>
            </div>

            {/* Add spot form */}
            {showAddSpot?.dayIndex === dayIndex && (
              <div className="mt-4 bg-background rounded-xl p-5 border border-border">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="time"
                    value={newSpot.time || "10:00"}
                    onChange={(e) => setNewSpot({ ...newSpot, time: e.target.value })}
                    className="bg-surface rounded-lg px-3 py-2 text-sm"
                  />
                  <select
                    value={newSpot.category || "観光"}
                    onChange={(e) => setNewSpot({ ...newSpot, category: e.target.value as ItinerarySpot["category"] })}
                    className="bg-surface rounded-lg px-3 py-2 text-sm"
                  >
                    {SPOT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="スポット名"
                  value={newSpot.name || ""}
                  onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })}
                  className="w-full bg-surface rounded-lg px-3 py-2 text-sm mb-2"
                />
                <input
                  type="text"
                  placeholder="メモ（任意）"
                  value={newSpot.note || ""}
                  onChange={(e) => setNewSpot({ ...newSpot, note: e.target.value })}
                  className="w-full bg-surface rounded-lg px-3 py-2 text-sm mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddSpot(dayIndex)}
                    className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                  >
                    追加
                  </button>
                  <button
                    onClick={() => setShowAddSpot(null)}
                    className="text-sm text-muted hover:text-foreground px-4 py-2"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            {/* Destination picker */}
            {showDestPicker?.dayIndex === dayIndex && (
              <div className="mt-4 bg-background rounded-xl p-5 border border-border max-h-80 overflow-y-auto">
                <input
                  type="text"
                  placeholder="観光地を検索..."
                  value={destSearch}
                  onChange={(e) => setDestSearch(e.target.value)}
                  className="w-full bg-surface rounded-lg px-3 py-2 text-sm mb-3"
                  autoFocus
                />
                <div className="space-y-1">
                  {filteredDests.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => handleAddDest(dayIndex, dest.id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-surface transition-colors"
                    >
                      <p className="font-medium text-sm">{dest.name}</p>
                      <p className="text-xs text-muted">{dest.area} · {dest.category[0]}</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowDestPicker(null)}
                  className="text-sm text-muted hover:text-foreground mt-2"
                >
                  閉じる
                </button>
              </div>
            )}

            {/* Memo (sticky note style) */}
            {day.memo && !stickyNote && (
              <div
                className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg cursor-pointer"
                onClick={() => setStickyNote({ dayIndex, text: day.memo || "" })}
              >
                <p className="text-sm text-yellow-800 whitespace-pre-line">{day.memo}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add day button */}
      <button
        onClick={addDay}
        className="w-full mt-6 py-4 border-2 border-dashed border-border rounded-2xl text-muted hover:text-foreground hover:border-accent transition-colors text-sm"
      >
        + Day {itinerary.days.length + 1} を追加
      </button>

      {/* Sticky note modal */}
      {stickyNote && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-6">
          <div className="bg-yellow-50 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="font-bold mb-3 text-yellow-800">
              Day {stickyNote.dayIndex + 1} のメモ
            </h3>
            <textarea
              value={stickyNote.text}
              onChange={(e) => setStickyNote({ ...stickyNote, text: e.target.value })}
              placeholder="持ち物、注意事項、やりたいこと..."
              rows={5}
              className="w-full bg-yellow-100/50 rounded-lg p-3 text-sm resize-none focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  updateMemo(stickyNote.dayIndex, stickyNote.text);
                  setStickyNote(null);
                }}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
              >
                保存
              </button>
              <button
                onClick={() => setStickyNote(null)}
                className="text-sm text-yellow-700 hover:text-yellow-900 px-4 py-2"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="mt-12 flex flex-wrap gap-4 justify-center pt-8 border-t border-border">
        <Link
          href="/destinations"
          className="text-sm bg-surface hover:bg-border px-6 py-3 rounded-full transition-colors"
        >
          観光地を探して追加
        </Link>
        <Link
          href="/result"
          className="text-sm bg-accent/10 text-accent hover:bg-accent/20 px-6 py-3 rounded-full transition-colors"
        >
          旅を提案してもらう
        </Link>
      </div>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
import { Suspense } from "react";

export default function ItineraryPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-6 py-12 text-muted">読み込み中...</div>}>
      <ItineraryEditor />
    </Suspense>
  );
}
