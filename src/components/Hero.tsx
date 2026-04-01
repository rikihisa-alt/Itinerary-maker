import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] bg-black overflow-hidden">
      {/* Background image placeholder — gradient simulating a moody landscape */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a3a] via-[#2d3a28] to-[#1a1815]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC4wOCIvPjwvc3ZnPg==')] opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content — 左下寄せ */}
      <div className="relative h-full max-w-[1440px] mx-auto px-[20px] md:px-[48px] flex flex-col justify-end pb-[64px] md:pb-[80px]">
        <div className="afade">
          <h1 className="font-[--serif] text-[36px] md:text-[52px] lg:text-[64px] font-bold text-white leading-[1.15] tracking-[-0.02em] mb-[16px]">
            次の週末、
            <br />
            どこで過ごす？
          </h1>
          <p className="text-[14px] md:text-[15px] text-white/40 max-w-[360px] leading-[1.8] mb-[32px]">
            条件を入力するだけで、あなたに刺さる旅先とモデルコースを提案する。
          </p>
          <Link href="/result"
            className="inline-block bg-gold text-white px-[32px] py-[14px] rounded-full text-[14px] font-medium hover:bg-[#b8944e] transition-colors">
            旅を提案してもらう
          </Link>
        </div>
      </div>
    </section>
  );
}
