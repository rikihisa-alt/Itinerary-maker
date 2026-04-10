"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { getAllSpots, getAllArticles, getKinkiPrefectures, getSpotCountForPrefecture } from "@/lib/contentLoader";
import { Intro } from "@/components/Intro";
import { HorizontalGallery } from "@/components/HorizontalGallery";
import { SPOT_CATEGORY_LABEL } from "@/types/spot";
import { ARTICLE_CATEGORY_LABEL } from "@/types/article";
import { useRef } from "react";

export default function Home() {
  const spots = getAllSpots();
  const articles = getAllArticles();
  const kinkiPrefs = getKinkiPrefectures();
  const [introDone, setIntroDone] = useState(false);
  const onDone = useCallback(() => setIntroDone(true), []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const f = spots[0]; // 伏見稲荷
  const k = spots[1]; // 清水寺
  const g = spots[2]; // 祇園
  const a = spots[3]; // 嵐山
  const n = spots[4]; // 奈良公園
  const d = spots[5]; // 道頓堀

  return (
    <>
      {!introDone && <Intro onDone={onDone} />}

      {/* ═══════════════════════════════════════════
          01  HERO — 100vh, 映画のようなオープニング
      ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[100dvh] min-h-[640px] overflow-hidden noise">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=2000&q=85"
            alt="京都の街並み" fill className="object-cover" priority sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        <motion.div style={{ opacity: heroOpacity }}
          className="relative h-full max-w-[1440px] mx-auto px-[20px] md:px-[48px] flex flex-col justify-end pb-[56px] md:pb-[80px]">
          {introDone && (
            <>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
                className="mono text-[10px] tracking-[0.25em] uppercase text-white/25 mb-[16px]">
                Itinerary Craft
              </motion.p>

              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="serif text-[42px] md:text-[64px] lg:text-[80px] font-light text-white leading-[1.05] tracking-[-0.04em] max-w-[700px]">
                旅のしおり屋さん
              </motion.h1>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-[20px] mb-[32px]">
                <div className="divider-gold mb-[16px]" />
                <p className="text-[14px] text-white/35 max-w-[340px] leading-[1.9]">
                  あなたの旅を、しおりにする。<br />
                  条件を入れるだけで、旅のしおりが完成します。
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}
                className="flex flex-wrap gap-[10px]">
                <Link href="/create" className="btn-gold">
                  しおりを作る
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </Link>
                <Link href="/destinations" className="btn-outline">スポットを探す</Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          02  横スクロールギャラリー
      ═══════════════════════════════════════════ */}
      <div className="pt-[100px] md:pt-[140px] pb-[60px]">
        <HorizontalGallery items={spots.slice(0, 7)} title="ここが、刺さる。" />
      </div>

      {/* ═══════════════════════════════════════════
          03  エディトリアル：左テキスト＋右大画像（非対称）
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[20px] md:gap-[56px] items-end">
          <div className="md:col-span-4 md:pb-[40px]">
            <p className="mono text-[10px] tracking-[0.2em] uppercase text-g3 mb-[20px]">{a?.prefecture} · {a ? SPOT_CATEGORY_LABEL[a.category] : ""}</p>
            <h2 className="serif text-[28px] md:text-[38px] font-light tracking-[-0.02em] leading-[1.2] mb-[16px]">{a?.title}</h2>
            <div className="divider mb-[16px]" />
            <p className="text-[13px] text-g5 leading-[2] mb-[6px]">{a?.description}</p>
            <p className="text-[12px] text-g4 leading-[2] mb-[24px]">{a?.longDescription?.slice(0, 120)}…</p>
            <Link href={`/destinations/${a?.id}`} className="mono text-[11px] text-accent border-b border-accent/30 pb-[2px] hover:border-accent transition-colors">
              この場所を見る →
            </Link>
          </div>
          <div className="md:col-span-8">
            <Link href={`/destinations/${a?.id}`} className="group block relative rounded-[4px] overflow-hidden" style={{ aspectRatio: "16/10" }}>
              <Image src={a?.images[0] || ""} alt={a?.title || ""} fill
                className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]" sizes="65vw" />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          04  非対称グリッド（3枚、サイズバラバラ）
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[80px]">
        <p className="mono text-[10px] tracking-[0.2em] uppercase text-g3 mb-[8px]">Destinations</p>
        <h2 className="serif text-[24px] md:text-[32px] font-light tracking-[-0.02em] mb-[28px]">近畿の、ここだけは。</h2>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-[12px]">
          {/* 大きい左 */}
          {f && (
            <Link href={`/destinations/${f.id}`} className="group block relative rounded-[4px] overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <Image src={f.images[0]} alt={f.title} fill className="object-cover transition-transform duration-[700ms] group-hover:scale-[1.04]" sizes="60vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-[20px] md:p-[36px]">
                <p className="mono text-[9px] text-white/30 tracking-[0.15em] uppercase mb-[6px]">{f.area} · {SPOT_CATEGORY_LABEL[f.category]}</p>
                <h3 className="serif text-[24px] md:text-[32px] text-white font-light leading-[1.15] group-hover:text-gold-light transition-colors">{f.title}</h3>
                <p className="text-[12px] text-white/30 mt-[6px] max-w-[320px] hidden md:block">{f.description}</p>
              </div>
            </Link>
          )}

          {/* 右2枚（縦に積む） */}
          <div className="flex flex-col gap-[12px]">
            {[k, g].filter(Boolean).map((s) => s && (
              <Link key={s.id} href={`/destinations/${s.id}`}
                className="group block relative rounded-[4px] overflow-hidden flex-1" style={{ minHeight: "200px" }}>
                <Image src={s.images[0]} alt={s.title} fill className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" sizes="30vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 p-[16px] md:p-[20px]">
                  <p className="mono text-[9px] text-white/30 tracking-wider uppercase">{s.area}</p>
                  <h3 className="serif text-[18px] text-white font-light">{s.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          05  CTA — しおりを作る（ネイビーセクション）
      ═══════════════════════════════════════════ */}
      <section className="bg-accent text-white noise relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] py-[80px] md:py-[120px] relative z-10">
          <div className="md:grid md:grid-cols-12 md:gap-[48px] md:items-center">
            <div className="md:col-span-7">
              <p className="mono text-[10px] tracking-[0.25em] uppercase text-white/20 mb-[16px]">How it works</p>
              <h2 className="serif text-[30px] md:text-[44px] font-light leading-[1.15] tracking-[-0.03em] mb-[20px]">
                条件を入れるだけで、<br />旅のしおりが完成する。
              </h2>
              <div className="divider-gold mb-[20px]" />
              <p className="text-[13px] text-white/30 leading-[2] max-w-[420px] mb-[32px]">
                誰と行く？ どこへ？ どんな旅にしたい？<br />
                答えるだけで、使えるしおりを自動生成。<br />
                もちろん、自分で一から作ることもできます。
              </p>
              <div className="flex flex-wrap gap-[10px]">
                <Link href="/create" className="bg-white text-accent px-[28px] py-[13px] rounded-full text-[13px] font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-[6px]">
                  しおりを作る
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </Link>
                <Link href="/itinerary/new" className="border border-white/15 text-white/40 px-[28px] py-[13px] rounded-full text-[13px] hover:text-white/70 transition-colors">
                  一から自作する
                </Link>
              </div>
            </div>
            <div className="hidden md:block md:col-span-5">
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-[6px] p-[32px]">
                {[
                  { n: "01", q: "誰と行く？", d: "ひとり / カップル / 家族 / 友人" },
                  { n: "02", q: "どこへ行く？", d: "京都・大阪・神戸・奈良…" },
                  { n: "03", q: "何日間？", d: "日帰り〜7泊" },
                  { n: "04", q: "どんな旅？", d: "温泉・グルメ・自然・写真映え…" },
                  { n: "05", q: "こだわりは？", d: "ペース・予算・天候" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-[16px] ${i > 0 ? "mt-[20px] pt-[20px] border-t border-white/[0.06]" : ""}`}>
                    <span className="mono text-[22px] text-gold/40 font-light w-[32px] shrink-0 leading-none mt-[2px]">{item.n}</span>
                    <div>
                      <p className="text-[13px] text-white/50 mb-[2px]">{item.q}</p>
                      <p className="text-[11px] text-white/20">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          06  記事セクション — エディトリアル
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pt-[100px] md:pt-[140px] pb-[80px]">
        <div className="flex items-end justify-between mb-[36px]">
          <div>
            <p className="mono text-[10px] tracking-[0.2em] uppercase text-g3 mb-[8px]">Articles</p>
            <h2 className="serif text-[24px] md:text-[32px] font-light tracking-[-0.02em]">読むと、出かけたくなる。</h2>
          </div>
          <Link href="/articles" className="mono text-[11px] text-g4 hover:text-accent transition-colors hidden md:block">
            すべての記事 →
          </Link>
        </div>

        {/* Featured article */}
        {articles[0] && (
          <Link href={`/articles/${articles[0].slug}`} className="group block mb-[24px]">
            <div className="bg-accent text-white rounded-[4px] overflow-hidden md:grid md:grid-cols-2">
              <div className="relative aspect-[16/10] md:aspect-auto">
                <Image src={articles[0].coverImage} alt={articles[0].title} fill className="object-cover" sizes="50vw" />
              </div>
              <div className="p-[24px] md:p-[40px] flex flex-col justify-center">
                <p className="mono text-[9px] text-white/25 tracking-[0.15em] uppercase mb-[10px]">
                  {ARTICLE_CATEGORY_LABEL[articles[0].category]} · {articles[0].prefectureId}
                </p>
                <h3 className="serif text-[20px] md:text-[26px] font-light leading-[1.3] group-hover:text-gold-light transition-colors mb-[10px]">
                  {articles[0].title}
                </h3>
                <p className="text-[12px] text-white/30 leading-[1.8] line-clamp-2">{articles[0].description}</p>
              </div>
            </div>
          </Link>
        )}

        {/* Compact articles */}
        <div className="border-t border-g1">
          {articles.slice(1, 5).map((ar) => (
            <Link key={ar.slug} href={`/articles/${ar.slug}`}
              className="group flex items-center justify-between py-[18px] border-b border-g1/60 hover:bg-white/30 transition-colors px-[2px]">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[8px] mb-[3px]">
                  <span className="mono text-[9px] text-accent bg-accent/5 px-[6px] py-[1px] rounded tracking-wider uppercase">
                    {ARTICLE_CATEGORY_LABEL[ar.category]}
                  </span>
                  <span className="text-[10px] text-g4">{ar.prefectureId}</span>
                </div>
                <h4 className="serif text-[15px] font-medium group-hover:text-accent transition-colors leading-[1.4] truncate">
                  {ar.title}
                </h4>
              </div>
              <svg className="shrink-0 ml-[12px] text-g3 group-hover:text-accent transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          07  フルブリード画像 + キャプション
      ═══════════════════════════════════════════ */}
      {d && (
        <section className="px-[20px] md:px-[48px] pb-[100px]">
          <Link href={`/destinations/${d.id}`} className="group block relative rounded-[4px] overflow-hidden" style={{ aspectRatio: "21/9", minHeight: "280px" }}>
            <Image src={d.images[0]} alt={d.title} fill className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.03]" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-[20px] md:p-[44px] max-w-[420px]">
              <p className="mono text-[9px] text-white/25 tracking-[0.15em] uppercase mb-[6px]">{d.area} · {SPOT_CATEGORY_LABEL[d.category]}</p>
              <h2 className="serif text-[22px] md:text-[34px] text-white font-light leading-[1.15] group-hover:text-gold-light transition-colors">{d.title}</h2>
              <p className="text-[12px] text-white/25 mt-[8px] hidden md:block">{d.description}</p>
            </div>
          </Link>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          08  2つ目のギャラリー
      ═══════════════════════════════════════════ */}
      <div className="pb-[100px]">
        <HorizontalGallery items={spots.slice(5, 12)} title="もうひとつの選択肢。" />
      </div>

      {/* ═══════════════════════════════════════════
          09  都道府県ナビ（近畿）
      ═══════════════════════════════════════════ */}
      <section className="bg-cream noise relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] py-[80px] md:py-[110px] relative z-10">
          <div className="flex items-end justify-between mb-[36px]">
            <div>
              <p className="mono text-[10px] tracking-[0.2em] uppercase text-g3 mb-[8px]">Prefectures</p>
              <h2 className="serif text-[24px] md:text-[32px] font-light tracking-[-0.02em]">近畿エリアから探す</h2>
            </div>
            <Link href="/prefectures" className="mono text-[11px] text-g4 hover:text-accent transition-colors hidden md:block">
              都道府県一覧 →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[10px]">
            {kinkiPrefs.map((p) => {
              const count = getSpotCountForPrefecture(p.id);
              return (
                <Link key={p.id} href={`/prefectures/${p.id}`}
                  className="group relative rounded-[4px] overflow-hidden aspect-[4/3]">
                  {p.coverImage ? (
                    <Image src={p.coverImage} alt={p.name} fill className="object-cover transition-transform duration-[500ms] group-hover:scale-[1.04]" sizes="25vw" />
                  ) : <div className="absolute inset-0 bg-g2" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 p-[14px]">
                    <p className="serif text-[17px] text-white font-light">{p.name}</p>
                    {count > 0 && <p className="mono text-[9px] text-white/30 mt-[2px]">{count} spots</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          10  About — 余白テキスト
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] py-[100px] md:py-[140px]">
        <div className="max-w-[480px]">
          <div className="divider mb-[24px]" />
          <p className="mono text-[10px] tracking-[0.2em] uppercase text-g3 mb-[12px]">About Itinerary Craft</p>
          <h2 className="serif text-[22px] md:text-[28px] font-light tracking-[-0.02em] leading-[1.4] mb-[16px]">
            旅のしおり屋さんについて
          </h2>
          <p className="text-[13px] text-g5 leading-[2.1]">
            観光地を探して、記事を読んで、旅のしおりを作る。
            条件を入力するだけでしおりを自動生成。
            もちろん一から自作もできます。
            情報を並べるのではなく、旅の体験として届ける。
            それが「旅のしおり屋さん」です。
          </p>
          <div className="mt-[24px]">
            <Link href="/create" className="mono text-[11px] text-accent border-b border-accent/30 pb-[2px] hover:border-accent transition-colors">
              しおりを作ってみる →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
