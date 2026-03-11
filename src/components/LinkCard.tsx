import { ExternalLink } from "lucide-react";
import { LinkItem, CATEGORY_META } from "@/lib/links";

interface LinkCardProps {
  link: LinkItem;
  index: number;
}

export function LinkCard({ link, index }: LinkCardProps) {
  const meta = CATEGORY_META[link.category];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="inline-block text-xs font-medium text-muted-foreground mb-2 font-body">
            {meta.emoji} {meta.label}
          </span>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors">
            {link.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {link.description}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
      </div>
    </a>
  );
}
