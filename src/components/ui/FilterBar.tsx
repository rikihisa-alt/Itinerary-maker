"use client";

export function FilterBar({ label, items, selected, onSelect }: {
  label: string;
  items: { value: string; label: string }[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] text-g4 mb-[5px]">{label}</p>
      <div className="flex gap-[5px] overflow-x-auto pb-[4px]" style={{ scrollbarWidth: "none" }}>
        {items.map((item) => (
          <button key={item.value} onClick={() => onSelect(selected === item.value ? "" : item.value)}
            className={`shrink-0 px-[12px] py-[4px] rounded-full text-[11px] transition-all active:scale-[0.97] ${
              selected === item.value ? "bg-ink text-white" : "bg-white text-g4 border border-g2 hover:border-g3"
            }`}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
