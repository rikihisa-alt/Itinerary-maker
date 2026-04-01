import Link from "next/link";
import { getAllDestinations, getFeaturedArticles } from "@/lib/contentLoader";

export default function Home() {
  const destinations = getAllDestinations().slice(0, 6);
  const featuredArticles = getFeaturedArticles().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-40">
          <p className="text-accent-light text-sm font-medium tracking-widest uppercase mb-6">
            旅の提案 × 観光ガイド × しおり作成
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            「行きたい」が見つかる。
            <br />
            <span className="text-accent-light">「行ける」に変わる。</span>
          </h1>
          <p className="text-lg md:text-xl text-background/60 max-w-2xl mb-10 leading-relaxed">
            あなたの条件に刺さる旅先を提案し、
            <br className="hidden md:block" />
            そのまま旅のしおりまで作れる。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/result"
              className="bg-accent text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              旅を提案してもらう
            </Link>
            <Link
              href="/destinations"
              className="border border-background/30 text-background/80 px-8 py-4 rounded-full hover:bg-background/10 transition-colors"
            >
              観光地を探す
            </Link>
          </div>
        </div>
      </section>

      {/* Destinations Pick */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-accent text-sm font-medium mb-2">DESTINATIONS</p>
            <h2 className="text-3xl font-bold">この条件なら、ここが刺さる</h2>
          </div>
          <Link
            href="/destinations"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            すべて見る →
          </Link>
        </div>

        {/* 非均一レイアウト：最初の1つを大きく */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {destinations[0] && (
            <Link
              href={`/destinations/${destinations[0].id}`}
              className="md:col-span-7 group"
            >
              <div className="relative bg-surface rounded-2xl overflow-hidden aspect-[4/3]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-foreground/10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <div className="flex gap-2 mb-3">
                    {destinations[0].tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-accent-light transition-colors">
                    {destinations[0].name}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed max-w-lg">
                    {destinations[0].description}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-white/50 text-xs">
                    <span>{destinations[0].area} / {destinations[0].prefecture}</span>
                    <span>{destinations[0].budgetRange}</span>
                    <span>{destinations[0].stayDuration[0]}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <div className="md:col-span-5 flex flex-col gap-6">
            {destinations.slice(1, 3).map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.id}`}
                className="group flex-1"
              >
                <div className="relative bg-surface rounded-2xl overflow-hidden h-full min-h-[180px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
                  <div className="absolute inset-0 bg-foreground/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <p className="text-xs text-white/60 mb-1">
                      {dest.area} / {dest.prefecture}
                    </p>
                    <h3 className="text-xl font-bold text-white group-hover:text-accent-light transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-white/60 text-sm mt-1 line-clamp-2">
                      {dest.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {destinations.slice(3, 6).map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.id}`}
              className="group bg-surface rounded-xl p-5 hover:bg-border transition-colors"
            >
              <p className="text-xs text-muted mb-2">
                {dest.area} · {dest.category[0]}
              </p>
              <h3 className="font-bold text-base group-hover:text-accent transition-colors">
                {dest.name}
              </h3>
              <p className="text-sm text-muted mt-2 line-clamp-2">
                {dest.description}
              </p>
              <div className="flex gap-2 mt-3">
                {dest.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-muted bg-background px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      <section className="bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-accent text-sm font-medium mb-2">ARTICLES</p>
              <h2 className="text-3xl font-bold">読むと旅に出たくなる</h2>
            </div>
            <Link
              href="/articles"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              すべて見る →
            </Link>
          </div>

          <div className="space-y-8">
            {featuredArticles.map((article, i) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group block"
              >
                <article
                  className={`bg-background rounded-2xl p-8 hover:shadow-lg transition-shadow ${
                    i === 0 ? "md:flex md:items-center md:gap-10" : ""
                  }`}
                >
                  <div className={i === 0 ? "md:flex-1" : ""}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-muted">{article.targetType}</span>
                      {article.readingTime && (
                        <span className="text-xs text-muted">
                          {article.readingTime}分で読める
                        </span>
                      )}
                    </div>
                    <h3
                      className={`font-bold group-hover:text-accent transition-colors leading-snug ${
                        i === 0 ? "text-2xl md:text-3xl" : "text-xl"
                      }`}
                    >
                      {article.title}
                    </h3>
                    <p className="text-muted mt-3 leading-relaxed">
                      {article.description}
                    </p>
                    <div className="flex gap-2 mt-4">
                      {article.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-muted bg-surface px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          この旅、どう回るのが気持ちいい？
        </h2>
        <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
          日程・人数・気分を入力するだけ。
          <br />
          あなたに刺さる旅先とモデルコースを提案します。
        </p>
        <Link
          href="/result"
          className="inline-block bg-accent text-white px-10 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
        >
          旅を提案してもらう
        </Link>
      </section>
    </>
  );
}
