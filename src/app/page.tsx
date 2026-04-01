import Link from "next/link";
import { getAllDestinations, getFeaturedArticles } from "@/lib/contentLoader";
import { AREA_LIST } from "@/lib/helpers";

export default function Home() {
  const destinations = getAllDestinations();
  const featuredArticles = getFeaturedArticles().slice(0, 3);
  const picked = destinations.slice(0, 8);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-foreground text-background min-h-[85vh] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-light/10 rounded-full blur-[120px]" />

        <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-0 w-full">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7">
              <p className="animate-fade-up text-accent-light text-sm font-medium tracking-[0.2em] uppercase mb-8">
                Travel Proposal × Guide × Itinerary
              </p>
              <h1 className="animate-fade-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8">
                「行きたい」が
                <br />
                見つかる。
                <br />
                <span className="text-gradient">「行ける」に変わる。</span>
              </h1>
              <p className="animate-fade-up-delay text-base md:text-lg text-background/50 max-w-lg mb-10 leading-relaxed">
                条件を入れるだけで、あなたに刺さる旅先を提案。
                <br />
                そのまま旅のしおりまで作れる。
              </p>
              <div className="animate-fade-up-delay-2 flex flex-wrap gap-4">
                <Link
                  href="/result"
                  className="group bg-accent text-white px-8 py-4 rounded-full font-medium hover:shadow-xl hover:shadow-accent/30 transition-all flex items-center gap-2"
                >
                  旅を提案してもらう
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  href="/destinations"
                  className="border border-background/20 text-background/70 px-8 py-4 rounded-full hover:bg-background/5 transition-all"
                >
                  観光地を探す
                </Link>
              </div>
            </div>

            {/* Right side: quick taste cards */}
            <div className="md:col-span-5 hidden md:block">
              <div className="space-y-4">
                {picked.slice(0, 3).map((d, i) => (
                  <Link
                    key={d.id}
                    href={`/destinations/${d.id}`}
                    className={`block rounded-2xl p-5 transition-all hover:scale-[1.02] ${
                      i === 0
                        ? "bg-background/10 backdrop-blur-sm"
                        : "bg-background/5 backdrop-blur-sm"
                    }`}
                    style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-background/40 mb-1">{d.area} · {d.category[0]}</p>
                        <p className={`font-bold ${i === 0 ? "text-lg" : "text-base"}`}>{d.name}</p>
                        <p className="text-sm text-background/40 mt-1 line-clamp-1">{d.description.slice(0, 30)}...</p>
                      </div>
                      <span className="text-background/20 text-2xl">›</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Area quick nav ── */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-4">
            {AREA_LIST.map((area) => (
              <Link
                key={area}
                href={`/destinations?area=${area}`}
                className="shrink-0 px-4 py-2 rounded-full text-sm text-muted hover:text-foreground hover:bg-surface transition-all"
              >
                {area}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured destinations: 1つを主役に ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="text-accent text-xs font-medium tracking-[0.15em] uppercase mb-3">Destinations</p>
            <h2 className="text-2xl md:text-4xl font-bold">この条件なら、ここが刺さる</h2>
          </div>
          <Link href="/destinations" className="text-sm text-muted hover:text-accent transition-colors hidden sm:block">
            すべて見る →
          </Link>
        </div>

        {/* Main hero card */}
        {picked[0] && (
          <Link href={`/destinations/${picked[0].id}`} className="group block mb-8">
            <div className="relative bg-foreground rounded-3xl overflow-hidden card-hover">
              <div className="aspect-[21/9] md:aspect-[21/8] bg-gradient-to-br from-foreground via-foreground/95 to-foreground/80 relative">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "radial-gradient(circle at 70% 30%, rgba(196,93,62,0.3) 0%, transparent 50%)"
                }} />
                <div className="absolute inset-0 flex items-end">
                  <div className="p-8 md:p-12 w-full">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {picked[0].tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full backdrop-blur-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/40 text-sm mb-2">{picked[0].area} / {picked[0].prefecture}</p>
                        <h3 className="text-3xl md:text-5xl font-bold text-white group-hover:text-accent-light transition-colors">
                          {picked[0].name}
                        </h3>
                        <p className="text-white/50 mt-3 max-w-xl leading-relaxed text-sm md:text-base">
                          {picked[0].description}
                        </p>
                      </div>
                      <div className="hidden md:flex flex-col items-end gap-2 text-white/40 text-sm">
                        <span>{picked[0].budgetRange}</span>
                        <span>{picked[0].stayDuration[0]}</span>
                        <span>{picked[0].bestSeason.join("・")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* 2-3: Medium cards */}
        <div className="grid md:grid-cols-5 gap-5 mb-5">
          {picked.slice(1, 3).map((dest, i) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.id}`}
              className={`group card-hover ${i === 0 ? "md:col-span-3" : "md:col-span-2"}`}
            >
              <div className="bg-surface rounded-2xl overflow-hidden h-full">
                <div className={`${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"} bg-foreground/5 relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 p-5 md:p-6">
                    <p className="text-xs text-white/50 mb-1">{dest.area}</p>
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-accent-light transition-colors">
                      {dest.name}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted line-clamp-2">{dest.description}</p>
                  <div className="flex gap-2 mt-3">
                    {dest.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-xs text-muted bg-background px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 4-8: Compact staggered grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {picked.slice(3, 8).map((dest, i) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.id}`}
              className={`group card-hover ${i === 0 ? "col-span-2 md:col-span-2" : ""}`}
            >
              <div className={`bg-surface rounded-xl p-5 h-full ${i === 0 ? "md:flex md:items-center md:gap-5" : ""}`}>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted">{dest.area} · {dest.category[0]}</p>
                    {dest.rating && <span className="text-xs font-medium text-accent">★ {dest.rating}</span>}
                  </div>
                  <h3 className="font-bold text-sm md:text-base group-hover:text-accent transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-muted mt-1.5 line-clamp-2">{dest.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link href="/destinations" className="text-sm text-accent hover:underline">すべての観光地を見る →</Link>
        </div>
      </section>

      {/* ── Proposal CTA ── */}
      <section className="bg-warm">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent text-xs font-medium tracking-[0.15em] uppercase mb-3">Travel Proposal</p>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                4つの質問で、
                <br />
                あなたの旅が見つかる。
              </h2>
              <p className="text-muted leading-relaxed mb-8">
                誰と行く？ どんな旅がしたい？ 気になることは？
                <br />
                それだけで、あなたに刺さる旅先とモデルコースを提案します。
              </p>
              <Link
                href="/result"
                className="group inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-medium hover:shadow-xl hover:shadow-accent/30 transition-all"
              >
                診断してみる
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="space-y-3">
              {["誰と行く？", "どんな旅がしたい？", "気になることは？", "エリアを選ぶ"].map((q, i) => (
                <div key={q} className="bg-background rounded-xl p-5 flex items-center gap-4">
                  <span className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-medium">{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="text-accent text-xs font-medium tracking-[0.15em] uppercase mb-3">Articles</p>
            <h2 className="text-2xl md:text-4xl font-bold">読むと旅に出たくなる</h2>
          </div>
          <Link href="/articles" className="text-sm text-muted hover:text-accent transition-colors hidden sm:block">
            すべて見る →
          </Link>
        </div>

        <div className="space-y-5">
          {featuredArticles.map((article, i) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
              <article
                className={`rounded-2xl card-hover transition-all ${
                  i === 0
                    ? "bg-foreground text-background p-8 md:p-12"
                    : "bg-surface p-6 md:p-8"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    i === 0 ? "bg-accent text-white" : "bg-accent/10 text-accent"
                  }`}>
                    {article.category}
                  </span>
                  <span className={`text-xs ${i === 0 ? "text-background/40" : "text-muted"}`}>
                    {article.targetType}
                  </span>
                  {article.readingTime && (
                    <span className={`text-xs ${i === 0 ? "text-background/40" : "text-muted"}`}>
                      {article.readingTime}分
                    </span>
                  )}
                </div>
                <h3 className={`font-bold leading-snug transition-colors ${
                  i === 0
                    ? "text-2xl md:text-3xl lg:text-4xl group-hover:text-accent-light"
                    : "text-xl md:text-2xl group-hover:text-accent"
                }`}>
                  {article.title}
                </h3>
                <p className={`mt-3 leading-relaxed ${
                  i === 0 ? "text-background/50 text-base max-w-2xl" : "text-muted"
                }`}>
                  {article.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {article.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className={`text-xs px-2 py-1 rounded ${
                      i === 0 ? "bg-background/10 text-background/50" : "bg-background text-muted"
                    }`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link href="/articles" className="text-sm text-accent hover:underline">すべての記事を見る →</Link>
        </div>
      </section>

      {/* ── Itinerary CTA ── */}
      <section className="bg-surface">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24 text-center">
          <p className="text-accent text-xs font-medium tracking-[0.15em] uppercase mb-3">Itinerary</p>
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            この旅、どう回るのが気持ちいい？
          </h2>
          <p className="text-muted text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            観光地を選んでタイムラインに並べるだけ。
            <br />
            あなただけの旅のしおりが完成する。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/itinerary"
              className="group inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-medium hover:shadow-xl transition-all"
            >
              しおりを作る
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/result"
              className="inline-flex items-center gap-2 border border-border text-muted px-8 py-4 rounded-full hover:text-foreground hover:border-foreground/30 transition-all"
            >
              まず提案してもらう
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
