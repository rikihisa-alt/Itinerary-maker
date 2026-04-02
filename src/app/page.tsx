"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getAllSpots, getAllArticles, getKinkiPrefectures, getSpotCountForPrefecture } from "@/lib/contentLoader";
import { Intro } from "@/components/Intro";
import { HorizontalGallery } from "@/components/HorizontalGallery";
import { RevealText, SlideIn } from "@/components/RevealText";
import { ParallaxImage } from "@/components/ParallaxImage";
import { ArticleCardFeatured, ArticleCardCompact } from "@/components/ui/ArticleCard";

const HERO = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1800&q=80";

export default function Home() {
  const spots = getAllSpots();
  const articles = getAllArticles();
  const kinkiPrefs = getKinkiPrefectures();
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

        <div className="relative h-full max-w-[1440px] mx-auto px-[20px] md:px-[48px] flex flex-col justify-end pb-[60px] md:pb-[88px]">
          {introDone && (
            <>
              <RevealText>
                <p className="mono text-[10px] tracking-[0.2em] text-white/30 mb-[12px]">ITINERARY CRAFT</p>
              </RevealText>
              <RevealText delay={0.08}>
                <h1 className="serif text-[38px] md:text-[56px] lg:text-[72px] font-bold text-white leading-[1.1] tracking-[-0.03em]">
                  旅のしおり屋さん
                </h1>
              </RevealText>
              <RevealText delay={0.16}>
                <p className="text-[14px] text-white/35 max-w-[360px] leading-[1.8] mt-[14px] mb-[28px]">
                  あなたの旅を、しおりにする。
                  <br />
                  条件を入れるだけで、旅のしおりが完成する。
                </p>
              </RevealText>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-wrap gap-[10px]">
                <Link href="/create"
                  className="inline-block bg-gold text-white px-[28px] py-[13px] rounded-full text-[13px] font-medium hover:bg-[#a68840] transition-colors active:scale-[0.97]">
                  しおりを作る
                </Link>
                <Link href="/destinations"
                  className="inline-block border border-white/20 text-white/60 px-[28px] py-[13px] rounded-full text-[13px] hover:text-white hover:border-white/40 transition-colors">
                  スポットを探す
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* ═══ 02 横スクロールギャラリー ═══ */}
      <div className="pt-[110px] pb-[70px]">
        <HorizontalGallery items={spots.slice(0, 7)} title="ここが、刺さる。" />
      </div>

      {/* ═══ 03 左テキスト + 右パララックス ═══ */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[96px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] md:gap-[48px] items-center">
          <div className="md:col-span-4">
            <SlideIn direction="left">
              <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[10px]">{spots[3]?.area}</p>
              <h2 className="serif text-[24px] md:text-[30px] font-bold tracking-[-0.01em] leading-[1.3] mb-[12px]">{spots[3]?.title}</h2>
              <p className="text-[13px] text-g5 leading-[1.9] mb-[16px]">{spots[3]?.description}</p>
              <Link href={`/destinations/${spots[3]?.id}`} className="mono text-[11px] text-accent hover:underline">詳しく見る →</Link>
            </SlideIn>
          </div>
          <div className="md:col-span-8">
            <SlideIn direction="right" delay={0.1}>
              <ParallaxImage src={spots[3]?.images[0] || ""} alt={spots[3]?.title || ""} aspect="16/10" />
            </SlideIn>
          </div>
        </div>
      </section>

      {/* ═══ 04 CTA: しおりを作る ═══ */}
      <section className="bg-accent text-white">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] py-[72px] md:py-[100px]">
          <div className="md:grid md:grid-cols-2 md:gap-[48px] md:items-center">
            <div>
              <RevealText><p className="mono text-[10px] tracking-[0.2em] uppercase text-white/25 mb-[12px]">Itinerary Craft</p></RevealText>
              <RevealText delay={0.08}>
                <h2 className="serif text-[26px] md:text-[36px] font-bold leading-[1.2] tracking-[-0.02em] mb-[12px]">
                  条件を入れるだけで、
                  <br />旅のしおりが完成する。
                </h2>
              </RevealText>
              <RevealText delay={0.16}>
                <p className="text-[13px] text-white/30 leading-[1.8] mb-[28px] max-w-[380px]">
                  誰と行く？ どこへ？ どんな旅にしたい？<br />
                  答えるだけで、使えるしおりを自動生成。<br />
                  もちろん自分で一から作ることもできる。
                </p>
              </RevealText>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }}
                className="flex gap-[10px]">
                <Link href="/create" className="inline-block bg-white text-accent px-[24px] py-[11px] rounded-full text-[13px] font-medium hover:bg-white/90 transition-colors">
                  しおりを作る
                </Link>
                <Link href="/itinerary/new" className="inline-block border border-white/20 text-white/50 px-[24px] py-[11px] rounded-full text-[13px] hover:text-white transition-colors">
                  一から自作する
                </Link>
              </motion.div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/5 border border-white/10 rounded-[8px] p-[28px]">
                {["誰と行く？", "どこへ？", "何日間？", "どんな旅？", "こだわりは？"].map((q, i) => (
                  <div key={q} className={`flex items-center gap-[14px] ${i > 0 ? "mt-[16px] pt-[16px] border-t border-white/5" : ""}`}>
                    <span className="mono text-[18px] text-gold/60 font-bold w-[28px]">{i + 1}</span>
                    <span className="text-[13px] text-white/40">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 05 非対称グリッド ═══ */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pt-[96px] pb-[80px]">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-[14px]">
          {spots[0] && (
            <Link href={`/destinations/${spots[0].id}`} className="group block relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40" style={{ aspectRatio: "4/3" }}>
              <Image src={spots[0].images[0]} alt={spots[0].title} fill className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.04]" sizes="60vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 p-[20px] md:p-[32px] z-10">
                <p className="mono text-[10px] text-white/40 tracking-wider uppercase mb-[4px]">{spots[0].area}</p>
                <h3 className="serif text-[22px] md:text-[30px] text-white font-bold leading-[1.2]">{spots[0].title}</h3>
                <p className="text-[12px] text-white/35 mt-[6px] max-w-[320px]">{spots[0].description}</p>
              </div>
            </Link>
          )}
          <div className="flex flex-col gap-[14px]">
            {spots.slice(1, 3).map((s) => (
              <Link key={s.id} href={`/destinations/${s.id}`} className="group block relative rounded-[8px] overflow-hidden flex-1 outline outline-1 outline-g2/40" style={{ minHeight: "180px" }}>
                <Image src={s.images[0]} alt={s.title} fill className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" sizes="30vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 p-[16px] z-10">
                  <p className="mono text-[10px] text-white/40">{s.area}</p>
                  <h3 className="serif text-[17px] text-white font-bold">{s.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 06 記事セクション ═══ */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[96px]">
        <div className="flex items-end justify-between mb-[28px]">
          <div>
            <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[6px]">Articles</p>
            <h2 className="serif text-[24px] md:text-[30px] font-bold">読むと、出たくなる。</h2>
          </div>
          <Link href="/articles" className="mono text-[11px] text-g4 hover:text-accent transition-colors hidden md:block">すべて見る →</Link>
        </div>
        {articles[0] && <ArticleCardFeatured article={articles[0]} />}
        <div className="border-t border-g1 mt-[20px]">
          {articles.slice(1, 4).map((a) => <ArticleCardCompact key={a.slug} article={a} />)}
        </div>
      </section>

      {/* ═══ 07 都道府県ティーザー（近畿） ═══ */}
      <section className="bg-g1/40">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] py-[72px] md:py-[96px]">
          <div className="flex items-end justify-between mb-[32px]">
            <div>
              <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[6px]">Prefectures</p>
              <h2 className="serif text-[24px] md:text-[30px] font-bold">近畿エリアから探す</h2>
            </div>
            <Link href="/prefectures" className="mono text-[11px] text-g4 hover:text-accent transition-colors hidden md:block">都道府県一覧 →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[10px]">
            {kinkiPrefs.map((p) => {
              const count = getSpotCountForPrefecture(p.id);
              return (
                <Link key={p.id} href={`/prefectures/${p.id}`}
                  className="group relative rounded-[8px] overflow-hidden outline outline-1 outline-g2/40 aspect-[4/3]">
                  {p.coverImage ? (
                    <Image src={p.coverImage} alt={p.name} fill className="object-cover transition-transform duration-[500ms] group-hover:scale-[1.04]" sizes="25vw" />
                  ) : (
                    <div className="absolute inset-0 bg-g2" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 p-[14px] z-10">
                    <p className="serif text-[16px] text-white font-bold">{p.name}</p>
                    {count > 0 && <p className="mono text-[10px] text-white/40 mt-[2px]">{count} spots</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 08 フル幅パララックスバナー ═══ */}
      {spots[5] && (
        <div className="pt-[96px] pb-[72px] px-[20px] md:px-[48px]">
          <Link href={`/destinations/${spots[5].id}`} className="group block relative">
            <ParallaxImage src={spots[5].images[0]} alt={spots[5].title} aspect="21/9" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent rounded-[8px] z-10" />
            <div className="absolute bottom-0 left-0 p-[20px] md:p-[44px] z-20 max-w-[400px]">
              <p className="mono text-[10px] text-white/30 tracking-wider uppercase mb-[4px]">{spots[5].area}</p>
              <h2 className="serif text-[20px] md:text-[30px] text-white font-bold leading-[1.2] group-hover:text-gold transition-colors">{spots[5].title}</h2>
              <p className="text-[12px] text-white/35 mt-[6px]">{spots[5].description}</p>
            </div>
          </Link>
        </div>
      )}

      {/* ═══ 09 2つ目の横スクロール ═══ */}
      <div className="pb-[96px]">
        <HorizontalGallery items={spots.slice(5, 12)} title="もうひとつの選択肢。" />
      </div>

      {/* ═══ 10 余白テキスト ═══ */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[80px]">
        <div className="border-t border-g1 pt-[48px] max-w-[440px]">
          <SlideIn direction="up">
            <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[8px]">About Itinerary Craft</p>
            <p className="text-[14px] text-g5 leading-[2]">
              「旅のしおり屋さん」は、観光地を探して、記事を読んで、旅のしおりを作るサービス。
              条件を入力するだけでしおりを自動生成。もちろん一から自作もできる。
              情報を並べるのではなく、旅の体験として届ける。
            </p>
          </SlideIn>
        </div>
      </section>
    </>
  );
}
