export function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-[28px]">
      <p className="mono text-[10px] tracking-[0.15em] uppercase text-g4 mb-[6px]">{label}</p>
      <h2 className="serif text-[24px] md:text-[30px] font-bold tracking-[-0.01em]">{title}</h2>
    </div>
  );
}
