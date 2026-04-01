"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getAllSpots } from "@/lib/contentLoader";
import { Intro } from "@/components/Intro";
import { HorizontalGallery } from "@/components/HorizontalGallery";
import { RevealText, SlideIn } from "@/components/RevealText";
import { ParallaxImage } from "@/components/ParallaxImage";

const HERO = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1800&q=80";

export default function Home() {
  const spots = getAllSpots();
  const [introDone, setIntroDone] = useState(false);
  const onDone = useCallback(() => setIntroDone(true), []);

  return (
    <>
      {!introDone && <Intro onDone={onDone} />}

      {/* ═══ 01 HERO ═══ */}
      <section className="relative h-[100vh] min-h-[600px] overflow-hidden">
        <Image src={HERO} alt="" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        {/* noise */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        <div className="relative h-full max-w-[1440px] mx-auto px-[20px] md:px-[48px] flex flex-col justify-end pb-[60px] md:pb-[88px]">
          {introDone && (
            <>
              <RevealText>
                <h1 className="serif text-[42px] md:text-[60px] lg:text-[80px] font-bold text-white leading-[1.08] tracking-[-0.03em]">
                  まだ知らない景色へ。
                </h1>
              </RevealText>
              <RevealText delay={0.15}>
                <p className="text-[14px] text-white/35 max-w-[340px] leading-[1.8] mt-[16px] mb-[32px]">
                  あなたに刺さる旅先を見つけて、そのまま旅のしおりを作る。
                </p>
              </RevealText>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
                <Link href="/destinations"
                  className="inline-block bg-gold text-white px-[32px] py-[14px] rounded-full text-[14px] font-medium hover:bg-[#a68840] transition-colors active:scale-[0.97]">
                  旅に出る
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* ═══ 02 横スクロール ═══ */}
      <div className="pt-[120px] pb-[80px]">
        <HorizontalGallery items={spots.slice(0, 7)} title="ここが、刺さる。" />
      </div>

      {/* ═══ 03 非対称 — 左テキスト + 右パララックス画像 ═══ */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] md:gap-[48px] items-center">
          <div className="md:col-span-4">
            <SlideIn direction="left">
              <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[10px]">{spots[3].area}</p>
              <h2 className="serif text-[26px] md:text-[32px] font-bold tracking-[-0.01em] leading-[1.25] mb-[14px]">{spots[3].title}</h2>
              <p className="text-[14px] text-g5 leading-[1.9] mb-[20px]">{spots[3].description}</p>
              <Link href={`/destinations/${spots[3].id}`} className="mono text-[12px] text-accent hover:underline">詳しく見る →</Link>
            </SlideIn>
          </div>
          <div className="md:col-span-8">
            <SlideIn direction="right" delay={0.1}>
              <ParallaxImage src={spots[3].images[0]} alt={spots[3].title} aspect="16/10" />
            </SlideIn>
          </div>
        </div>
      </section>

      {/* ═══ 04 2カラム非対称グリッド ═══ */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[88px]">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-[14px]">
          <Link href={`/destinations/${spots[0].id}`} className="group block relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40" style={{ aspectRatio: "4/3" }}>
            <Image src={spots[0].images[0]} alt={spots[0].title} fill className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" sizes="60vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 p-[24px] md:p-[36px] z-10">
              <p className="mono text-[10px] text-white/40 tracking-wider uppercase mb-[4px]">{spots[0].area}</p>
              <h3 className="serif text-[24px] md:text-[32px] text-white font-bold leading-[1.2]">{spots[0].title}</h3>
              <p className="text-[13px] text-white/35 mt-[8px] max-w-[360px]">{spots[0].description}</p>
            </div>
          </Link>
          <div className="flex flex-col gap-[14px]">
            {spots.slice(1, 3).map((s) => (
              <Link key={s.id} href={`/destinations/${s.id}`} className="group block relative rounded-[8px] overflow-hidden flex-1 outline outline-1 outline-g2/40" style={{ minHeight: "180px" }}>
                <Image src={s.images[0]} alt={s.title} fill className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" sizes="30vw" />
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

      {/* ═══ 05 CTA ═══ */}
      <section className="bg-accent text-white">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] py-[80px] md:py-[110px]">
          <RevealText>
            <p className="mono text-[10px] tracking-[0.2em] uppercase text-white/25 mb-[14px]">Itinerary</p>
          </RevealText>
          <RevealText delay={0.1}>
            <h2 className="serif text-[28px] md:text-[40px] font-bold leading-[1.2] tracking-[-0.02em] mb-[14px] max-w-[480px]">
              気になった場所、しおりに並べよう。
            </h2>
          </RevealText>
          <RevealText delay={0.2}>
            <p className="text-[13px] text-white/30 leading-[1.8] mb-[32px] max-w-[400px]">
              観光地を選んで、日付に割り当てるだけ。あなただけの旅の計画が完成する。
            </p>
          </RevealText>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }}>
            <Link href="/itinerary" className="inline-block bg-white text-accent px-[28px] py-[12px] rounded-full text-[13px] font-medium hover:bg-white/90 transition-colors active:scale-[0.97]">
              しおりを作る
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ 06 フル幅バナー — パララックス ═══ */}
      <div className="pt-[100px] pb-[80px] px-[20px] md:px-[48px]">
        <Link href={`/destinations/${spots[5].id}`} className="group block relative">
          <ParallaxImage src={spots[5].images[0]} alt={spots[5].title} aspect="21/9" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent rounded-[8px] z-10" />
          <div className="absolute bottom-0 left-0 p-[24px] md:p-[48px] z-20 max-w-[440px]">
            <p className="mono text-[10px] text-white/30 tracking-wider uppercase mb-[6px]">{spots[5].area}</p>
            <h2 className="serif text-[22px] md:text-[36px] text-white font-bold leading-[1.2] group-hover:text-gold transition-colors">{spots[5].title}</h2>
            <p className="text-[12px] text-white/35 mt-[8px]">{spots[5].description}</p>
          </div>
        </Link>
      </div>

      {/* ═══ 07 2つ目の横スクロール ═══ */}
      <div className="pb-[110px]">
        <HorizontalGallery items={spots.slice(5, 12)} title="もうひとつの選択肢。" />
      </div>

      {/* ═══ 08 余白テキスト ═══ */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[100px]">
        <div className="border-t border-g1 pt-[56px] max-w-[400px]">
          <SlideIn direction="up">
            <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[10px]">About</p>
            <p className="text-[14px] text-g5 leading-[2]">
              「旅のしおり」は、近畿の観光地を探して、自分だけの旅の計画を作るサービス。
              情報を並べるのではなく、体験として届ける。
            </p>
          </SlideIn>
        </div>
      </section>
    </>
  );
}
