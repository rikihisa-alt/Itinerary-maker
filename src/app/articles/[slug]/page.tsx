import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllArticles,
  getArticleBySlug,
  getSpotById,
} from "@/lib/contentLoader";
import { ARTICLE_CATEGORY_LABEL } from "@/types/article";
import type { ArticleSection } from "@/types/article";
import type { Spot } from "@/types/spot";
import { ArticleCardCompact } from "@/components/ui/ArticleCard";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

/* ── Spot inline card ── */
function SpotInlineCard({ spot }: { spot: Spot }) {
  return (
    <div className="my-[28px] rounded-[8px] overflow-hidden outline outline-1 outline-g2/40 bg-white">
      <div className="md:flex">
        <div className="relative aspect-[16/10] md:aspect-auto md:w-[280px] shrink-0">
          <Image
            src={spot.images[0]}
            alt={spot.title}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 280px"
          />
        </div>
        <div className="p-[20px] md:p-[24px] flex flex-col justify-center">
          <p className="mono text-[10px] text-g3 tracking-wider uppercase mb-[4px]">
            {spot.area} / {spot.prefecture}
          </p>
          <h3 className="serif text-[18px] font-bold leading-[1.3] mb-[6px]">
            {spot.title}
          </h3>
          <p className="text-[13px] text-g4 leading-[1.8] line-clamp-2 mb-[12px]">
            {spot.description}
          </p>
          <Link
            href={`/itinerary?add=${spot.id}`}
            className="inline-block text-[11px] text-accent border border-accent/20 px-[14px] py-[5px] rounded-full hover:bg-accent/5 transition-colors self-start"
          >
            しおりに追加
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Section renderer ── */
function RenderSection({ section }: { section: ArticleSection }) {
  switch (section.type) {
    case "heading": {
      const Tag = section.level === 3 ? "h3" : "h2";
      const size =
        section.level === 3
          ? "text-[18px] md:text-[20px]"
          : "text-[22px] md:text-[26px]";
      return (
        <Tag
          className={`serif ${size} font-bold leading-[1.3] mt-[48px] mb-[16px]`}
        >
          {section.content}
        </Tag>
      );
    }
    case "text":
      return (
        <p className="text-[15px] text-g5 leading-[2] mb-[20px]">
          {section.content}
        </p>
      );
    case "spot-card": {
      const spot = getSpotById(section.content);
      if (!spot) return null;
      return <SpotInlineCard spot={spot} />;
    }
    case "image":
      return (
        <figure className="my-[32px]">
          <div className="relative aspect-[16/9] rounded-[6px] overflow-hidden">
            <Image
              src={section.content}
              alt={section.caption ?? ""}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          {section.caption && (
            <figcaption className="text-[11px] text-g3 mt-[8px]">
              {section.caption}
            </figcaption>
          )}
        </figure>
      );
    case "callout":
      return (
        <div className="my-[24px] bg-accent/5 border-l-[3px] border-accent px-[20px] py-[16px] rounded-r-[6px]">
          <p className="text-[14px] text-g5 leading-[1.8]">
            {section.content}
          </p>
        </div>
      );
    default:
      return null;
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = getAllArticles();
  const relatedArticles = (article.relatedArticleSlugs ?? [])
    .map((s) => allArticles.find((a) => a.slug === s))
    .filter(Boolean);

  return (
    <div className="pb-[120px]">
      {/* ── Hero ── */}
      <div className="bg-accent text-white">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pt-[100px] pb-[56px]">
          <p className="mono text-[10px] text-white/30 tracking-[0.15em] uppercase mb-[10px]">
            {ARTICLE_CATEGORY_LABEL[article.category]}
          </p>
          <h1 className="serif text-[28px] md:text-[44px] font-bold leading-[1.15] tracking-[-0.02em] max-w-[720px] mb-[14px]">
            {article.title}
          </h1>
          <p className="text-[14px] text-white/40 leading-[1.8] max-w-[600px] mb-[20px]">
            {article.description}
          </p>
          <div className="flex items-center gap-[16px]">
            <span className="text-[11px] text-white/25">
              {article.author}
            </span>
            <span className="text-[11px] text-white/25">
              {article.publishedAt}
            </span>
          </div>
        </div>
      </div>

      {/* ── Cover image ── */}
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] -mt-[1px]">
        <div className="relative aspect-[21/9] rounded-b-[8px] overflow-hidden outline outline-1 outline-g2/20">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[720px] mx-auto px-[20px] md:px-[32px] mt-[48px]">
        {article.sections.map((sec, i) => (
          <RenderSection key={i} section={sec} />
        ))}
      </div>

      {/* ── Tags ── */}
      <div className="max-w-[720px] mx-auto px-[20px] md:px-[32px] mt-[48px] pt-[32px] border-t border-g1">
        <div className="flex flex-wrap gap-[8px]">
          {article.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] text-g3 bg-white border border-g2 px-[10px] py-[3px] rounded-full"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Related articles ── */}
      {relatedArticles.length > 0 && (
        <div className="max-w-[720px] mx-auto px-[20px] md:px-[32px] mt-[56px]">
          <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[6px]">
            Related
          </p>
          <h2 className="serif text-[24px] font-bold mb-[20px]">
            関連する記事
          </h2>
          <div className="border-t border-g1">
            {relatedArticles.map(
              (a) => a && <ArticleCardCompact key={a.slug} article={a} />,
            )}
          </div>
        </div>
      )}
    </div>
  );
}
