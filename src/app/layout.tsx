import type { Metadata } from "next";
import Link from "next/link";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = { title: "旅のしおり", description: "その一歩が、旅になる。" };

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference pointer-events-none">
      <nav className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] h-[56px] flex items-center justify-between pointer-events-auto">
        <Link href="/" className="serif text-[18px] font-bold text-white tracking-[-0.02em]">旅のしおり</Link>
        <div className="flex items-center gap-[2px]">
          <Link href="/destinations" className="px-[12px] py-[6px] text-[13px] text-white/60 hover:text-white transition-colors">観光地</Link>
          <Link href="/itinerary" className="px-[12px] py-[6px] text-[13px] text-white/60 hover:text-white transition-colors">しおり</Link>
          <Link href="/destinations" className="ml-[8px] px-[18px] py-[7px] text-[12px] bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors">旅に出る</Link>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-white/20 mt-[120px]">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] py-[64px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-[32px] mb-[48px]">
          <div>
            <p className="serif text-[24px] text-white/50 mb-[8px]">旅のしおり</p>
            <p className="text-[12px] max-w-[240px]">その一歩が、旅になる。</p>
          </div>
          <div className="flex gap-[24px] text-[12px]">
            <Link href="/destinations" className="hover:text-white/50 transition-colors">観光地</Link>
            <Link href="/itinerary" className="hover:text-white/50 transition-colors">しおり</Link>
          </div>
        </div>
        <div className="border-t border-white/5 pt-[20px] text-[10px] text-white/10">&copy; 2025</div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <SmoothScroll />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
