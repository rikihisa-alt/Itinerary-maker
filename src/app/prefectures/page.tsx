"use client";

import Link from "next/link";
import Image from "next/image";
import { getAllPrefectures, getSpotCountForPrefecture } from "@/lib/contentLoader";
import { REGIONS } from "@/types/prefecture";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function PrefecturesPage() {
  const prefectures = getAllPrefectures();

  const grouped = REGIONS.map((region) => ({
    ...region,
    prefectures: prefectures.filter((p) => p.regionId === region.id),
  }));

  return (
    <div className="pt-[80px] pb-[120px]">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px]">

        {/* ── Page header ── */}
        <div className="mb-[48px]">
          <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[6px]">
            Prefectures
          </p>
          <h1 className="serif text-[36px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.1]">
            都道府県
          </h1>
        </div>

        {/* ── Region groups ── */}
        <div className="space-y-[64px]">
          {grouped.map((region) => {
            const isKinki = region.id === "kinki";

            return (
              <section key={region.id}>
                <SectionHeading
                  label={region.id.charAt(0).toUpperCase() + region.id.slice(1)}
                  title={region.name}
                />

                <div
                  className={
                    isKinki
                      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]"
                      : "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-[10px]"
                  }
                >
                  {region.prefectures.map((pref) => {
                    const spotCount = getSpotCountForPrefecture(pref.id);
                    const hasSpots = spotCount > 0;
                    const hasCover = !!pref.coverImage;

                    if (isKinki) {
                      return (
                        <Link
                          key={pref.id}
                          href={`/prefectures/${pref.id}`}
                          className="group block rounded-[8px] overflow-hidden outline outline-1 outline-g2/40 bg-white hover:outline-accent/40 transition-all"
                        >
                          <div className="relative aspect-[4/3]">
                            {hasCover ? (
                              <Image
                                src={pref.coverImage}
                                alt={pref.name}
                                fill
                                className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.04]"
                                sizes="(max-width:768px) 50vw, 25vw"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-g1" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-[14px] z-10">
                              <h3 className="serif text-[18px] md:text-[22px] text-white font-bold leading-[1.2] group-hover:text-gold transition-colors">
                                {pref.name}
                              </h3>
                              <p className="mono text-[10px] text-white/40 mt-[2px]">
                                {spotCount} spots
                              </p>
                            </div>
                          </div>
                          {pref.description && (
                            <div className="px-[14px] py-[10px]">
                              <p className="text-[12px] text-g4 leading-[1.7] line-clamp-2">
                                {pref.description}
                              </p>
                            </div>
                          )}
                        </Link>
                      );
                    }

                    /* ── Non-Kinki: compact card ── */
                    if (hasSpots) {
                      return (
                        <Link
                          key={pref.id}
                          href={`/prefectures/${pref.id}`}
                          className="group block rounded-[6px] overflow-hidden outline outline-1 outline-g2/30 bg-white hover:outline-accent/30 transition-all"
                        >
                          <div className="relative aspect-[4/3]">
                            {hasCover ? (
                              <Image
                                src={pref.coverImage}
                                alt={pref.name}
                                fill
                                className="object-cover"
                                sizes="120px"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-g1" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          </div>
                          <div className="px-[8px] py-[6px]">
                            <h3 className="serif text-[13px] font-bold leading-[1.2] group-hover:text-accent transition-colors truncate">
                              {pref.name}
                            </h3>
                            <p className="mono text-[9px] text-g3">
                              {spotCount} spots
                            </p>
                          </div>
                        </Link>
                      );
                    }

                    /* ── No spots: grayed "coming soon" ── */
                    return (
                      <div
                        key={pref.id}
                        className="rounded-[6px] overflow-hidden outline outline-1 outline-g1/60 bg-g1/30 opacity-50"
                      >
                        <div className="relative aspect-[4/3] bg-g1" />
                        <div className="px-[8px] py-[6px]">
                          <h3 className="serif text-[13px] font-bold leading-[1.2] text-g3 truncate">
                            {pref.name}
                          </h3>
                          <p className="mono text-[9px] text-g3">coming soon</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
