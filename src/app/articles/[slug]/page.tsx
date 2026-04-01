import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug, getDestinationsForArticle, getRelatedArticles } from "@/lib/contentLoader";
import { formatDate } from "@/lib/helpers";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  const dests = getDestinationsForArticle(article.id);
  const related = getRelatedArticles(article.id, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-cloud">
        <div className="max-w-[900px] mx-auto px-5 md:px-10 py-16 md:py-28">
          <div className="flex items-center gap-2 mb-8 text-[11px] tracking-wider uppercase text-cloud/40">
            <Link href="/articles" className="hover:text-cloud/70 transition-colors">記事</Link>
            <span>/</span>
            <span>{article.category}</span>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] font-medium bg-accent text-white px-3 py-1 rounded-full">{article.category}</span>
            <span className="text-[11px] text-cloud/40">{article.targetType}</span>
            {article.readingTime && <span className="text-[11px] text-cloud/40">{article.readingTime}分で読める</span>}
          </div>
          <h1 className="text-display text-3xl md:text-5xl mb-6">{article.title}</h1>
          <p className="text-lg text-cloud/50 leading-relaxed">{article.description}</p>
          <p className="text-[11px] text-cloud/30 mt-8">{formatDate(article.publishedAt)}</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[750px] mx-auto px-5 md:px-10 py-16 md:py-20">
        <div className="space-y-16">
          {article.content.map((sec, i) => {
            const dest = sec.destinationId ? dests.find((d) => d.id === sec.destinationId) : null;
            return (
              <section key={i} className="anim-fade" style={{ animationDelay: `${i * 0.05}s` }}>
                <h2 className="font-editorial text-xl md:text-2xl font-bold mb-5 leading-snug">{sec.heading}</h2>
                <p className="text-[15px] leading-[2.2] text-fg/75 whitespace-pre-line">{sec.body}</p>
                {dest && (
                  <Link href={`/destinations/${dest.id}`} className="group mt-6 block bg-cream rounded-xl p-5 lift">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-stone">{dest.area} / {dest.prefecture}</p>
                        <p className="font-editorial font-bold group-hover:text-accent transition-colors">{dest.name}</p>
                        <p className="text-[12px] text-stone mt-1">{dest.budgetRange} · {dest.stayDuration[0]}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[11px] text-accent">→</span>
                        <Link href={`/itinerary?add=${dest.id}`} className="text-[11px] bg-accent text-white px-3 py-1 rounded-full">しおり追加</Link>
                      </div>
                    </div>
                  </Link>
                )}
              </section>
            );
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-16 pt-10 border-t border-sand/40">
          {article.tags.map((t) => (
            <span key={t} className="text-[13px] bg-cream px-4 py-1.5 rounded-full text-stone">#{t}</span>
          ))}
        </div>

        {/* Destinations */}
        {dests.length > 0 && (
          <section className="mt-16">
            <div className="divider mb-4" />
            <h2 className="font-editorial text-xl font-bold mb-6">登場する観光地</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {dests.map((d) => (
                <Link key={d.id} href={`/destinations/${d.id}`} className="group bg-cream rounded-xl p-5 lift">
                  <p className="text-[11px] text-stone">{d.area} · {d.category[0]}</p>
                  <h3 className="font-editorial font-bold group-hover:text-accent transition-colors">{d.name}</h3>
                  <p className="text-[13px] text-stone mt-1 line-clamp-2">{d.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="divider mb-4" />
            <h2 className="font-editorial text-xl font-bold mb-6">こんな記事も</h2>
            <div className="space-y-3">
              {related.map((r) => (
                <Link key={r.id} href={`/articles/${r.slug}`} className="group block bg-cream rounded-xl p-5 lift">
                  <span className="text-[11px] text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">{r.category}</span>
                  <h3 className="font-editorial font-bold mt-2 group-hover:text-accent transition-colors">{r.title}</h3>
                  <p className="text-[13px] text-stone mt-1">{r.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
