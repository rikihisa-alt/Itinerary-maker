import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "旅のしおり – 行きたくなる旅を、ここから",
  description:
    "旅行提案・観光地ガイド・しおり作成がひとつになった旅行サービス。あなたに刺さる旅を提案します。",
};

function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <nav className="max-w-6xl mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-xs font-bold">旅</span>
          <span className="text-base font-bold tracking-tight text-foreground hidden sm:block">旅のしおり</span>
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <Link href="/destinations" className="text-sm text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-surface transition-all">
            観光地
          </Link>
          <Link href="/articles" className="text-sm text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-surface transition-all">
            記事
          </Link>
          <Link href="/itinerary" className="text-sm text-muted hover:text-foreground px-3 py-2 rounded-lg hover:bg-surface transition-all">
            しおり
          </Link>
          <Link
            href="/result"
            className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-accent/20 transition-all ml-1 md:ml-3"
          >
            <span className="hidden sm:inline">旅を提案してもらう</span>
            <span className="sm:hidden">提案</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-xs font-bold">旅</span>
              <span className="text-lg font-bold">旅のしおり</span>
            </div>
            <p className="text-background/50 text-sm leading-relaxed max-w-sm">
              行きたくなる旅を、ここから。
              <br />
              あなたに刺さる旅先を提案し、そのまま旅のしおりまで作れる。
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="font-medium mb-4 text-sm text-background/70">コンテンツ</p>
            <div className="flex flex-col gap-3 text-sm text-background/40">
              <Link href="/destinations" className="hover:text-background transition-colors">観光地を探す</Link>
              <Link href="/articles" className="hover:text-background transition-colors">記事を読む</Link>
              <Link href="/itinerary" className="hover:text-background transition-colors">しおりを作る</Link>
              <Link href="/result" className="hover:text-background transition-colors">旅を提案してもらう</Link>
            </div>
          </div>
          <div className="md:col-span-4">
            <p className="font-medium mb-4 text-sm text-background/70">旅のスタイル</p>
            <div className="flex flex-wrap gap-2">
              {["カップル", "一人旅", "家族", "友達", "女子旅", "温泉", "グルメ", "自然"].map((tag) => (
                <Link
                  key={tag}
                  href={`/destinations?tag=${tag}`}
                  className="text-xs text-background/40 bg-background/5 hover:bg-background/10 px-3 py-1.5 rounded-full transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-background/30">
          <p>&copy; 2025 旅のしおり. All rights reserved.</p>
          <p>提案 × 記事 × しおり──旅のすべてを、ひとつに。</p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
