import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllArticles,
  getArticleBySlug,
  getDestinationsForArticle,
  getRelatedArticles,
} from "@/lib/contentLoader";
import { formatDate } from "@/lib/helpers";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const destinations = getDestinationsForArticle(article.id);
  const relatedArticles = getRelatedArticles(article.id, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/articles" className="text-background/40 hover:text-background/70 text-sm transition-colors">
              記事
            </Link>
            <span className="text-background/30">/</span>
            <span className="text-background/50 text-sm">{article.category}</span>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-medium bg-accent text-white px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-background/50">{article.targetType}</span>
            {article.readingTime && (
              <span className="text-xs text-background/50">{article.readingTime}分で読める</span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-background/60 leading-relaxed max-w-2xl">
            {article.description}
          </p>
          <p className="text-sm text-background/40 mt-6">
            {formatDate(article.publishedAt)}
            {article.updatedAt && ` (更新: ${formatDate(article.updatedAt)})`}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Article Content */}
        <div className="space-y-12">
          {article.content.map((section, i) => {
            const linkedDest = section.destinationId
              ? destinations.find((d) => d.id === section.destinationId)
              : null;

            return (
              <section key={i}>
                <h2 className="text-2xl font-bold mb-4 leading-snug">
                  {section.heading}
                </h2>
                <div className="text-base leading-[2] text-foreground/80 whitespace-pre-line">
                  {section.body}
                </div>

                {/* 関連観光地カード */}
                {linkedDest && (
                  <Link
                    href={`/destinations/${linkedDest.id}`}
                    className="group mt-6 block bg-surface rounded-xl p-5 hover:bg-border/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted mb-1">{linkedDest.area} / {linkedDest.prefecture}</p>
                        <p className="font-bold group-hover:text-accent transition-colors">
                          {linkedDest.name}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                          <span>{linkedDest.budgetRange}</span>
                          <span>{linkedDest.stayDuration[0]}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-accent">詳しく見る →</span>
                        <Link
                          href={`/itinerary?add=${linkedDest.id}`}
                          className="text-xs bg-accent text-white px-3 py-1 rounded-full hover:opacity-90"
                        >
                          しおりに追加
                        </Link>
                      </div>
                    </div>
                  </Link>
                )}
              </section>
            );
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
          {article.tags.map((tag) => (
            <span key={tag} className="text-sm bg-surface px-4 py-1.5 rounded-full text-muted">
              #{tag}
            </span>
          ))}
        </div>

        {/* 関連観光地 */}
        {destinations.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">この記事に登場する観光地</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations.map((dest) => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.id}`}
                  className="group bg-surface rounded-xl p-5 hover:bg-border/60 transition-colors"
                >
                  <p className="text-xs text-muted mb-1">{dest.area} · {dest.category[0]}</p>
                  <h3 className="font-bold group-hover:text-accent transition-colors">{dest.name}</h3>
                  <p className="text-sm text-muted mt-2 line-clamp-2">{dest.description}</p>
                  <div className="flex gap-2 mt-3">
                    {dest.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs text-muted bg-background px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 関連記事 */}
        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">こんな記事も刺さるかも</h2>
            <div className="space-y-4">
              {relatedArticles.map((ra) => (
                <Link
                  key={ra.id}
                  href={`/articles/${ra.slug}`}
                  className="group block bg-surface rounded-xl p-6 hover:bg-border/60 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {ra.category}
                    </span>
                    <span className="text-xs text-muted">{ra.targetType}</span>
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-accent transition-colors">
                    {ra.title}
                  </h3>
                  <p className="text-sm text-muted mt-2">{ra.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
