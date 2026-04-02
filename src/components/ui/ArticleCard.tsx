import Link from "next/link";
import Image from "next/image";
import { Article, ARTICLE_CATEGORY_LABEL } from "@/types/article";

export function ArticleCardFeatured({ article: a }: { article: Article }) {
  return (
    <Link href={`/articles/${a.slug}`} className="group block">
      <div className="bg-accent text-white rounded-[8px] overflow-hidden md:grid md:grid-cols-2">
        <div className="relative aspect-[16/10] md:aspect-auto">
          <Image src={a.coverImage} alt={a.title} fill className="object-cover" sizes="50vw" />
        </div>
        <div className="p-[24px] md:p-[36px] flex flex-col justify-center">
          <p className="mono text-[10px] text-white/30 tracking-wider uppercase mb-[8px]">{ARTICLE_CATEGORY_LABEL[a.category]}</p>
          <h2 className="serif text-[20px] md:text-[26px] font-bold leading-[1.3] group-hover:text-gold transition-colors mb-[8px]">{a.title}</h2>
          <p className="text-[13px] text-white/40 leading-[1.8] line-clamp-2">{a.description}</p>
          <div className="flex gap-[6px] mt-[12px]">
            {a.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] text-white/25">#{t}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ArticleCardCompact({ article: a }: { article: Article }) {
  return (
    <Link href={`/articles/${a.slug}`} className="group block py-[16px] border-b border-g1/60 hover:bg-white/30 transition-colors">
      <div className="flex items-center gap-[8px] mb-[4px]">
        <span className="mono text-[10px] text-accent bg-accent/5 px-[6px] py-[1px] rounded">{ARTICLE_CATEGORY_LABEL[a.category]}</span>
        <span className="text-[10px] text-g3">{a.prefectureId}</span>
      </div>
      <h3 className="serif text-[15px] font-bold group-hover:text-accent transition-colors leading-[1.4]">{a.title}</h3>
      <p className="text-[12px] text-g4 mt-[2px] line-clamp-1">{a.description}</p>
    </Link>
  );
}
