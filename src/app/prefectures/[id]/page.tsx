import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllPrefectures,
  getPrefectureById,
  getSpotsByPrefecture,
  getArticlesByPrefecture,
} from "@/lib/contentLoader";
import { SpotCardHero, SpotCardMedium, SpotCardList } from "@/components/ui/SpotCard";
import { ArticleCardCompact } from "@/components/ui/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function generateStaticParams() {
  return getAllPrefectures().map((p) => ({ id: p.id }));
}

export default async function PrefectureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prefecture = getPrefectureById(id);
  if (!prefecture) notFound();

  const spots = getSpotsByPrefecture(id);
  const articles = getArticlesByPrefecture(id);

  const heroSpot = spots[0];
  const mediumSpots = spots.slice(1, 5);
  const listSpots = spots.slice(5);

  return (
    <div className="pb-[120px]">
      {/* ── Hero ── */}
      <div className="relative">
        {prefecture.coverImage ? (
          <div className="relative aspect-[21/9] md:aspect-[3/1]">
            <Image
              src={prefecture.coverImage}
              alt={prefecture.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className="aspect-[21/9] md:aspect-[3/1] bg-accent" />
        )}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pb-[32px] md:pb-[48px]">
            <p className="mono text-[10px] text-white/40 tracking-[0.15em] uppercase mb-[6px]">
              {prefecture.nameEn}
            </p>
            <h1 className="serif text-[36px] md:text-[56px] text-white font-bold leading-[1.1] tracking-[-0.03em]">
              {prefecture.name}
            </h1>
            {prefecture.description && (
              <p className="text-[14px] text-white/40 mt-[10px] max-w-[480px] leading-[1.8]">
                {prefecture.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] mt-[48px]">
        {/* ── Spots ── */}
        {spots.length > 0 && (
          <section className="mb-[64px]">
            <SectionHeading label="Spots" title="観光スポット" />

            <div className="space-y-[24px]">
              {/* Hero spot */}
              {heroSpot && <SpotCardHero spot={heroSpot} />}

              {/* Medium grid */}
              {mediumSpots.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px]">
                  {mediumSpots.map((s) => (
                    <SpotCardMedium key={s.id} spot={s} />
                  ))}
                </div>
              )}

              {/* List */}
              {listSpots.length > 0 && (
                <div className="border-t border-g1">
                  {listSpots.map((s) => (
                    <SpotCardList key={s.id} spot={s} />
                  ))}
                </div>
              )}
            </div>

            <p className="mono text-[11px] text-g3 mt-[20px]">
              {spots.length} spots
            </p>
          </section>
        )}

        {/* ── Articles ── */}
        {articles.length > 0 && (
          <section className="mb-[64px]">
            <SectionHeading label="Articles" title="関連する記事" />
            <div className="border-t border-g1">
              {articles.map((a) => (
                <ArticleCardCompact key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}

        {/* ── CTA ── */}
        <section className="text-center py-[56px]">
          <p className="mono text-[10px] text-g4 tracking-[0.15em] uppercase mb-[8px]">
            Create Itinerary
          </p>
          <h2 className="serif text-[22px] md:text-[28px] font-bold mb-[20px]">
            この都道府県でしおりを作る
          </h2>
          <Link
            href="/create"
            className="inline-block bg-accent text-white text-[14px] font-bold px-[32px] py-[12px] rounded-full hover:opacity-90 transition-opacity"
          >
            しおりを作成する
          </Link>
        </section>

        {/* ── Empty state ── */}
        {spots.length === 0 && articles.length === 0 && (
          <div className="text-center py-[80px]">
            <p className="text-[14px] text-g4">
              この都道府県のコンテンツは準備中です
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
