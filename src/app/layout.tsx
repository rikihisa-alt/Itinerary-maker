import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "旅のしおり",
  description: "あなたに刺さる旅先を提案し、そのまま旅のしおりまで作れる。",
};

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <nav className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] h-[56px] flex items-center justify-between">
        <Link href="/" className="font-[--serif] text-[18px] font-bold text-white">
          旅のしおり
        </Link>
        <div className="flex items-center gap-[4px]">
          {[
            { href: "/destinations", label: "観光地" },
            { href: "/articles", label: "記事" },
            { href: "/itinerary", label: "しおり" },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="px-[12px] py-[6px] text-[13px] text-white/70 hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/result"
            className="ml-[8px] px-[20px] py-[8px] text-[13px] bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors">
            旅を提案
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white/30">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pt-[80px] pb-[40px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[48px] mb-[64px]">
          <div className="md:col-span-5">
            <p className="font-[--serif] text-[28px] text-white/60 mb-[16px]">旅のしおり</p>
            <p className="text-[13px] leading-[1.8] max-w-[280px]">
              行きたくなる旅を、ここから。
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/20 mb-[20px]">Pages</p>
            <div className="flex flex-col gap-[12px] text-[13px]">
              <Link href="/destinations" className="hover:text-white/70 transition-colors">観光地</Link>
              <Link href="/articles" className="hover:text-white/70 transition-colors">記事</Link>
              <Link href="/itinerary" className="hover:text-white/70 transition-colors">しおり</Link>
              <Link href="/result" className="hover:text-white/70 transition-colors">旅を提案</Link>
            </div>
          </div>
          <div className="md:col-span-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/20 mb-[20px]">Style</p>
            <div className="flex flex-wrap gap-[6px]">
              {["カップル", "一人旅", "温泉", "グルメ", "自然", "絶景", "アート"].map((t) => (
                <Link key={t} href={`/destinations?tag=${t}`}
                  className="text-[11px] border border-white/10 px-[10px] py-[5px] rounded-full hover:border-white/30 transition-colors">
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-[24px] text-[11px] text-white/15">
          &copy; 2025 旅のしおり
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
