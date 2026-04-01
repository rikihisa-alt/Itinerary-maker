"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Spot } from "@/types/destination";
import { SlideIn } from "@/components/RevealText";

export function DetailClient({ spot: s, nearby }: { spot: Spot; nearby: Spot[] }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const crowd = s.crowdLevel === "low" ? "低い" : s.crowdLevel === "medium" ? "ふつう" : "高い";

  return (
    <div>
      {/* Hero — parallax fullscreen */}
      <section ref={heroRef} className="relative h-[75vh] min-h-[400px] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <Image src={s.images[0]} alt={s.title} fill className="object-cover" priority sizes="100vw" />
        </motion.div>
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <motion.div style={{ opacity: heroOpacity }}
          className="relative h-full max-w-[1440px] mx-auto px-[20px] md:px-[48px] flex flex-col justify-end pb-[48px] md:pb-[64px]">
          <p className="mono text-[10px] tracking-[0.15em] uppercase text-white/30 mb-[10px]">
            <Link href="/destinations" className="hover:text-white/60 transition-colors">Destinations</Link>
            <span className="mx-[5px]">/</span>{s.area}
          </p>
          <h1 className="serif text-[38px] md:text-[60px] lg:text-[76px] text-white font-bold leading-[1.08] tracking-[-0.03em] mb-[10px]">{s.title}</h1>
          <p className="text-[14px] text-white/40 max-w-[420px]">{s.description}</p>
        </motion.div>
      </section>

      <div className="max-w-[720px] mx-auto px-[20px] md:px-[36px]">
        {/* Info — slide in from left */}
        <SlideIn direction="left">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[20px] gap-y-[14px] py-[28px] border-b border-g1 mb-[64px]">
            {[
              { l: "滞在目安", v: `${s.stayDuration}分` },
              { l: "混雑度", v: crowd },
              { l: "ベスト", v: s.bestTime },
              { l: "雨天", v: s.rainyDay ? "OK" : "不向き" },
              { l: "予算", v: s.budget },
              { l: "アクセス", v: s.access },
            ].map((x) => (
              <div key={x.l}>
                <p className="text-[10px] text-g3 mb-[1px]">{x.l}</p>
                <p className="text-[13px] font-medium">{x.v}</p>
              </div>
            ))}
          </div>
        </SlideIn>

        {/* 2nd image parallax */}
        {s.images[1] && (
          <SlideIn direction="up" className="mb-[64px]">
            <div className="relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40" style={{ aspectRatio: "16/9" }}>
              <Image src={s.images[1]} alt={`${s.title} 2`} fill className="object-cover" sizes="720px" />
            </div>
          </SlideIn>
        )}

        {/* 概要 */}
        <SlideIn direction="up" className="mb-[72px]">
          <h2 className="serif text-[24px] font-bold mb-[20px]">概要</h2>
          <p className="text-[15px] leading-[2.2] text-g5">{s.longDescription}</p>
        </SlideIn>

        {/* 見どころ — 主役+脇役 */}
        <section className="mb-[72px]">
          <SlideIn direction="left">
            <h2 className="serif text-[24px] font-bold mb-[28px]">見どころ</h2>
          </SlideIn>
          <div className="space-y-[14px]">
            {s.features.map((f, i) => (
              <SlideIn key={f.label} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.08}>
                <div className={i === 0
                  ? "bg-accent text-white rounded-[8px] p-[26px] md:p-[34px]"
                  : "border-b border-g1 pb-[18px]"
                }>
                  <p className={`mono text-[10px] mb-[4px] ${i === 0 ? "text-gold" : "text-g3"}`}>{String(i + 1).padStart(2, "0")}</p>
                  <h3 className={`serif font-bold mb-[6px] ${i === 0 ? "text-[22px]" : "text-[17px]"}`}>{f.label}</h3>
                  <p className={`text-[13px] leading-[1.9] ${i === 0 ? "text-white/50" : "text-g4"}`}>{f.text}</p>
                </div>
              </SlideIn>
            ))}
          </div>
        </section>

        {/* Tags + highlights */}
        <SlideIn direction="up" className="mb-[56px]">
          <div className="flex flex-wrap gap-[6px]">
            {s.highlights.map((h) => (
              <span key={h} className="text-[12px] border border-g2 px-[12px] py-[5px] rounded-full">{h}</span>
            ))}
            {s.tags.map((t) => (
              <span key={t} className="text-[11px] bg-g1 px-[10px] py-[4px] rounded-full text-g5">{t}</span>
            ))}
          </div>
        </SlideIn>

        {/* Nearby */}
        {nearby.length > 0 && (
          <section className="mb-[56px]">
            <h2 className="serif text-[22px] font-bold mb-[20px]">周辺スポット</h2>
            <div className="space-y-[12px]">
              {nearby.map((n, i) => (
                <SlideIn key={n.id} direction="right" delay={i * 0.08}>
                  <Link href={`/destinations/${n.id}`} className="group flex gap-[14px] items-center">
                    <div className="w-[72px] h-[72px] rounded-[6px] overflow-hidden shrink-0 relative outline outline-1 outline-g2/30">
                      <Image src={n.images[0]} alt={n.title} fill className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.08]" sizes="72px" />
                    </div>
                    <div>
                      <p className="mono text-[10px] text-g3">{n.area}</p>
                      <h3 className="serif text-[16px] font-bold group-hover:text-accent transition-colors">{n.title}</h3>
                      <p className="text-[12px] text-g4 line-clamp-1">{n.description}</p>
                    </div>
                  </Link>
                </SlideIn>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
          className="border-t border-g1 pt-[36px] pb-[80px]">
          <p className="text-[12px] text-g4 mb-[14px]">{s.title}が気になったら</p>
          <Link href={`/itinerary?add=${s.id}`}
            className="inline-block bg-accent text-white px-[26px] py-[11px] rounded-full text-[13px] font-medium hover:bg-accent/80 transition-colors active:scale-[0.97]">
            しおりに追加する
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
