"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllSpots } from "@/lib/contentLoader";
import { Intro } from "@/components/Intro";
import { HorizontalGallery } from "@/components/HorizontalGallery";

const HERO_IMG = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1800&q=80";

export default function Home() {
  const spots = getAllSpots();
  const [showIntro, setShowIntro] = useState(true);
  const handleIntroComplete = useCallback(() => setShowIntro(false), []);

  return (
    <>
      {showIntro && <Intro onComplete={handleIntroComplete} />}

      {/* ▌01 HERO — 90vh, 実写背景 */}
      <section className="relative h-[90vh] min-h-[600px] bg-ink overflow-hidden">
        <Image src={HERO_IMG} alt="京都の街並み" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black/70 to-transparent" />

        <div className="relative h-full max-w-[1440px] mx-auto px-[20px] md:px-[48px] flex flex-col justify-end pb-[56px] md:pb-[80px]">
          <div className={showIntro ? "opacity-0" : "afade"}>
            <h1 className="serif text-[40px] md:text-[56px] lg:text-[72px] font-bold text-white leading-[1.12] tracking-[-0.03em] mb-[14px]">
              まだ知らない景色へ。
            </h1>
            <p className="text-[14px] text-white/40 max-w-[320px] leading-[1.8] mb-[28px]">
              条件を入れるだけで、あなたに刺さる旅先を提案する。
            </p>
            <Link href="/destinations"
              className="inline-block bg-gold text-white px-[28px] py-[12px] rounded-full text-[13px] font-medium hover:bg-[#b8944e] transition-colors">
              旅に出る
            </Link>
          </div>
        </div>
      </section>

      {/* ▌02 横スクロール — バラバラ幅, 実写 */}
      <div className="pt-[100px] pb-[72px]">
        <HorizontalGallery items={spots.slice(0, 7)} title="ここが、刺さる。" />
      </div>

      {/* ▌03 非対称グリッド — 2fr/1fr, 実写 */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[88px]">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-[14px]">
          {spots[0] && (
            <Link href={`/destinations/${spots[0].id}`} className="group block relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40" style={{ aspectRatio: "4/3" }}>
              <Image src={spots[0].images[0]} alt={spots[0].title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.05]" sizes="60vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 p-[24px] md:p-[36px] z-10">
                <p className="mono text-[10px] text-white/40 tracking-[0.12em] uppercase mb-[4px]">{spots[0].area}</p>
                <h3 className="serif text-[24px] md:text-[32px] text-white font-bold leading-[1.2]">{spots[0].title}</h3>
                <p className="text-[13px] text-white/40 mt-[8px] max-w-[360px]">{spots[0].description}</p>
              </div>
            </Link>
          )}
          <div className="flex flex-col gap-[14px]">
            {spots.slice(1, 3).map((s) => (
              <Link key={s.id} href={`/destinations/${s.id}`} className="group block relative rounded-[8px] overflow-hidden flex-1 outline outline-1 outline-g2/40" style={{ minHeight: "180px" }}>
                <Image src={s.images[0]} alt={s.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.05]" sizes="30vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 p-[18px] z-10">
                  <p className="mono text-[10px] text-white/40">{s.area}</p>
                  <h3 className="serif text-[18px] text-white font-bold">{s.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ▌04 CTA */}
      <section className="bg-accent text-white">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] py-[72px] md:py-[100px]">
          <div className="max-w-[480px]">
            <p className="mono text-[10px] tracking-[0.2em] uppercase text-white/25 mb-[14px]">Itinerary</p>
            <h2 className="serif text-[26px] md:text-[36px] font-bold leading-[1.2] tracking-[-0.02em] mb-[14px]">
              気になった場所、<br />しおりに並べよう。
            </h2>
            <p className="text-[13px] text-white/30 leading-[1.8] mb-[28px]">
              観光地を選んで、日付に割り当てるだけ。あなただけの旅の計画が完成する。
            </p>
            <Link href="/itinerary" className="inline-block bg-white text-accent px-[28px] py-[12px] rounded-full text-[13px] font-medium hover:bg-white/90 transition-colors">
              しおりを作る
            </Link>
          </div>
        </div>
      </section>

      {/* ▌05 フル幅バナー — 実写 */}
      {spots[4] && (
        <section className="pt-[88px] pb-[72px]">
          <Link href={`/destinations/${spots[4].id}`} className="group block mx-[20px] md:mx-[48px] relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40" style={{ aspectRatio: "21/9" }}>
            <Image src={spots[4].images[0]} alt={spots[4].title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="95vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-[24px] md:p-[44px] z-10 max-w-[440px]">
              <p className="mono text-[10px] text-white/30 tracking-wider uppercase mb-[6px]">{spots[4].area}</p>
              <h2 className="serif text-[22px] md:text-[32px] text-white font-bold leading-[1.2] group-hover:text-gold transition-colors">{spots[4].title}</h2>
              <p className="text-[12px] text-white/35 mt-[6px]">{spots[4].description}</p>
            </div>
          </Link>
        </section>
      )}

      {/* ▌06 2つ目の横スクロール */}
      <div className="pb-[100px]">
        <HorizontalGallery items={spots.slice(5, 12)} title="もうひとつの選択肢。" />
      </div>

      {/* ▌07 テキストだけの余白セクション */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[100px]">
        <div className="border-t border-g1 pt-[56px] max-w-[400px]">
          <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[10px]">About</p>
          <p className="text-[14px] text-g5 leading-[2]">
            「旅のしおり」は、近畿の観光地を探して、自分だけの旅の計画を作るサービス。
            情報を並べるのではなく、体験として届ける。
          </p>
        </div>
      </section>
    </>
  );
}
