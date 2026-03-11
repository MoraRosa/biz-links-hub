import { LinkCategory, CATEGORY_META } from "@/lib/links";

interface CategoryFilterProps {
  selected: LinkCategory | "all";
  onSelect: (cat: LinkCategory | "all") => void;
  counts: Record<string, number>;
}

export function CategoryFilter({ selected, onSelect, counts }: CategoryFilterProps) {
  const categories = Object.entries(CATEGORY_META) as [LinkCategory, { label: string; emoji: string }][];

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("all")}
        className={`px-3.5 py-1.5 rounded-full text-sm font-medium font-body transition-all duration-150 ${
          selected === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        All {counts.all ? `(${counts.all})` : ""}
      </button>
      {categories.map(([key, meta]) => {
        const count = counts[key] || 0;
        if (count === 0) return null;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium font-body transition-all duration-150 ${
              selected === key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {meta.emoji} {meta.label} ({count})
          </button>
        );
      })}
    </div>
  );
}
