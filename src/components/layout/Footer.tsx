import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-white/20 mt-[100px]">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] pt-[64px] pb-[32px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[40px] mb-[56px]">
          <div className="md:col-span-5">
            <p className="serif text-[22px] text-white/50 mb-[4px]">旅のしおり屋さん</p>
            <p className="mono text-[10px] text-white/20 tracking-[0.1em] mb-[12px]">Itinerary Craft</p>
            <p className="text-[12px] max-w-[240px] leading-[1.8]">あなたの旅を、しおりにする。</p>
          </div>
          <div className="md:col-span-3">
            <p className="mono text-[10px] tracking-[0.15em] uppercase text-white/15 mb-[16px]">Pages</p>
            <div className="flex flex-col gap-[10px] text-[12px]">
              <Link href="/create" className="hover:text-white/50 transition-colors">しおりを作る</Link>
              <Link href="/destinations" className="hover:text-white/50 transition-colors">観光地</Link>
              <Link href="/articles" className="hover:text-white/50 transition-colors">記事</Link>
              <Link href="/prefectures" className="hover:text-white/50 transition-colors">都道府県</Link>
              <Link href="/itinerary" className="hover:text-white/50 transition-colors">しおり編集</Link>
            </div>
          </div>
          <div className="md:col-span-4">
            <p className="mono text-[10px] tracking-[0.15em] uppercase text-white/15 mb-[16px]">近畿エリア</p>
            <div className="flex flex-wrap gap-[6px]">
              {["kyoto", "osaka", "nara", "hyogo", "wakayama", "shiga", "mie"].map((id) => {
                const names: Record<string, string> = { kyoto: "京都", osaka: "大阪", nara: "奈良", hyogo: "兵庫", wakayama: "和歌山", shiga: "滋賀", mie: "三重" };
                return (
                  <Link key={id} href={`/prefectures/${id}`}
                    className="text-[10px] border border-white/8 px-[8px] py-[4px] rounded-full hover:border-white/20 transition-colors">
                    {names[id]}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-[16px] flex flex-col sm:flex-row justify-between items-center gap-[8px] text-[10px] text-white/10">
          <p>&copy; 2025 旅のしおり屋さん / Itinerary Craft</p>
          <p className="mono tracking-[0.1em]">Shiori, made for your trip.</p>
        </div>
      </div>
    </footer>
  );
}
