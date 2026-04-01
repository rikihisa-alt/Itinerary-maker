import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug, getDestinationsForArticle, getRelatedArticles } from "@/lib/contentLoader";
import { formatDate } from "@/lib/helpers";

export function generateStaticParams() { return getAllArticles().map((a) => ({ slug: a.slug })); }

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticleBySlug(slug);
  if (!a) notFound();
  const dests = getDestinationsForArticle(a.id);
  const related = getRelatedArticles(a.id, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white pt-[100px] pb-[64px] md:pt-[140px] md:pb-[80px]">
        <div className="max-w-[720px] mx-auto px-[20px] md:px-[40px]">
          <div className="flex items-center gap-[8px] mb-[20px]">
            <Link href="/articles" className="text-[11px] font-[--mono] text-white/30 hover:text-white/60 transition-colors">Articles</Link>
            <span className="text-white/15">/</span>
            <span className="text-[11px] text-white/30">{a.category}</span>
          </div>
          <div className="flex items-center gap-[8px] mb-[16px]">
            <span className="text-[11px] font-medium bg-gold text-white px-[8px] py-[2px] rounded-full">{a.category}</span>
            <span className="text-[11px] text-white/30">{a.targetType}</span>
            {a.readingTime && <span className="text-[11px] text-white/30 font-[--mono]">{a.readingTime}min</span>}
          </div>
          <h1 className="font-[--serif] text-[28px] md:text-[40px] font-bold leading-[1.25] tracking-[-0.02em] mb-[16px]">{a.title}</h1>
          <p className="text-[15px] text-white/40 leading-[1.9]">{a.description}</p>
          <p className="text-[11px] text-white/20 mt-[24px] font-[--mono]">{formatDate(a.publishedAt)}</p>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-[640px] mx-auto px-[20px] md:px-[40px] py-[64px] md:py-[80px]">
        <div className="space-y-[56px]">
          {a.content.map((sec, i) => {
            const dest = sec.destinationId ? dests.find((dd) => dd.id === sec.destinationId) : null;
            return (
              <section key={i}>
                <h2 className="font-[--serif] text-[22px] font-bold mb-[16px] leading-[1.4]">{sec.heading}</h2>
                <p className="text-[15px] leading-[2.2] text-dim whitespace-pre-line">{sec.body}</p>
                {dest && (
                  <div className="mt-[20px] border-l-[3px] border-navy pl-[16px]">
                    <Link href={`/destinations/${dest.id}`} className="group block">
                      <p className="text-[11px] text-mute font-[--mono]">{dest.area} / {dest.prefecture}</p>
                      <p className="font-[--serif] font-bold group-hover:text-navy transition-colors">{dest.name}</p>
                      <p className="text-[12px] text-mute mt-[2px]">{dest.budgetRange} · {dest.stayDuration[0]}</p>
                    </Link>
                    <Link href={`/itinerary?add=${dest.id}`}
                      className="inline-block mt-[8px] text-[11px] bg-navy text-white px-[12px] py-[4px] rounded-full hover:bg-navy-light transition-colors">
                      しおりに追加
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-[6px] mt-[56px] pt-[32px] border-t border-warm">
          {a.tags.map((t) => <span key={t} className="text-[12px] text-dim bg-warm px-[10px] py-[4px] rounded-full">#{t}</span>)}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-[56px]">
            <h3 className="text-[14px] font-medium text-dim mb-[16px]">こんな記事も</h3>
            <div className="border-t border-warm">
              {related.map((r) => (
                <Link key={r.id} href={`/articles/${r.slug}`} className="group block py-[16px] border-b border-warm/60 hover:bg-white/40 transition-colors">
                  <span className="text-[11px] text-navy bg-navy/5 px-[8px] py-[2px] rounded-full">{r.category}</span>
                  <h4 className="font-[--serif] font-bold text-[16px] mt-[6px] group-hover:text-navy transition-colors">{r.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
