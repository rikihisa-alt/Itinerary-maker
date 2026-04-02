"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference pointer-events-none">
      <nav className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] h-[56px] flex items-center justify-between pointer-events-auto">
        <Link href="/" className="flex items-center gap-[6px]">
          <span className="serif text-[18px] font-bold text-white tracking-[-0.02em]">旅のしおり屋さん</span>
        </Link>
        <div className="flex items-center gap-[2px]">
          <Link href="/destinations" className="px-[10px] py-[6px] text-[12px] text-white/50 hover:text-white transition-colors hidden sm:block">観光地</Link>
          <Link href="/articles" className="px-[10px] py-[6px] text-[12px] text-white/50 hover:text-white transition-colors hidden sm:block">記事</Link>
          <Link href="/prefectures" className="px-[10px] py-[6px] text-[12px] text-white/50 hover:text-white transition-colors hidden sm:block">都道府県</Link>
          <Link href="/itinerary" className="px-[10px] py-[6px] text-[12px] text-white/50 hover:text-white transition-colors hidden sm:block">しおり</Link>
          <Link href="/create" className="ml-[6px] px-[16px] py-[6px] text-[11px] bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors">
            しおりを作る
          </Link>
        </div>
      </nav>
    </header>
  );
}
