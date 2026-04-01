import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllSpots, getSpotById, getNearbySpots } from "@/lib/contentLoader";

export function generateStaticParams() { return getAllSpots().map((s) => ({ id: s.id })); }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getSpotById(id);
  if (!s) notFound();
  const nearby = getNearbySpots(id);
  const crowd = s.crowdLevel === "low" ? "低い" : s.crowdLevel === "medium" ? "ふつう" : "高い";

  return (
    <div>
      {/* Hero — fullscreen photo */}
      <section className="relative h-[70vh] min-h-[400px] bg-ink overflow-hidden">
        <Image src={s.images[0]} alt={s.title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative h-full max-w-[1440px] mx-auto px-[20px] md:px-[48px] flex flex-col justify-end pb-[44px] md:pb-[60px]">
          <p className="mono text-[10px] tracking-[0.15em] uppercase text-white/30 mb-[10px]">
            <Link href="/destinations" className="hover:text-white/60 transition-colors">Destinations</Link>
            <span className="mx-[5px]">/</span>{s.area}
          </p>
          <h1 className="serif text-[36px] md:text-[56px] lg:text-[72px] text-white font-bold leading-[1.1] tracking-[-0.03em] mb-[8px]">{s.title}</h1>
          <p className="text-[14px] text-white/40 max-w-[400px]">{s.description}</p>
        </div>
      </section>

      <div className="max-w-[720px] mx-auto px-[20px] md:px-[36px]">
        {/* Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[20px] gap-y-[14px] py-[28px] border-b border-g1 mb-[56px]">
          {[
            { l: "滞在目安", v: `${s.stayDuration}分` },
            { l: "混雑度", v: crowd },
            { l: "ベスト", v: s.bestTime },
            { l: "雨天", v: s.rainyDay ? "OK" : "不向き" },
            { l: "予算", v: s.budget },
            { l: "アクセス", v: s.access },
          ].map((x) => (
            <div key={x.l}>
              <p className="text-[10px] text-g3 mb-[1px]">{x.l}</p>
              <p className="text-[13px] font-medium">{x.v}</p>
            </div>
          ))}
        </div>

        {/* 2枚目の画像（あれば） */}
        {s.images[1] && (
          <div className="relative rounded-[8px] overflow-hidden mb-[56px]" style={{ aspectRatio: "16/9" }}>
            <Image src={s.images[1]} alt={`${s.title} 2`} fill className="object-cover" sizes="720px" />
          </div>
        )}

        <section className="mb-[64px]">
          <h2 className="serif text-[22px] font-bold mb-[18px]">概要</h2>
          <p className="text-[14px] leading-[2.1] text-g5">{s.longDescription}</p>
        </section>

        <section className="mb-[64px]">
          <h2 className="serif text-[22px] font-bold mb-[24px]">見どころ</h2>
          <div className="space-y-[12px]">
            {s.features.map((f, i) => (
              <div key={f.label} className={i === 0
                ? "bg-accent text-white rounded-[8px] p-[24px] md:p-[30px]"
                : "border-b border-g1 pb-[16px]"
              }>
                <p className={`mono text-[10px] mb-[4px] ${i === 0 ? "text-gold" : "text-g3"}`}>{String(i + 1).padStart(2, "0")}</p>
                <h3 className={`serif font-bold mb-[4px] ${i === 0 ? "text-[20px]" : "text-[16px]"}`}>{f.label}</h3>
                <p className={`text-[13px] leading-[1.8] ${i === 0 ? "text-white/50" : "text-g4"}`}>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {s.highlights.length > 0 && (
          <section className="mb-[56px]">
            <h3 className="text-[13px] font-medium text-g4 mb-[10px]">スポット</h3>
            <div className="flex flex-wrap gap-[6px]">
              {s.highlights.map((h) => (
                <span key={h} className="text-[12px] border border-g2 px-[12px] py-[5px] rounded-full">{h}</span>
              ))}
            </div>
          </section>
        )}

        <section className="mb-[56px]">
          <h3 className="text-[13px] font-medium text-g4 mb-[10px]">タグ</h3>
          <div className="flex flex-wrap gap-[5px]">
            {s.tags.map((t) => (
              <span key={t} className="text-[11px] bg-g1 px-[10px] py-[4px] rounded-full text-g5">{t}</span>
            ))}
          </div>
        </section>

        {nearby.length > 0 && (
          <section className="mb-[56px]">
            <h2 className="serif text-[22px] font-bold mb-[18px]">周辺スポット</h2>
            <div className="space-y-[12px]">
              {nearby.map((n) => (
                <Link key={n.id} href={`/destinations/${n.id}`} className="group flex gap-[14px] items-center">
                  <div className="w-[72px] h-[72px] rounded-[6px] overflow-hidden shrink-0 relative">
                    <Image src={n.images[0]} alt={n.title} fill className="object-cover" sizes="72px" />
                  </div>
                  <div>
                    <p className="mono text-[10px] text-g3 mb-[1px]">{n.area}</p>
                    <h3 className="serif text-[16px] font-bold group-hover:text-accent transition-colors">{n.title}</h3>
                    <p className="text-[12px] text-g4 mt-[1px] line-clamp-1">{n.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="border-t border-g1 pt-[36px] pb-[80px]">
          <p className="text-[12px] text-g4 mb-[12px]">{s.title}が気になったら</p>
          <Link href={`/itinerary?add=${s.id}`}
            className="inline-block bg-accent text-white px-[24px] py-[10px] rounded-full text-[13px] font-medium hover:bg-accent2 transition-colors">
            しおりに追加する
          </Link>
        </div>
      </div>
    </div>
  );
}
