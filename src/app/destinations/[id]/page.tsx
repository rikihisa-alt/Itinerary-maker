import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllDestinations, getDestinationById, getArticlesForDestination } from "@/lib/contentLoader";

export function generateStaticParams() { return getAllDestinations().map((d) => ({ id: d.id })); }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = getDestinationById(id);
  if (!d) notFound();
  const arts = getArticlesForDestination(id);

  return (
    <div>
      {/* Hero — フル幅写真 */}
      <section className="relative h-[70vh] min-h-[400px] bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/40 via-dark/20 to-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative h-full max-w-[1440px] mx-auto px-[20px] md:px-[48px] flex flex-col justify-end pb-[48px] md:pb-[64px]">
          <p className="text-[11px] font-[--mono] tracking-[0.15em] uppercase text-white/30 mb-[12px]">
            <Link href="/destinations" className="hover:text-white/60 transition-colors">Destinations</Link>
            <span className="mx-[6px]">/</span>{d.area}<span className="mx-[6px]">/</span>{d.prefecture}
          </p>
          <h1 className="font-[--serif] text-[40px] md:text-[56px] lg:text-[72px] text-white font-bold leading-[1.1] tracking-[-0.02em] mb-[12px]">
            {d.name}
          </h1>
          <p className="text-[15px] text-white/40 max-w-[500px] leading-[1.8]">{d.description}</p>
        </div>
      </section>

      <div className="max-w-[800px] mx-auto px-[20px] md:px-[40px]">
        {/* Info — 線で区切る、カード不使用 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[24px] gap-y-[16px] py-[32px] border-b border-warm mb-[64px]">
          {[
            { l: "予算", v: d.budgetRange }, { l: "滞在", v: d.stayDuration.join(" / ") },
            { l: "シーズン", v: d.bestSeason.join("・") }, { l: "アクセス", v: d.access || "—" },
          ].map((x) => (
            <div key={x.l}>
              <p className="text-[11px] text-mute mb-[2px]">{x.l}</p>
              <p className="text-[14px] font-medium">{x.v}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <section className="mb-[80px]">
          <h2 className="font-[--serif] text-[26px] font-bold mb-[24px]">この場所の話</h2>
          <p className="text-[15px] leading-[2.2] text-dim">{d.longDescription}</p>
        </section>

        {/* Features — 主役+脇役 */}
        <section className="mb-[80px]">
          <h2 className="font-[--serif] text-[26px] font-bold mb-[32px]">ここでしかできない体験</h2>
          <div className="space-y-[16px]">
            {d.features.map((f, i) => (
              <div key={f.label}
                className={i === 0
                  ? "bg-navy text-white rounded-[12px] p-[28px] md:p-[36px]"
                  : "border-b border-warm pb-[20px]"
                }>
                <p className={`font-[--mono] text-[11px] mb-[6px] ${i === 0 ? "text-gold" : "text-mute"}`}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className={`font-[--serif] font-bold mb-[6px] ${i === 0 ? "text-[22px]" : "text-[18px]"}`}>{f.label}</h3>
                <p className={`text-[14px] leading-[1.9] ${i === 0 ? "text-white/50" : "text-dim"}`}>{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Highlights */}
        {d.highlights && d.highlights.length > 0 && (
          <section className="mb-[64px]">
            <h3 className="text-[14px] font-medium text-dim mb-[12px]">見逃せないスポット</h3>
            <div className="flex flex-wrap gap-[8px]">
              {d.highlights.map((h) => (
                <span key={h} className="text-[13px] border border-warm px-[14px] py-[6px] rounded-full">{h}</span>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        <section className="mb-[64px]">
          <h3 className="text-[14px] font-medium text-dim mb-[12px]">こんな人に</h3>
          <div className="flex flex-wrap gap-[6px]">
            {d.tags.map((t) => (
              <Link key={t} href={`/destinations?tag=${t}`} className="text-[12px] bg-warm px-[12px] py-[5px] rounded-full hover:bg-mute/20 transition-colors">{t}</Link>
            ))}
          </div>
        </section>

        {/* Articles */}
        {arts.length > 0 && (
          <section className="mb-[64px]">
            <h2 className="font-[--serif] text-[22px] font-bold mb-[20px]">関連する記事</h2>
            <div className="border-t border-warm">
              {arts.map((a) => (
                <Link key={a.id} href={`/articles/${a.slug}`} className="group block py-[16px] border-b border-warm/60 hover:bg-white/40 transition-colors">
                  <span className="text-[11px] text-navy bg-navy/5 px-[8px] py-[2px] rounded-full">{a.category}</span>
                  <h3 className="font-[--serif] font-bold text-[16px] mt-[6px] group-hover:text-navy transition-colors">{a.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="border-t border-warm pt-[40px] pb-[80px]">
          <p className="text-[13px] text-dim mb-[16px]">{d.name}が気になったら</p>
          <Link href={`/itinerary?add=${d.id}`}
            className="inline-block bg-navy text-white px-[28px] py-[12px] rounded-full text-[14px] font-medium hover:bg-navy-light transition-colors">
            しおりに追加する
          </Link>
        </div>
      </div>
    </div>
  );
}
