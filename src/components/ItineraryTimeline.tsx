"use client";

import { ItinerarySpot } from "@/types/itinerary";

const CAT_DOT: Record<string, string> = {
  観光: "bg-navy",
  食事: "bg-gold",
  移動: "bg-mute",
  宿泊: "bg-[#7b6b8a]",
  休憩: "bg-[#6b8a6b]",
  その他: "bg-dim",
};

export function TimelineSpot({
  spot,
  onRemove,
}: {
  spot: ItinerarySpot;
  onRemove?: () => void;
}) {
  const dot = CAT_DOT[spot.category || "その他"] || "bg-dim";

  return (
    <div className="group flex gap-[20px] relative">
      {/* Left: time */}
      <div className="w-[52px] shrink-0 text-right pt-[2px]">
        <span className="font-[--mono] text-[13px] font-medium text-dark">{spot.time}</span>
      </div>

      {/* Center: line + dot */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-[10px] h-[10px] rounded-full ${dot} border-[2px] border-off z-10`} />
        <div className="w-[1px] flex-1 bg-warm" />
      </div>

      {/* Right: content */}
      <div className="flex-1 pb-[24px] -mt-[2px]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[14px] font-medium text-dark">{spot.name}</p>
            <div className="flex items-center gap-[8px] mt-[2px]">
              {spot.category && (
                <span className="text-[11px] text-dim">{spot.category}</span>
              )}
              {spot.duration && (
                <span className="text-[11px] text-mute font-[--mono]">{spot.duration}</span>
              )}
            </div>
            {spot.note && (
              <p className="text-[12px] text-mute mt-[4px] italic">{spot.note}</p>
            )}
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              className="opacity-0 group-hover:opacity-100 text-[11px] text-mute hover:text-[#c45d3e] transition-all ml-[8px]"
            >
              削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
