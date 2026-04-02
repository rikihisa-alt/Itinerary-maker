"use client";

import Link from "next/link";
import Image from "next/image";
import { Spot, SPOT_CATEGORY_LABEL } from "@/types/spot";
import { useItinerary } from "@/store/itinerary";

export function SpotCardHero({ spot: s }: { spot: Spot }) {
  return (
    <Link href={`/destinations/${s.id}`} className="group block relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40" style={{ aspectRatio: "21/9" }}>
      <Image src={s.images[0]} alt={s.title} fill className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]" sizes="95vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-[20px] md:p-[40px] z-10 max-w-[440px]">
        <p className="mono text-[10px] text-white/40 tracking-wider uppercase mb-[4px]">{s.area} · {SPOT_CATEGORY_LABEL[s.category]}</p>
        <h2 className="serif text-[22px] md:text-[36px] text-white font-bold leading-[1.15] group-hover:text-gold transition-colors">{s.title}</h2>
        <p className="text-[12px] text-white/35 mt-[6px] line-clamp-2">{s.description}</p>
      </div>
    </Link>
  );
}

export function SpotCardMedium({ spot: s, aspect = "4/3" }: { spot: Spot; aspect?: string }) {
  return (
    <Link href={`/destinations/${s.id}`} className="group block relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40 h-full" style={{ aspectRatio: aspect, minHeight: "200px" }}>
      <Image src={s.images[0]} alt={s.title} fill className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" sizes="50vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-0 p-[16px] md:p-[20px] z-10 translate-y-[6px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[300ms] delay-[100ms]">
        <div className="bg-black/30 backdrop-blur-sm rounded-[6px] p-[10px]">
          <p className="mono text-[10px] text-white/40">{s.area}</p>
          <p className="serif text-[15px] text-white font-bold">{s.title}</p>
        </div>
      </div>
      <div className="absolute top-[12px] left-[12px] z-10">
        <p className="serif text-[15px] text-white/80 font-bold drop-shadow-lg">{s.title}</p>
      </div>
    </Link>
  );
}

export function SpotCardList({ spot: s }: { spot: Spot }) {
  const store = useItinerary();
  return (
    <div className="group flex items-center gap-[14px] md:gap-[18px] py-[14px] border-b border-g1/60 hover:bg-white/40 transition-colors">
      <Link href={`/destinations/${s.id}`} className="flex items-center gap-[14px] md:gap-[18px] flex-1 min-w-0">
        <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-[6px] overflow-hidden shrink-0 relative outline outline-1 outline-g2/30">
          <Image src={s.images[0]} alt={s.title} fill className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.08]" sizes="64px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="mono text-[10px] text-g3 mb-[1px]">{s.area} · {SPOT_CATEGORY_LABEL[s.category]}</p>
          <h3 className="serif text-[15px] font-bold group-hover:text-accent transition-colors truncate">{s.title}</h3>
        </div>
      </Link>
      <div className="text-right shrink-0 hidden sm:block">
        <p className="mono text-[10px] text-g3">{s.stayDuration}min</p>
        <p className="text-[10px] text-g3">{s.budget}</p>
      </div>
      <button
        onClick={() => store.addSpot(0, { spotId: s.id, name: s.title, time: "10:00", type: "sightseeing" })}
        className="shrink-0 text-[10px] text-accent border border-accent/20 px-[8px] py-[3px] rounded-full hover:bg-accent/5 transition-colors opacity-0 group-hover:opacity-100"
      >
        +しおり
      </button>
    </div>
  );
}
