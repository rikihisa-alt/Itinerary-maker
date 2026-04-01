import Link from "next/link";
import { Article } from "@/types/article";
import { Destination } from "@/types/destination";

/* ── Pattern A: 左テキスト + 右大画像 ── */
export function SplitFeature({ dest }: { dest: Destination }) {
  return (
    <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px]">
      <Link href={`/destinations/${dest.id}`} className="group block">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] md:gap-[48px] items-center">
          {/* Text — narrow */}
          <div className="md:col-span-4 md:pr-[24px]">
            <p className="text-[11px] font-[--mono] tracking-[0.15em] uppercase text-dim mb-[12px]">
              {dest.area} — {dest.prefecture}
            </p>
            <h2 className="font-[--serif] text-[26px] font-bold tracking-[-0.01em] mb-[12px] group-hover:text-navy transition-colors leading-[1.3]">
              {dest.name}
            </h2>
            <p className="text-[14px] text-dim leading-[1.9] mb-[20px]">
              {dest.description}
            </p>
            <div className="flex items-center gap-[12px] text-[12px] text-mute">
              <span>{dest.budgetRange}</span>
              <span>{dest.stayDuration[0]}</span>
            </div>
          </div>
          {/* Image — wide */}
          <div className="md:col-span-8 imgz">
            <div className="relative rounded-[12px] overflow-hidden aspect-[16/10]">
              <div className="absolute inset-0 bg-gradient-to-br from-navy/30 via-dark/10 to-dark/20" />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

/* ── Pattern B: 2カラム非対称 ── */
export function AsymmetricDuo({ left, right }: { left: Destination; right: Destination }) {
  return (
    <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-[16px]">
        {/* Left — 大きい */}
        <div className="md:col-span-7">
          <Link href={`/destinations/${left.id}`} className="group imgz block">
            <div className="relative rounded-[12px] overflow-hidden aspect-[4/5] md:aspect-[3/4]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a3a]/50 to-dark/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 p-[24px] md:p-[32px] z-10">
                <p className="text-[11px] font-[--mono] text-white/30 mb-[4px]">{left.area}</p>
                <h3 className="font-[--serif] text-[22px] md:text-[28px] text-white font-bold leading-[1.2] mb-[8px]">
                  {left.name}
                </h3>
                <p className="text-[13px] text-white/40 max-w-[320px] leading-[1.7]">
                  {left.description}
                </p>
              </div>
            </div>
          </Link>
        </div>
        {/* Right — 小さい、上にオフセット */}
        <div className="md:col-span-5 md:pt-[64px]">
          <Link href={`/destinations/${right.id}`} className="group imgz block">
            <div className="relative rounded-[12px] overflow-hidden aspect-[4/3]">
              <div className="absolute inset-0 bg-gradient-to-br from-dark/20 to-[#2d3a28]/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 p-[20px] z-10">
                <p className="text-[11px] font-[--mono] text-white/30 mb-[4px]">{right.area}</p>
                <h3 className="font-[--serif] text-[18px] text-white font-bold">{right.name}</h3>
              </div>
            </div>
            <p className="text-[13px] text-dim mt-[12px] leading-[1.8] line-clamp-2">
              {right.description}
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Pattern C: フル幅バナー + キャプション ── */
export function FullBanner({ dest }: { dest: Destination }) {
  return (
    <section>
      <Link href={`/destinations/${dest.id}`} className="group imgz block">
        <div className="relative rounded-none md:rounded-[16px] md:mx-[48px] overflow-hidden aspect-[21/9]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-navy/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-[24px] md:p-[48px] z-10 max-w-[500px]">
            <p className="text-[11px] font-[--mono] text-white/30 tracking-[0.15em] uppercase mb-[8px]">{dest.area}</p>
            <h2 className="font-[--serif] text-[26px] md:text-[36px] text-white font-bold leading-[1.2] mb-[8px] group-hover:text-gold transition-colors">
              {dest.name}
            </h2>
            <p className="text-[13px] text-white/40 leading-[1.8]">{dest.description}</p>
          </div>
        </div>
      </Link>
    </section>
  );
}

/* ── Pattern D: 小テキストブロック（記事プロモ） ── */
export function ArticlePromo({ articles }: { articles: Article[] }) {
  return (
    <section className="max-w-[1440px] mx-auto px-[20px] md:px-[48px]">
      <div className="flex items-end justify-between mb-[32px]">
        <div>
          <p className="text-[11px] font-[--mono] tracking-[0.15em] uppercase text-dim mb-[8px]">Articles</p>
          <h2 className="font-[--serif] text-[26px] font-bold tracking-[-0.01em]">読むと、出たくなる。</h2>
        </div>
        <Link href="/articles" className="text-[13px] text-dim hover:text-dark transition-colors hidden md:block">
          すべて見る →
        </Link>
      </div>

      <div className="space-y-[1px] bg-warm rounded-[12px] overflow-hidden">
        {articles.map((a, i) => (
          <Link key={a.id} href={`/articles/${a.slug}`} className="group block bg-white hover:bg-off transition-colors">
            <div className={`px-[24px] md:px-[32px] ${i === 0 ? "py-[32px]" : "py-[24px]"}`}>
              <div className="flex items-center gap-[8px] mb-[8px]">
                <span className="text-[11px] font-medium text-navy bg-navy/5 px-[8px] py-[2px] rounded-full">{a.category}</span>
                <span className="text-[11px] text-mute">{a.targetType}</span>
                {a.readingTime && <span className="text-[11px] text-mute font-[--mono]">{a.readingTime}min</span>}
              </div>
              <h3 className={`font-[--serif] font-bold leading-[1.4] group-hover:text-navy transition-colors ${
                i === 0 ? "text-[22px] md:text-[26px]" : "text-[18px]"
              }`}>
                {a.title}
              </h3>
              {i === 0 && (
                <p className="text-[14px] text-dim mt-[8px] leading-[1.8] max-w-[600px]">{a.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
