import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllDestinations, getDestinationById, getArticlesForDestination } from "@/lib/contentLoader";

export function generateStaticParams() {
  return getAllDestinations().map((d) => ({ id: d.id }));
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = getDestinationById(id);
  if (!destination) notFound();

  const relatedArticles = getArticlesForDestination(id);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 to-foreground/70" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/destinations" className="text-background/40 hover:text-background/70 text-sm transition-colors">
              観光地
            </Link>
            <span className="text-background/30">/</span>
            <span className="text-background/60 text-sm">{destination.area}</span>
            <span className="text-background/30">/</span>
            <span className="text-background/60 text-sm">{destination.prefecture}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{destination.name}</h1>
          <p className="text-lg md:text-xl text-background/60 max-w-2xl leading-relaxed">
            {destination.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            {destination.category.map((c) => (
              <span key={c} className="text-sm bg-background/10 px-4 py-1.5 rounded-full">
                {c}
              </span>
            ))}
            {destination.rating && (
              <span className="text-sm font-medium text-accent-light">
                ★ {destination.rating}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* 基本情報バー */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 -mt-8 relative z-10">
          {[
            { label: "予算目安", value: destination.budgetRange },
            { label: "滞在期間", value: destination.stayDuration.join(" / ") },
            { label: "ベストシーズン", value: destination.bestSeason.join("・") },
            { label: "アクセス", value: destination.access || "—" },
          ].map((item) => (
            <div key={item.label} className="bg-surface rounded-xl p-5">
              <p className="text-xs text-muted mb-1">{item.label}</p>
              <p className="font-medium text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        {/* ストーリー（longDescription） */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">この場所の話をしよう</h2>
          <div className="bg-surface rounded-2xl p-8 md:p-10">
            <p className="text-base leading-[2] text-foreground/80">
              {destination.longDescription}
            </p>
          </div>
        </section>

        {/* 体験（Features） - 非均一レイアウト */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">ここでしかできない体験</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {destination.features.map((feature, i) => (
              <div
                key={feature.label}
                className={`rounded-2xl p-6 md:p-8 ${
                  i === 0
                    ? "md:col-span-2 bg-foreground text-background"
                    : "bg-surface"
                }`}
              >
                <p className={`text-sm font-medium mb-2 ${i === 0 ? "text-accent-light" : "text-accent"}`}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className={`text-xl font-bold mb-3 ${i === 0 ? "" : ""}`}>
                  {feature.label}
                </h3>
                <p className={`leading-relaxed ${i === 0 ? "text-background/70 text-base" : "text-muted text-sm"}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ハイライト */}
        {destination.highlights && destination.highlights.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">見逃せないスポット</h2>
            <div className="flex flex-wrap gap-3">
              {destination.highlights.map((h) => (
                <span key={h} className="bg-surface px-5 py-2.5 rounded-full text-sm font-medium">
                  {h}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* タグ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">この旅はこんな人に刺さる</h2>
          <div className="flex flex-wrap gap-2">
            {destination.tags.map((tag) => (
              <Link
                key={tag}
                href={`/destinations?tag=${tag}`}
                className="bg-surface hover:bg-border px-5 py-2 rounded-full text-sm transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>

        {/* 関連記事 */}
        {relatedArticles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">この場所が出てくる記事</h2>
            <div className="space-y-4">
              {relatedArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group block bg-surface rounded-xl p-6 hover:bg-border/60 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted">{article.targetType}</span>
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-accent transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted mt-2">{article.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* しおりに追加CTA */}
        <section className="text-center py-10 border-t border-border">
          <p className="text-muted mb-4">
            {destination.name}が気になったら
          </p>
          <Link
            href={`/itinerary?add=${destination.id}`}
            className="inline-block bg-accent text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            しおりに追加する
          </Link>
        </section>
      </div>
    </div>
  );
}
