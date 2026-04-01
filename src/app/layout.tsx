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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
          旅のしおり
        </Link>
        <div className="flex items-center gap-8 text-sm">
          <Link
            href="/destinations"
            className="text-muted hover:text-foreground transition-colors"
          >
            観光地
          </Link>
          <Link
            href="/articles"
            className="text-muted hover:text-foreground transition-colors"
          >
            記事
          </Link>
          <Link
            href="/itinerary"
            className="text-muted hover:text-foreground transition-colors"
          >
            しおり
          </Link>
          <Link
            href="/result"
            className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            旅を提案してもらう
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-bold text-lg mb-3">旅のしおり</p>
            <p className="text-muted text-sm leading-relaxed">
              行きたくなる旅を、ここから。
              <br />
              提案から計画まで、旅のすべてを。
            </p>
          </div>
          <div>
            <p className="font-medium mb-3 text-sm">コンテンツ</p>
            <div className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/destinations" className="hover:text-foreground transition-colors">
                観光地を探す
              </Link>
              <Link href="/articles" className="hover:text-foreground transition-colors">
                記事を読む
              </Link>
              <Link href="/itinerary" className="hover:text-foreground transition-colors">
                しおりを作る
              </Link>
            </div>
          </div>
          <div>
            <p className="font-medium mb-3 text-sm">旅のスタイル</p>
            <div className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/destinations?tag=カップル" className="hover:text-foreground transition-colors">
                カップル旅
              </Link>
              <Link href="/destinations?tag=一人旅" className="hover:text-foreground transition-colors">
                一人旅
              </Link>
              <Link href="/destinations?tag=家族" className="hover:text-foreground transition-colors">
                家族旅行
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted">
          &copy; 2025 旅のしおり. All rights reserved.
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
