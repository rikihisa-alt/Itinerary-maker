"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useItinerary } from "@/store/itinerary";

export default function NewItineraryPage() {
  const router = useRouter();
  const store = useItinerary();
  const [title, setTitle] = useState("");
  const [days, setDays] = useState(2);

  const handleCreate = () => {
    store.reset();
    store.setTitle(title.trim() || "新しい旅のしおり");
    // reset already gives 1 day, add remaining
    for (let i = 1; i < days; i++) {
      store.addDay();
    }
    router.push("/itinerary");
  };

  return (
    <div className="pt-[80px] pb-[120px]">
      <div className="max-w-[440px] mx-auto px-[20px] md:px-[36px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[6px]">
            New Itinerary
          </p>
          <h1 className="serif text-[28px] md:text-[36px] font-bold tracking-[-0.02em] leading-[1.1] mb-[40px]">
            しおりを作る
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="space-y-[28px]"
        >
          {/* Title input */}
          <div>
            <label className="mono text-[10px] text-g3 mb-[6px] block">
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 京都2泊3日の旅"
              className="w-full bg-white border border-g2 rounded-[6px] px-[14px] py-[11px] text-[14px] focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Days selector */}
          <div>
            <label className="mono text-[10px] text-g3 mb-[8px] block">
              日数
            </label>
            <div className="flex gap-[6px]">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button
                  key={n}
                  onClick={() => setDays(n)}
                  className={`w-[44px] h-[44px] rounded-[6px] text-[14px] font-medium transition-all ${
                    days === n
                      ? "bg-accent text-white"
                      : "bg-white border border-g2 text-g4 hover:border-accent/30"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mono text-[10px] text-g3 mt-[6px]">
              {days}泊{days + 1 > days ? days - 1 : days}日
            </p>
          </div>

          {/* Create button */}
          <button
            onClick={handleCreate}
            className="w-full bg-accent text-white py-[13px] rounded-full text-[14px] font-medium hover:bg-accent/80 transition-colors active:scale-[0.98]"
          >
            作成する
          </button>
        </motion.div>
      </div>
    </div>
  );
}
