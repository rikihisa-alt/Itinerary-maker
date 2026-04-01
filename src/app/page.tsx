import Link from "next/link";
import { getAllDestinations, getFeaturedArticles, getAllArticles } from "@/lib/contentLoader";
import { AREA_LIST } from "@/lib/helpers";
import { PhotoSlider, ArticleSlider } from "@/components/PhotoSlider";

export default function Home() {
  const destinations = getAllDestinations();
  const featuredArticles = getFeaturedArticles();
  const allArticles = getAllArticles();
  const hero = destinations[0];

  return (
    <>
      {/* ════════ HERO ════════ */}
      <section className="relative bg-ink text-cloud overflow-hidden">
        {/* BG texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px]" />

        <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="min-h-[90vh] flex flex-col justify-end pb-16 md:pb-24">
            <div className="anim-fade">
              <p className="text-[11px] tracking-[0.3em] uppercase text-accent-soft mb-8">
                Proposal — Guide — Itinerary
              </p>
              <h1 className="text-display text-[clamp(2.5rem,8vw,6rem)] max-w-4xl mb-6">
                行きたい場所は、
                <br />
                <span className="text-accent-soft">もう決まってる。</span>
              </h1>
              <p className="text-cloud/40 text-base md:text-lg max-w-xl mb-12 leading-relaxed">
                あなたの条件に刺さる旅先を提案して、
                <br className="hidden md:block" />
                そのまま旅のしおりまで作れる。
              </p>
            </div>
            <div className="anim-fade-d2 flex flex-wrap gap-4">
              <Link href="/result" className="pill pill-primary text-base">
                旅を提案してもらう <span className="ml-1">→</span>
              </Link>
              <Link href="/destinations" className="pill pill-outline !border-cloud/20 !text-cloud/60 hover:!text-cloud">
                観光地を探す
              </Link>
            </div>
          </div>
        </div>

        {/* Hero bottom accent card */}
        {hero && (
          <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 -mb-20 z-10">
            <Link href={`/destinations/${hero.id}`} className="block group">
              <div className="bg-cloud text-fg rounded-2xl p-6 md:p-8 md:flex md:items-center md:gap-8 shadow-2xl shadow-black/10 lift">
                <div className="flex-1 mb-4 md:mb-0">
                  <p className="text-[11px] tracking-[0.15em] uppercase text-accent mb-2">Today&apos;s Pick</p>
                  <h2 className="font-editorial text-2xl md:text-3xl font-bold group-hover:text-accent transition-colors">
                    {hero.name}
                  </h2>
                  <p className="text-stone text-sm mt-2 line-clamp-2 max-w-md">{hero.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="text-[11px] text-stone">{hero.area} / {hero.prefecture}</p>
                    <p className="text-sm font-medium">{hero.budgetRange}</p>
                  </div>
                  <span className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white text-lg shrink-0 group-hover:scale-110 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </section>

      {/* Spacer for overlap */}
      <div className="h-28" />

      {/* ════════ AREA NAV ════════ */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-10 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {AREA_LIST.map((area) => (
            <Link key={area} href={`/destinations?area=${area}`}
              className="shrink-0 px-4 py-2 rounded-full text-[13px] text-stone hover:text-fg border border-sand/50 hover:border-fg/20 hover:bg-cream transition-all">
              {area}
            </Link>
          ))}
        </div>
      </section>

      {/* ════════ PHOTO SLIDER ════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto mb-8 px-5 md:px-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="divider mb-4" />
              <h2 className="font-editorial text-2xl md:text-4xl font-bold">この条件なら、ここ。</h2>
            </div>
            <Link href="/destinations" className="text-[13px] text-stone hover:text-accent transition-colors hidden sm:block">
              すべて見る →
            </Link>
          </div>
        </div>
        <PhotoSlider items={destinations.slice(0, 8)} />
      </section>

      {/* ════════ PROPOSAL CTA ════════ */}
      <section className="bg-ink text-cloud overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center">
            <div className="mb-12 md:mb-0">
              <p className="text-[11px] tracking-[0.2em] uppercase text-accent-soft mb-6">Travel Diagnosis</p>
              <h2 className="text-display text-3xl md:text-5xl mb-6">
                4つ答えるだけで、
                <br />
                旅が決まる。
              </h2>
              <p className="text-cloud/40 leading-relaxed mb-10 max-w-sm">
                誰と行く？ どんな気分？ 気になることは？
                ──それだけで、あなた専用の旅先とモデルコースを提案。
              </p>
              <Link href="/result" className="pill pill-primary">
                診断してみる <span className="ml-1">→</span>
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { n: "01", q: "誰と行く？", ex: "カップル / 一人 / 友達 / 家族" },
                { n: "02", q: "どんな旅がしたい？", ex: "のんびり / アクティブ / グルメ" },
                { n: "03", q: "気になることは？", ex: "温泉 / 自然 / アート / 歴史" },
                { n: "04", q: "エリアを選ぶ", ex: "おまかせ / 関西 / 九州 / 北海道" },
              ].map((step) => (
                <div key={step.n} className="bg-cloud/5 border border-cloud/10 rounded-xl p-5 flex items-center gap-5">
                  <span className="font-editorial text-2xl text-accent-soft font-bold w-10 shrink-0">{step.n}</span>
                  <div>
                    <p className="font-medium text-sm">{step.q}</p>
                    <p className="text-[12px] text-cloud/30 mt-0.5">{step.ex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ ARTICLES SLIDER ════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto mb-8 px-5 md:px-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="divider mb-4" />
              <h2 className="font-editorial text-2xl md:text-4xl font-bold">読むと、出たくなる。</h2>
            </div>
            <Link href="/articles" className="text-[13px] text-stone hover:text-accent transition-colors hidden sm:block">
              すべて見る →
            </Link>
          </div>
        </div>
        <ArticleSlider articles={allArticles} />
      </section>

      {/* ════════ SECOND SLIDER ════════ */}
      <section className="pb-16 md:pb-24">
        <PhotoSlider items={destinations.slice(8, 15)} label="More destinations" />
      </section>

      {/* ════════ ITINERARY CTA ════════ */}
      <section className="bg-cream">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-28 text-center">
          <div className="divider mx-auto mb-6" />
          <h2 className="text-display text-3xl md:text-5xl mb-5">
            しおりを、作ろう。
          </h2>
          <p className="text-stone text-base max-w-md mx-auto mb-10 leading-relaxed">
            観光地を選んでタイムラインに並べるだけ。
            <br />
            あなただけの旅のしおりが完成する。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/itinerary" className="pill pill-primary">
              しおりを作る <span className="ml-1">→</span>
            </Link>
            <Link href="/result" className="pill pill-outline">
              まず提案してもらう
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
