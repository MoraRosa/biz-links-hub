import { LinkCategory, CATEGORY_META, ALL_CATEGORIES } from "@/lib/links";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  selected: LinkCategory | "all";
  onSelect: (cat: LinkCategory | "all") => void;
  counts: Record<string, number>;
}

export function CategoryFilter({ selected, onSelect, counts }: CategoryFilterProps) {
  return (
    <Select value={selected} onValueChange={(v) => onSelect(v as LinkCategory | "all")}>
      <SelectTrigger className="w-[200px] font-body text-sm">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          All Categories ({counts.all || 0})
        </SelectItem>
        {ALL_CATEGORIES.map((key) => {
          const meta = CATEGORY_META[key];
          const count = counts[key] || 0;
          return (
            <SelectItem key={key} value={key}>
              {meta.emoji} {meta.label} ({count})
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
