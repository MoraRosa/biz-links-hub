import catMarketing from "@/assets/cat-marketing.png";
import catFinance from "@/assets/cat-finance.png";
import catLegal from "@/assets/cat-legal.png";
import catNetworking from "@/assets/cat-networking.png";
import catGovernment from "@/assets/cat-government.png";
import catTools from "@/assets/cat-tools.png";
import catEducation from "@/assets/cat-education.png";
import catOther from "@/assets/cat-other.png";

export type LinkCategory =
  | "marketing"
  | "finance"
  | "legal"
  | "networking"
  | "government"
  | "tools"
  | "education"
  | "other";

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: LinkCategory;
  /** Extra categories this link also belongs to */
  tags?: LinkCategory[];
  createdAt: string;
}

export const CATEGORY_META: Record<
  LinkCategory,
  { label: string; emoji: string; image: string }
> = {
  marketing: { label: "Marketing", emoji: "📣", image: catMarketing },
  finance: { label: "Finance & Taxes", emoji: "💰", image: catFinance },
  legal: { label: "Legal & Licensing", emoji: "⚖️", image: catLegal },
  networking: { label: "Networking", emoji: "🤝", image: catNetworking },
  government: { label: "Government & Grants", emoji: "🏛️", image: catGovernment },
  tools: { label: "Tools & Software", emoji: "🛠️", image: catTools },
  education: { label: "Learning", emoji: "📚", image: catEducation },
  other: { label: "Other", emoji: "📌", image: catOther },
};

export const linkCategories = (l: LinkItem): LinkCategory[] => [l.category, ...(l.tags ?? []).filter((t) => t !== l.category)];

export const ALL_CATEGORIES = Object.keys(CATEGORY_META) as LinkCategory[];

export async function fetchLinks(): Promise<LinkItem[]> {
  const res = await fetch("/data/links.json");
  const data = await res.json();
  return data.links as LinkItem[];
}
