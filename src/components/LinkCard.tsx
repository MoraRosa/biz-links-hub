import { ExternalLink } from "lucide-react";
import { LinkItem, CATEGORY_META } from "@/lib/links";

interface LinkCardGridProps {
  link: LinkItem;
  index: number;
}

export function LinkCardGrid({ link, index }: LinkCardGridProps) {
  const meta = CATEGORY_META[link.category];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-border bg-card overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms`, opacity: 0 }}
    >
      {/* Category illustration */}
      <div className="relative h-32 bg-gradient-warm-subtle flex items-center justify-center overflow-hidden">
        <img
          src={meta.image}
          alt={meta.label}
          className="h-24 w-24 object-contain transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-primary mb-1.5 font-body">
          {meta.label}
        </span>
        <h3 className="font-display text-base font-normal text-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors">
          {link.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-body">
          {link.description}
        </p>
      </div>
    </a>
  );
}

interface LinkCardListProps {
  link: LinkItem;
  index: number;
}

export function LinkCardList({ link, index }: LinkCardListProps) {
  const meta = CATEGORY_META[link.category];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-200 animate-fade-up"
      style={{ animationDelay: `${index * 40}ms`, opacity: 0 }}
    >
      <div className="w-10 h-10 rounded-md bg-gradient-warm-subtle flex items-center justify-center flex-shrink-0">
        <img src={meta.image} alt={meta.label} className="w-7 h-7 object-contain" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-sm font-normal text-foreground truncate group-hover:text-primary transition-colors">
            {link.title}
          </h3>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/70 font-body flex-shrink-0">
            {meta.label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate font-body">{link.description}</p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors flex-shrink-0" />
    </a>
  );
}
