import Link from "next/link";
import { getAllDestinations, getAllArticles } from "@/lib/contentLoader";
import { Hero } from "@/components/Hero";
import { HorizontalGallery } from "@/components/HorizontalGallery";
import { SplitFeature, AsymmetricDuo, FullBanner, ArticlePromo } from "@/components/EditorialSection";

export default function Home() {
  const dests = getAllDestinations();
  const articles = getAllArticles();

  return (
    <>
      {/* ▌01 Hero — 90vh, 写真主体, 左下寄せ */}
      <Hero />

      {/* ▌02 横スクロール写真 — バラバラ幅 */}
      <div className="pt-[120px] pb-[80px]">
        <HorizontalGallery
          items={dests.slice(0, 8)}
          title="ここが、刺さる。"
          subtitle="Destinations"
        />
      </div>

      {/* ▌03 左テキスト + 右大画像 */}
      <div className="pb-[100px]">
        <SplitFeature dest={dests[2]} />
      </div>

      {/* ▌04 提案CTA — 全く別の構造 */}
      <section className="bg-navy text-white">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] py-[80px] md:py-[120px]">
          <div className="max-w-[560px]">
            <p className="text-[11px] font-[--mono] tracking-[0.2em] uppercase text-white/30 mb-[16px]">
              Travel Diagnosis
            </p>
            <h2 className="font-[--serif] text-[26px] md:text-[40px] font-bold leading-[1.2] tracking-[-0.02em] mb-[16px]">
              4つ答えるだけで、
              <br />
              旅が決まる。
            </h2>
            <p className="text-[14px] text-white/35 leading-[1.9] mb-[40px]">
              誰と行く？ どんな気分？ 気になることは？
              <br />
              それだけで、あなた専用の旅先とモデルコースを提案する。
            </p>
            <Link href="/result"
              className="inline-block bg-gold text-white px-[32px] py-[14px] rounded-full text-[14px] font-medium hover:bg-[#b8944e] transition-colors">
              診断してみる
            </Link>
          </div>
        </div>
      </section>

      {/* ▌05 2カラム非対称 */}
      <div className="pt-[100px] pb-[80px]">
        <AsymmetricDuo left={dests[3]} right={dests[4]} />
      </div>

      {/* ▌06 記事 — リスト形式、画像なし */}
      <div className="pb-[100px]">
        <ArticlePromo articles={articles.slice(0, 4)} />
      </div>

      {/* ▌07 フル幅バナー */}
      <div className="pb-[80px]">
        <FullBanner dest={dests[5]} />
      </div>

      {/* ▌08 2つ目の横スクロール — 違うセット */}
      <div className="pb-[120px]">
        <HorizontalGallery
          items={dests.slice(8, 15)}
          title="もうひとつの選択肢。"
        />
      </div>

      {/* ▌09 しおりCTA — 余白で区切るだけ */}
      <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[120px]">
        <div className="border-t border-warm pt-[64px]">
          <div className="max-w-[440px]">
            <p className="text-[11px] font-[--mono] tracking-[0.15em] uppercase text-dim mb-[12px]">Itinerary</p>
            <h2 className="font-[--serif] text-[26px] font-bold tracking-[-0.01em] mb-[12px]">
              しおりを、作ろう。
            </h2>
            <p className="text-[14px] text-dim leading-[1.9] mb-[32px]">
              観光地を選んでタイムラインに並べるだけ。
              あなただけの旅のしおりが完成する。
            </p>
            <div className="flex gap-[12px]">
              <Link href="/itinerary"
                className="inline-block bg-dark text-white px-[28px] py-[12px] rounded-full text-[14px] font-medium hover:bg-black transition-colors">
                しおりを作る
              </Link>
              <Link href="/result"
                className="inline-block border border-warm text-dim px-[28px] py-[12px] rounded-full text-[14px] hover:border-dark hover:text-dark transition-colors">
                まず提案してもらう
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
