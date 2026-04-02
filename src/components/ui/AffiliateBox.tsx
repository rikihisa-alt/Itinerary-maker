import { AffiliateLink } from "@/types/spot";

export function AffiliateBox({ links }: { links?: AffiliateLink[] }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="border border-g2 rounded-[6px] p-[16px] mt-[20px]">
      <p className="mono text-[10px] text-g3 tracking-wider uppercase mb-[10px]">予約・詳細</p>
      <div className="flex flex-wrap gap-[8px]">
        {links.map((link) => (
          <a key={link.provider} href={link.url} target="_blank" rel="noopener noreferrer"
            className="text-[12px] text-accent border border-accent/20 px-[14px] py-[6px] rounded-full hover:bg-accent/5 transition-colors">
            {link.label} →
          </a>
        ))}
      </div>
    </div>
  );
}
