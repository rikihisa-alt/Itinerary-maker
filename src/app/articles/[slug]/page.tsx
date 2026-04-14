import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug, getSpotById } from "@/lib/contentLoader";
import { ARTICLE_CATEGORY_LABEL } from "@/types/article";
import type { ArticleSection } from "@/types/article";
import type { Spot } from "@/types/spot";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

/* ── Spot inline card ── */
function SpotInlineCard({ spot }: { spot: Spot }) {
  return (
    <div className="my-[36px] rounded-[6px] overflow-hidden bg-cream border border-g1/60">
      <div className="md:flex">
        <div className="relative aspect-[16/10] md:aspect-auto md:w-[320px] shrink-0">
          <Image src={spot.images[0]} alt={spot.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 320px" />
        </div>
        <div className="p-[24px] md:p-[32px] flex flex-col justify-center">
          <div className="flex items-center gap-[8px] mb-[8px]">
            <div className="w-[6px] h-[6px] rounded-full bg-gold" />
            <p className="mono text-[10px] text-g4 tracking-[0.15em] uppercase">{spot.area}</p>
          </div>
          <h3 className="serif text-[20px] md:text-[22px] font-light leading-[1.3] mb-[8px] text-accent">{spot.title}</h3>
          <p className="text-[13px] text-g5 leading-[1.9] line-clamp-2 mb-[16px]">{spot.description}</p>
          <div className="flex gap-[10px]">
            <Link href={`/destinations/${spot.id}`}
              className="text-[11px] text-accent border-b border-accent/30 pb-[1px] hover:border-accent transition-colors">
              詳しく見る
            </Link>
            <Link href={`/itinerary?add=${spot.id}`}
              className="text-[11px] text-gold border-b border-gold/30 pb-[1px] hover:border-gold transition-colors">
              しおりに追加
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section renderer ── */
function RenderSection({ section, index }: { section: ArticleSection; index: number }) {
  switch (section.type) {
    case "heading": {
      const isH3 = section.level === 3;
      return (
        <div className={`${index > 0 ? "mt-[56px]" : "mt-[20px]"} mb-[20px]`}>
          {!isH3 && <div className="w-[32px] h-[2px] bg-gold mb-[16px]" />}
          {isH3 ? (
            <h3 className="serif text-[18px] md:text-[20px] font-light leading-[1.4] text-accent">{section.content}</h3>
          ) : (
            <h2 className="serif text-[24px] md:text-[30px] font-light leading-[1.3] tracking-[-0.01em] text-ink">{section.content}</h2>
          )}
        </div>
      );
    }
    case "text":
      return (
        <p className="text-[15px] text-g5 leading-[2.1] mb-[24px] tracking-[0.01em]">{section.content}</p>
      );
    case "spot-card": {
      const spot = getSpotById(section.content);
      if (!spot) return null;
      return <SpotInlineCard spot={spot} />;
    }
    case "image":
      return (
        <figure className="my-[40px]">
          <div className="relative aspect-[16/9] rounded-[4px] overflow-hidden">
            <Image src={section.content} alt={section.caption ?? ""} fill className="object-cover" sizes="100vw" />
          </div>
          {section.caption && <figcaption className="mono text-[11px] text-g3 mt-[10px] tracking-wide">{section.caption}</figcaption>}
        </figure>
      );
    case "callout":
      return (
        <div className="my-[32px] bg-accent/[0.03] border-l-[3px] border-gold px-[24px] py-[20px] rounded-r-[4px]">
          <p className="text-[14px] text-g5 leading-[2] italic">{section.content}</p>
        </div>
      );
    default:
      return null;
  }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = getAllArticles();
  const relatedArticles = (article.relatedArticleSlugs ?? [])
    .map((s) => allArticles.find((a) => a.slug === s))
    .filter(Boolean);

  // Get spots referenced in this article
  const articleSpots = article.spotIds.map(getSpotById).filter(Boolean);

  return (
    <div className="pb-[140px]">
      {/* ── Hero: Full-width cover image ── */}
      <div className="relative w-full" style={{ aspectRatio: "21/9", minHeight: "320px" }}>
        <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-[20px] md:p-[48px] lg:p-[64px] max-w-[1440px] mx-auto">
          <div className="flex items-center gap-[12px] mb-[14px]">
            <span className="px-[10px] py-[3px] border border-gold/40 text-gold text-[10px] mono tracking-[0.1em] rounded-full">
              {ARTICLE_CATEGORY_LABEL[article.category]}
            </span>
            <span className="mono text-[11px] text-white/30 tracking-[0.1em]">{article.publishedAt}</span>
          </div>
          <h1 className="serif text-[28px] md:text-[44px] lg:text-[52px] font-light leading-[1.15] tracking-[-0.02em] text-white max-w-[800px]">
            {article.title}
          </h1>
        </div>
      </div>

      {/* ── Description bar ── */}
      <div className="bg-accent">
        <div className="max-w-[800px] mx-auto px-[20px] md:px-[32px] py-[28px] md:py-[36px]">
          <p className="text-[14px] md:text-[15px] text-white/40 leading-[1.9] font-light">{article.description}</p>
          <div className="flex items-center gap-[12px] mt-[14px]">
            <div className="w-[24px] h-[1px] bg-gold/40" />
            <span className="text-[11px] text-white/20">{article.author}</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[800px] mx-auto px-[20px] md:px-[32px] mt-[56px] md:mt-[72px]">
        {article.sections.map((sec, i) => (
          <RenderSection key={i} section={sec} index={i} />
        ))}
      </div>

      {/* ── Tags ── */}
      <div className="max-w-[800px] mx-auto px-[20px] md:px-[32px] mt-[56px] pt-[32px] border-t border-g1">
        <div className="flex flex-wrap gap-[8px]">
          {article.tags.map((t) => (
            <span key={t} className="mono text-[11px] text-g4 bg-cream border border-g2/60 px-[12px] py-[4px] rounded-full tracking-wide">#{t}</span>
          ))}
        </div>
      </div>

      {/* ── Spots from this article ── */}
      {articleSpots.length > 0 && (
        <div className="max-w-[800px] mx-auto px-[20px] md:px-[32px] mt-[56px]">
          <div className="flex items-center gap-[10px] mb-[20px]">
            <div className="w-[32px] h-[2px] bg-gold" />
            <p className="mono text-[12px] tracking-[0.15em] uppercase text-g4">Spots in this article</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[12px]">
            {articleSpots.map((s) => s && (
              <Link key={s.id} href={`/destinations/${s.id}`} className="group block relative rounded-[4px] overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <Image src={s.images[0]} alt={s.title} fill className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" sizes="33vw" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
                <div className="absolute bottom-0 p-[14px]">
                  <p className="serif text-[14px] text-white font-light">{s.title}</p>
                  <p className="mono text-[9px] text-white/40 mt-[2px]">{s.area}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Related articles ── */}
      {relatedArticles.length > 0 && (
        <div className="max-w-[800px] mx-auto px-[20px] md:px-[32px] mt-[64px]">
          <div className="flex items-center gap-[10px] mb-[24px]">
            <div className="w-[32px] h-[2px] bg-accent" />
            <p className="mono text-[12px] tracking-[0.15em] uppercase text-g4">Related</p>
          </div>
          <div className="flex flex-col gap-[1px]">
            {relatedArticles.map((a) => a && (
              <Link key={a.slug} href={`/articles/${a.slug}`}
                className="group flex items-center justify-between py-[20px] border-b border-g1/60 hover:bg-cream/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-[8px] mb-[4px]">
                    <span className="mono text-[9px] text-accent bg-accent/5 px-[6px] py-[1px] rounded tracking-wider uppercase">{ARTICLE_CATEGORY_LABEL[a.category]}</span>
                  </div>
                  <h4 className="serif text-[16px] font-light group-hover:text-accent transition-colors truncate">{a.title}</h4>
                </div>
                <svg className="shrink-0 ml-[12px] text-g3 group-hover:text-accent transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="max-w-[800px] mx-auto px-[20px] md:px-[32px] mt-[72px] text-center">
        <div className="w-[1px] h-[40px] bg-g2 mx-auto mb-[24px]" />
        <p className="mono text-[10px] tracking-[0.2em] uppercase text-g4 mb-[12px]">Itinerary Craft</p>
        <p className="serif text-[20px] md:text-[24px] font-light text-accent mb-[24px]">この旅を、しおりにする。</p>
        <Link href="/create" className="inline-flex items-center gap-[8px] bg-gold text-white px-[28px] py-[13px] rounded-full text-[13px] font-medium hover:bg-[#a3864a] transition-colors">
          しおりを作る
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
        </Link>
      </div>
    </div>
  );
}
