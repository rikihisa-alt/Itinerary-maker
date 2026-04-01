import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllDestinations, getDestinationById, getArticlesForDestination } from "@/lib/contentLoader";

export function generateStaticParams() {
  return getAllDestinations().map((d) => ({ id: d.id }));
}

export default async function DestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = getDestinationById(id);
  if (!d) notFound();
  const articles = getArticlesForDestination(id);

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-cloud relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-5 md:px-10 py-20 md:py-32">
          <div className="flex items-center gap-2 mb-6 text-[11px] tracking-wider uppercase text-cloud/40">
            <Link href="/destinations" className="hover:text-cloud/70 transition-colors">観光地</Link>
            <span>/</span>
            <span>{d.area}</span>
            <span>/</span>
            <span>{d.prefecture}</span>
          </div>
          <h1 className="text-display text-4xl md:text-6xl lg:text-7xl mb-6">{d.name}</h1>
          <p className="text-lg text-cloud/50 max-w-2xl leading-relaxed">{d.description}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            {d.category.map((c) => (
              <span key={c} className="text-sm bg-cloud/10 px-4 py-1.5 rounded-full">{c}</span>
            ))}
            {d.rating && <span className="text-sm text-accent-soft">★ {d.rating}</span>}
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto px-5 md:px-10">
        {/* Info bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 -mt-8 relative z-10 mb-16">
          {[
            { l: "予算", v: d.budgetRange },
            { l: "滞在", v: d.stayDuration.join(" / ") },
            { l: "シーズン", v: d.bestSeason.join("・") },
            { l: "アクセス", v: d.access || "—" },
          ].map((x) => (
            <div key={x.l} className="bg-cloud rounded-xl p-4 shadow-sm border border-sand/30">
              <p className="text-[11px] text-stone mb-0.5">{x.l}</p>
              <p className="text-sm font-medium">{x.v}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <section className="mb-20">
          <div className="divider mb-4" />
          <h2 className="font-editorial text-2xl md:text-3xl font-bold mb-8">この場所の話</h2>
          <p className="text-base leading-[2.2] text-fg/75">{d.longDescription}</p>
        </section>

        {/* Features */}
        <section className="mb-20">
          <div className="divider mb-4" />
          <h2 className="font-editorial text-2xl md:text-3xl font-bold mb-8">ここでしかできない体験</h2>
          <div className="space-y-4">
            {d.features.map((f, i) => (
              <div key={f.label}
                className={`rounded-2xl p-6 md:p-8 ${i === 0 ? "bg-ink text-cloud" : "bg-cream"}`}>
                <p className={`text-[11px] tracking-wider font-medium mb-2 ${i === 0 ? "text-accent-soft" : "text-accent"}`}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-editorial text-xl font-bold mb-2">{f.label}</h3>
                <p className={`text-sm leading-relaxed ${i === 0 ? "text-cloud/60" : "text-stone"}`}>{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Highlights */}
        {d.highlights && d.highlights.length > 0 && (
          <section className="mb-20">
            <h2 className="font-editorial text-xl font-bold mb-5">見逃せないスポット</h2>
            <div className="flex flex-wrap gap-2">
              {d.highlights.map((h) => (
                <span key={h} className="bg-cream border border-sand/40 px-4 py-2 rounded-full text-sm">{h}</span>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        <section className="mb-20">
          <h2 className="font-editorial text-xl font-bold mb-5">こんな人に刺さる</h2>
          <div className="flex flex-wrap gap-2">
            {d.tags.map((t) => (
              <Link key={t} href={`/destinations?tag=${t}`} className="bg-cream hover:bg-sand/50 px-4 py-2 rounded-full text-sm transition-colors">{t}</Link>
            ))}
          </div>
        </section>

        {/* Articles */}
        {articles.length > 0 && (
          <section className="mb-20">
            <div className="divider mb-4" />
            <h2 className="font-editorial text-2xl font-bold mb-6">関連する記事</h2>
            <div className="space-y-3">
              {articles.map((a) => (
                <Link key={a.id} href={`/articles/${a.slug}`} className="group block bg-cream rounded-xl p-5 lift">
                  <span className="text-[11px] text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">{a.category}</span>
                  <h3 className="font-editorial font-bold mt-2 group-hover:text-accent transition-colors">{a.title}</h3>
                  <p className="text-sm text-stone mt-1">{a.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="text-center py-12 border-t border-sand/40">
          <p className="text-stone text-sm mb-4">{d.name}が気になったら</p>
          <Link href={`/itinerary?add=${d.id}`} className="pill pill-primary">
            しおりに追加する <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
