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
  createdAt: string;
}

export const CATEGORY_META: Record<LinkCategory, { label: string; emoji: string }> = {
  marketing: { label: "Marketing", emoji: "📣" },
  finance: { label: "Finance & Taxes", emoji: "💰" },
  legal: { label: "Legal & Licensing", emoji: "⚖️" },
  networking: { label: "Networking", emoji: "🤝" },
  government: { label: "Government & Grants", emoji: "🏛️" },
  tools: { label: "Tools & Software", emoji: "🛠️" },
  education: { label: "Learning", emoji: "📚" },
  other: { label: "Other", emoji: "📌" },
};

const STORAGE_KEY = "biz-links-data";

const SEED_LINKS: LinkItem[] = [
  {
    id: "seed-1",
    title: "SBA - Small Business Administration",
    url: "https://www.sba.gov",
    description: "U.S. government resource for starting, managing, and growing your small business.",
    category: "government",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    title: "SCORE Free Mentoring",
    url: "https://www.score.org",
    description: "Free business mentoring and education from experienced volunteers.",
    category: "networking",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    title: "Canva",
    url: "https://www.canva.com",
    description: "Free graphic design tool for creating social media posts, flyers, logos, and more.",
    category: "tools",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-4",
    title: "Mailchimp",
    url: "https://mailchimp.com",
    description: "Email marketing platform with a generous free tier for small businesses.",
    category: "marketing",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-5",
    title: "IRS Small Business Tax Center",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed",
    description: "Tax information and resources specifically for small business owners.",
    category: "finance",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-6",
    title: "USPTO Trademark Search",
    url: "https://www.uspto.gov/trademarks",
    description: "Search existing trademarks and learn how to register your own.",
    category: "legal",
    createdAt: new Date().toISOString(),
  },
];

export function getLinks(): LinkItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    saveLinks(SEED_LINKS);
    return SEED_LINKS;
  }
  return JSON.parse(stored);
}

export function saveLinks(links: LinkItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function addLink(link: Omit<LinkItem, "id" | "createdAt">): LinkItem {
  const newLink: LinkItem = {
    ...link,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const links = getLinks();
  links.unshift(newLink);
  saveLinks(links);
  return newLink;
}

export function updateLink(id: string, updates: Partial<Omit<LinkItem, "id" | "createdAt">>) {
  const links = getLinks();
  const idx = links.findIndex((l) => l.id === id);
  if (idx !== -1) {
    links[idx] = { ...links[idx], ...updates };
    saveLinks(links);
  }
}

export function deleteLink(id: string) {
  const links = getLinks().filter((l) => l.id !== id);
  saveLinks(links);
}
