"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { getAllSpots, getAllArticles, getKinkiPrefectures, getSpotCountForPrefecture } from "@/lib/contentLoader";
import { Intro } from "@/components/Intro";
import { HorizontalGallery } from "@/components/HorizontalGallery";
import { ARTICLE_CATEGORY_LABEL } from "@/types/article";

export default function Home() {
  const spots = getAllSpots();
  const articles = getAllArticles();
  const kinkiPrefs = getKinkiPrefectures();
  const [introDone, setIntroDone] = useState(false);
  const onDone = useCallback(() => setIntroDone(true), []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <>
      {!introDone && <Intro onDone={onDone} />}

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative h-[100dvh] min-h-[640px] overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=2000&q=85" alt="" fill className="object-cover" priority sizes="100vw" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <motion.div style={{ opacity: heroOpacity }}
          className="absolute bottom-[56px] md:bottom-[88px] left-[20px] md:left-[48px] lg:left-[96px] max-w-[800px] z-10 text-white">
          {introDone && (
            <>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
                className="mono text-[10px] md:text-[12px] tracking-[0.3em] font-light mb-[20px] opacity-80 uppercase">
                Itinerary Craft
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="serif text-[44px] md:text-[60px] lg:text-[80px] leading-[1.1] mb-[28px] font-light tracking-wide">
                旅のしおり屋さん
              </motion.h1>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
                <div className="w-[64px] h-[1.5px] bg-gold mb-[28px]" />
                <p className="serif text-[18px] md:text-[24px] font-light tracking-wide mb-[36px] opacity-90">
                  あなたの旅を、しおりにする。
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-[14px]">
                <Link href="/create" className="inline-flex items-center justify-center bg-gold text-accent font-medium px-[32px] py-[14px] rounded-full hover:bg-[#a3864a] transition-colors text-[14px]">
                  しおりを作る
                </Link>
                <Link href="/destinations" className="inline-flex items-center justify-center border border-white/40 text-white font-medium px-[32px] py-[14px] rounded-full hover:bg-white/10 hover:border-white transition-colors text-[14px]">
                  スポットを探す
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </section>

      {/* ═══ HORIZONTAL GALLERY (10枚) ═══ */}
      <div className="pt-[96px] md:pt-[140px] pb-[60px]">
        <HorizontalGallery items={spots.slice(0, 10)} title="綴られた記憶" />
      </div>

      {/* ═══ ASYMMETRIC FEATURE (30/70) ═══ */}
      <section className="py-[80px] px-[20px] md:px-[48px] lg:px-[96px]">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-[40px] lg:gap-[96px] items-center">
          <div className="lg:col-span-3 flex flex-col justify-center order-2 lg:order-1 pt-[24px] lg:pt-0">
            <span className="mono text-[12px] tracking-[0.2em] text-g4 mb-[20px] uppercase block">The Philosophy</span>
            <h2 className="serif text-[24px] md:text-[32px] leading-[1.4] text-accent mb-[24px] font-light max-w-[320px]">
              余白のある旅が、心を豊かにする。
            </h2>
            <div className="w-full h-[1px] bg-g2 mb-[24px]" />
            <p className="text-[14px] md:text-[15px] leading-[1.9] text-g5 mb-[32px] tracking-wide">
              分刻みのスケジュールに追われるのではなく、その土地の空気を感じるための「余白」を設計する。Itinerary Craftが提案するのは、ただ目的地を巡るだけではない、物語のある旅の形です。
            </p>
            <Link href="/destinations" className="text-[14px] font-medium text-accent group flex items-center gap-[10px] w-fit">
              <span className="border-b border-accent pb-[2px] group-hover:opacity-70 transition-opacity">スポットを見る</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-[2px] transition-transform"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2 overflow-hidden rounded-[4px]" style={{ aspectRatio: "16/10" }}>
            <Link href={`/destinations/${spots[3]?.id}`} className="group block relative w-full h-full">
              <Image src={spots[3]?.images[0] || ""} alt={spots[3]?.title || ""} fill
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.05]" sizes="70vw" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ NAVY CTA SECTION ═══ */}
      <section className="relative bg-accent text-bg overflow-hidden mt-[48px] mb-[96px] noise">
        <div className="relative z-10 px-[20px] md:px-[48px] lg:px-[96px] py-[100px] md:py-[140px] grid grid-cols-1 lg:grid-cols-2 gap-[48px] lg:gap-[100px] items-center">
          <div>
            <h2 className="serif text-[28px] md:text-[44px] leading-[1.3] text-bg mb-[32px] font-light">
              条件を入れるだけで、<br />旅のしおりが完成する。
            </h2>
            <div className="w-[48px] h-[1px] bg-gold mb-[32px]" />
            <p className="text-[15px] leading-[2] text-g1 mb-[40px] max-w-[440px] font-light">
              行き先、予算、そしてどんな気分で過ごしたいか。いくつかの質問に答えるだけで、プロのキュレーターが構成したような美しい旅のしおりが生成されます。
            </p>
            <div className="flex flex-col sm:flex-row gap-[16px]">
              <Link href="/create" className="bg-gold text-accent font-medium px-[32px] py-[14px] rounded-full hover:bg-[#a3864a] transition-all text-[14px] text-center shadow-[0_0_20px_rgba(184,154,90,0.2)] hover:shadow-[0_0_30px_rgba(184,154,90,0.4)]">
                しおりを作成する
              </Link>
              <Link href="/itinerary" className="border border-white/30 text-white font-medium px-[32px] py-[14px] rounded-full hover:bg-white/5 transition-all text-[14px] text-center">
                サンプルのしおりを見る
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-[16px] p-[32px] md:p-[40px] relative overflow-hidden">
              <div className="absolute -top-[96px] -right-[96px] w-[256px] h-[256px] bg-gold/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-[28px]">
                {[
                  { n: "01", q: "目的地の選択", d: "訪れたい都道府県やエリアを選びます。" },
                  { n: "02", q: "条件の設定", d: "日程、移動手段、予算感などを入力します。" },
                  { n: "03", q: "こだわりの追加", d: "「温泉に入りたい」「絶景が見たい」などの気分を追加。" },
                  { n: "04", q: "ルートの自動生成", d: "最適な移動時間と滞在時間を計算し、旅程を組み上げます。" },
                  { n: "05", q: "しおりの完成", d: "美しいデザインのデジタルしおりが発行されます。" },
                ].map((item, i) => (
                  <div key={i}>
                    {i > 0 && <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent mb-[28px]" />}
                    <div className="flex items-start gap-[20px] group">
                      <span className="mono text-[12px] text-gold tracking-[0.15em] mt-[2px] opacity-60 group-hover:opacity-100 transition-opacity">{item.n}</span>
                      <div>
                        <h4 className={`text-[15px] font-medium mb-[4px] ${i === 4 ? "text-gold" : "text-white"}`}>{item.q}</h4>
                        <p className="text-[13px] text-g3 leading-[1.7]">{item.d}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ASYMMETRIC GRID ═══ */}
      <section className="py-[80px] px-[20px] md:px-[48px] lg:px-[96px]">
        <div className="text-center mb-[48px]">
          <h3 className="serif text-[28px] md:text-[32px] text-accent mb-[12px] font-light">見逃せない情景</h3>
          <div className="w-[40px] h-[1px] bg-g2 mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[12px] lg:gap-[16px]">
          {spots[0] && (
            <Link href={`/destinations/${spots[0].id}`} className="lg:col-span-2 relative group overflow-hidden block rounded-[4px]" style={{ aspectRatio: "16/10" }}>
              <Image src={spots[0].images[0]} alt={spots[0].title} fill className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]" sizes="65vw" />
              <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)" }} />
              <div className="absolute bottom-0 left-0 w-full p-[24px] lg:p-[40px] z-20">
                <span className="mono text-[10px] text-gold tracking-[0.2em] uppercase mb-[8px] block">{spots[0].area}</span>
                <h4 className="serif text-[24px] lg:text-[32px] text-white font-light group-hover:-translate-y-[6px] transition-transform duration-500">{spots[0].title}</h4>
              </div>
            </Link>
          )}
          <div className="flex flex-col gap-[12px] lg:gap-[16px] h-full">
            {[spots[1], spots[2]].filter(Boolean).map((s) => s && (
              <Link key={s.id} href={`/destinations/${s.id}`} className="relative group overflow-hidden block rounded-[4px] flex-1" style={{ minHeight: "250px" }}>
                <Image src={s.images[0]} alt={s.title} fill className="object-cover transition-transform duration-[700ms] group-hover:scale-[1.05]" sizes="30vw" />
                <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)" }} />
                <div className="absolute bottom-0 left-0 w-full p-[20px] lg:p-[28px] z-20">
                  <span className="mono text-[10px] text-white/70 tracking-[0.2em] uppercase mb-[6px] block">{s.area}</span>
                  <h4 className="serif text-[18px] text-white font-light group-hover:-translate-y-[4px] transition-transform duration-500">{s.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ARTICLES ═══ */}
      <section className="py-[100px] px-[20px] md:px-[48px] lg:px-[96px]">
        <h3 className="mono text-[12px] tracking-[0.2em] text-g4 mb-[28px] uppercase text-center md:text-left">Selected Articles</h3>

        {articles[0] && (
          <Link href={`/articles/${articles[0].slug}`} className="group block overflow-hidden rounded-[4px]">
            <div className="grid lg:grid-cols-2 bg-accent text-white">
              <div className="relative w-full h-[300px] lg:h-[450px]">
                <Image src={articles[0].coverImage} alt={articles[0].title} fill className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]" sizes="50vw" />
              </div>
              <div className="p-[28px] lg:p-[56px] flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10">
                <div className="flex items-center gap-[12px] mb-[20px]">
                  <span className="px-[10px] py-[3px] border border-gold/40 text-gold text-[10px] rounded-full">{ARTICLE_CATEGORY_LABEL[articles[0].category]}</span>
                  <span className="mono text-[11px] text-white/50 tracking-[0.15em]">{articles[0].publishedAt}</span>
                </div>
                <h4 className="serif text-[22px] md:text-[28px] font-light mb-[16px] leading-[1.5] group-hover:text-gold transition-colors duration-500">
                  {articles[0].title}
                </h4>
                <p className="text-[13px] text-g3 leading-[1.8] line-clamp-2">{articles[0].description}</p>
              </div>
            </div>
          </Link>
        )}

        <div className="flex flex-col mt-[12px] border-t border-g2">
          {articles.slice(1, 5).map((ar) => (
            <Link key={ar.slug} href={`/articles/${ar.slug}`}
              className="flex flex-col md:flex-row md:items-center justify-between py-[24px] md:py-[28px] border-b border-g2/60 group hover:bg-white/30 transition-colors duration-300 px-[8px] -mx-[8px] md:px-[16px] md:-mx-[16px]">
              <div className="flex flex-col md:flex-row md:items-center gap-[8px] md:gap-[28px] mb-[12px] md:mb-0">
                <span className="mono text-[11px] text-g4 tracking-[0.15em] w-[80px]">{ar.publishedAt.slice(5)}</span>
                <span className="px-[8px] py-[2px] bg-white border border-g2 text-g4 text-[10px] w-fit md:w-[72px] text-center rounded-[2px]">{ARTICLE_CATEGORY_LABEL[ar.category]}</span>
                <h5 className="serif text-[17px] md:text-[19px] text-accent group-hover:text-gold transition-colors duration-300 font-light mt-[4px] md:mt-0">
                  {ar.title}
                </h5>
              </div>
              <div className="w-[40px] h-[40px] border border-g2 rounded-full flex justify-center items-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-300 self-end md:self-auto shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-[40px] text-center">
          <Link href="/articles" className="inline-block mono text-[12px] md:text-[13px] text-accent uppercase tracking-[0.15em] border-b border-accent pb-[3px] hover:text-gold hover:border-gold transition-colors">
            View All Articles
          </Link>
        </div>
      </section>

      {/* ═══ FULL-WIDTH BANNER ═══ */}
      {spots[5] && (
        <section className="w-full overflow-hidden rounded-none mb-[96px]" style={{ aspectRatio: "21/9", minHeight: "280px" }}>
          <Link href={`/destinations/${spots[5].id}`} className="group block relative w-full h-full">
            <Image src={spots[5].images[0]} alt={spots[5].title} fill className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]" sizes="100vw" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,58,95,0.9) 0%, rgba(30,58,95,0.2) 50%, transparent 100%)" }} />
            <div className="absolute bottom-[32px] md:bottom-[56px] left-[20px] md:left-[48px] lg:left-[96px] text-white z-10">
              <div className="mono text-gold text-[10px] tracking-[0.2em] mb-[12px] opacity-90 uppercase">Inspiration</div>
              <h2 className="serif text-[26px] md:text-[44px] font-light mb-[8px]">どこへ行こうか。<br className="md:hidden" />迷う時間も、旅の一部。</h2>
            </div>
          </Link>
        </section>
      )}

      {/* ═══ PREFECTURE GRID ═══ */}
      <section className="py-[48px] px-[20px] md:px-[48px] lg:px-[96px] max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-[40px] border-b border-g2 pb-[20px]">
          <div>
            <p className="mono text-[12px] tracking-[0.2em] text-g4 mb-[6px] uppercase">Region</p>
            <h3 className="serif text-[28px] md:text-[32px] text-accent font-light">近畿の旅先</h3>
          </div>
          <Link href="/prefectures" className="text-[13px] text-g4 hover:text-accent transition-colors mt-[12px] md:mt-0 flex items-center gap-[6px]">
            他のエリアを見る
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-[12px]">
          {kinkiPrefs.map((p) => {
            const count = getSpotCountForPrefecture(p.id);
            return (
              <Link key={p.id} href={`/prefectures/${p.id}`} className="relative group overflow-hidden bg-g1 rounded-[2px]" style={{ aspectRatio: "3/4" }}>
                {p.coverImage ? (
                  <Image src={p.coverImage} alt={p.name} fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[700ms] group-hover:scale-[1.05]" sizes="15vw" />
                ) : <div className="absolute inset-0 bg-g2" />}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="serif text-[18px] md:text-[20px] text-white tracking-[0.1em] group-hover:scale-110 transition-transform duration-500 drop-shadow-md">{p.name}</span>
                  {count > 0 && <span className="mono text-[9px] text-white/40 mt-[4px]">{count} spots</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="py-[100px] md:py-[140px] px-[20px] md:px-[48px] max-w-[720px] mx-auto text-center">
        <div className="w-[1px] h-[56px] bg-accent mx-auto mb-[32px]" />
        <p className="mono text-[10px] tracking-[0.3em] text-accent mb-[20px] uppercase">About Us</p>
        <h2 className="serif text-[22px] md:text-[28px] text-accent mb-[28px] font-light leading-[1.6]">
          旅は、準備する時間から<br />すでに始まっている。
        </h2>
        <p className="text-[14px] md:text-[15px] leading-[2.1] text-g5 font-light">
          スマートに情報を集められる時代だからこそ、美しくまとめられた「一つのしおり」が持つ熱量を取り戻したい。Itinerary Craftは、あなたの断片的な希望を紡ぎ合わせ、一冊の雑誌のような旅のプランへと仕立て上げるデジタルサービスです。誰と、どんな時間を過ごすか。その想像の余白を、私たちがデザインします。
        </p>
      </section>
    </>
  );
}
