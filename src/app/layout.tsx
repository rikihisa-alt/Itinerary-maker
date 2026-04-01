import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "旅のしおり – 行きたくなる旅を、ここから",
  description: "あなたに刺さる旅先を提案し、そのまま旅のしおりまで作れるサービス。",
};

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/70 backdrop-blur-xl border-b border-sand/30">
      <nav className="max-w-[1400px] mx-auto px-5 md:px-10 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="font-editorial text-xl text-accent font-bold">旅</span>
          <span className="text-sm font-medium tracking-wide hidden sm:block">旅のしおり</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/destinations" className="px-3 py-1.5 text-[13px] text-stone hover:text-fg rounded-lg hover:bg-cream/60 transition-all">
            観光地
          </Link>
          <Link href="/articles" className="px-3 py-1.5 text-[13px] text-stone hover:text-fg rounded-lg hover:bg-cream/60 transition-all">
            記事
          </Link>
          <Link href="/itinerary" className="px-3 py-1.5 text-[13px] text-stone hover:text-fg rounded-lg hover:bg-cream/60 transition-all">
            しおり
          </Link>
          <Link href="/result" className="pill pill-primary ml-2 !py-2 !px-5 !text-[13px]">
            旅を提案
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-cloud/50 mt-20">
      {/* Marquee band */}
      <div className="overflow-hidden border-b border-cloud/5 py-4">
        <div className="anim-marquee whitespace-nowrap flex gap-16 text-[11px] tracking-[0.3em] uppercase text-cloud/20">
          {Array(3).fill(null).map((_, i) => (
            <span key={i}>Travel Proposal — Destination Guide — Itinerary Maker — 旅の提案 — 観光ガイド — しおり作成 — </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <p className="font-editorial text-3xl text-cloud/80 mb-4">旅のしおり</p>
            <p className="text-sm leading-relaxed max-w-xs">
              行きたくなる旅を、ここから。提案から計画まで、すべてをひとつに。
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-cloud/30 mb-5">Navigate</p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/destinations" className="hover:text-cloud transition-colors">観光地</Link>
              <Link href="/articles" className="hover:text-cloud transition-colors">記事</Link>
              <Link href="/itinerary" className="hover:text-cloud transition-colors">しおり</Link>
              <Link href="/result" className="hover:text-cloud transition-colors">旅を提案</Link>
            </div>
          </div>
          <div className="md:col-span-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-cloud/30 mb-5">Style</p>
            <div className="flex flex-wrap gap-2">
              {["カップル", "一人旅", "家族", "温泉", "グルメ", "自然", "アート", "絶景"].map((t) => (
                <Link key={t} href={`/destinations?tag=${t}`}
                  className="text-xs text-cloud/30 border border-cloud/10 px-3 py-1.5 rounded-full hover:border-cloud/30 hover:text-cloud/60 transition-all">
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-cloud/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-cloud/20">
          <p>&copy; 2025 旅のしおり</p>
          <p className="tracking-wider">PROPOSAL × GUIDE × ITINERARY</p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col pt-14">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
