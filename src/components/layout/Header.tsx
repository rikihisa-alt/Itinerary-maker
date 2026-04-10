"use client";

import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-[20px] md:px-[48px] py-[18px] flex justify-between items-center mix-blend-difference pointer-events-none">
        <Link href="/" className="pointer-events-auto serif text-[18px] tracking-[0.1em] text-white hidden md:block">
          旅のしおり屋さん
        </Link>
        <div className="pointer-events-auto mono text-[11px] tracking-[0.2em] font-light text-white/50 hidden md:block">
          EST. 2024
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="pointer-events-auto ml-auto w-[40px] h-[40px] flex flex-col justify-center gap-[5px] items-end group text-white"
          aria-label="Menu"
        >
          <span className={`h-[1px] bg-white transition-all duration-300 ${open ? "w-[24px] rotate-45 translate-y-[3px]" : "w-[28px] group-hover:w-[20px]"}`} />
          <span className={`h-[1px] bg-white transition-all duration-300 ${open ? "w-[24px] -rotate-45 -translate-y-[3px]" : "w-[20px] group-hover:w-[28px]"}`} />
        </button>
      </nav>

      {/* Mobile/Desktop nav overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-ink/95 flex flex-col justify-center items-center gap-[28px]" onClick={() => setOpen(false)}>
          {[
            { href: "/", label: "Home" },
            { href: "/create", label: "しおりを作る" },
            { href: "/destinations", label: "観光地" },
            { href: "/articles", label: "記事" },
            { href: "/prefectures", label: "都道府県" },
            { href: "/itinerary", label: "しおり編集" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="serif text-[24px] md:text-[32px] text-white/70 hover:text-gold transition-colors font-light tracking-wide">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
