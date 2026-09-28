import { useState, useMemo, useEffect, useRef } from "react";
import { Search, LayoutGrid, List, Rows3, Sparkles, ArrowDown } from "lucide-react";
import { fetchLinks, LinkItem, LinkCategory, CATEGORY_META, ALL_CATEGORIES, linkCategories } from "@/lib/links";
import { LinkCardGrid, LinkCardList } from "@/components/LinkCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { CategoryShelves } from "@/components/CategoryShelves";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HERO_CATEGORIES = ALL_CATEGORIES.slice(0, 6);

const Index = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<LinkCategory | "all">("all");
  const [view, setView] = useState<"grid" | "list" | "categories">("categories");
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchLinks().then((data) => {
      setLinks(data);
      setLoading(false);
    });
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: links.length };
    links.forEach((l) => {
      linkCategories(l).forEach((k) => (c[k] = (c[k] || 0) + 1));
    });
    return c;
  }, [links]);

  const filtered = useMemo(() => {
    return links.filter((l) => {
      const matchCat = category === "all" || linkCategories(l).includes(category);
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        linkCategories(l).some((k) => CATEGORY_META[k].label.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [links, category, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden min-h-[70vh] sm:min-h-[60vh] flex flex-col">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/[0.06] blur-3xl animate-hero-float" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-accent/[0.05] blur-3xl animate-hero-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-3xl" />
        </div>

        {/* Decorative grid dots */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="relative flex-1 flex flex-col max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-8 sm:pt-10 w-full">
          {/* Nav */}
          <div className="flex items-center justify-between mb-auto">
            <div className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: '0ms' }}>
              <img src={`${import.meta.env.BASE_URL}icons/icon-192.png`} alt="Biz Toolkit" className="w-11 h-11 rounded-xl shadow-hero" />
              <span className="font-display text-lg text-foreground">Biz Toolkit</span>
            </div>
            <Link
              to="/admin"
              className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors font-body"
            >
              Admin
            </Link>
          </div>

          {/* Hero content - centered */}
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 sm:py-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body font-medium mb-5 animate-fade-up" style={{ animationDelay: '100ms' }}>
              <Sparkles className="w-3 h-3" />
              <span>Curated for Canadian entrepreneurs</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal text-foreground leading-[1.1] mb-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
              Your go-to resources,
              <br />
              <span className="text-gradient-warm italic">all in one place.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground font-body max-w-lg leading-relaxed mb-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
              Tools, grants, guides & connections — everything a small business owner needs, bookmarked and organized.
            </p>

            {/* Floating category pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-up" style={{ animationDelay: '400ms' }}>
              {HERO_CATEGORIES.map((cat, i) => {
                const meta = CATEGORY_META[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      mainRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-sm text-xs font-body text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-200 hover:-translate-y-0.5"
                    style={{ animationDelay: `${450 + i * 50}ms` }}
                  >
                    <img src={meta.image} alt="" className="w-4 h-4 rounded-sm object-contain" />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="flex justify-center animate-fade-up" style={{ animationDelay: '600ms' }}>
            <button
              onClick={() => mainRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center gap-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <span className="text-[10px] font-body uppercase tracking-widest">Explore</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground/50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center justify-between gap-2 min-w-0">
            <CategoryFilter selected={category} onSelect={setCategory} counts={counts} />

            {/* View toggle */}
            <div className="flex items-center shrink-0 rounded-lg border border-border bg-card overflow-hidden" role="group" aria-label="Display view">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setView("categories")}
                className={`h-9 w-9 rounded-none transition-colors ${
                  view === "categories" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Category view"
                aria-pressed={view === "categories"}
                title="Category view"
              >
                <Rows3 className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setView("list")}
                className={`h-9 w-9 rounded-none transition-colors ${
                  view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="List view"
                aria-pressed={view === "list"}
                title="List view"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setView("grid")}
                className={`h-9 w-9 rounded-none transition-colors ${
                  view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Content */}
      <main ref={mainRef} className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 scroll-mt-28 sm:scroll-mt-20">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card animate-pulse h-52"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          view === "categories" ? (
            <CategoryShelves links={filtered} selected={category} />
          ) : view === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((link, i) => (
                <LinkCardGrid key={link.id} link={link} index={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((link, i) => (
                <LinkCardList key={link.id} link={link} index={i} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body text-lg">No resources found.</p>
            <p className="text-sm text-muted-foreground/60 font-body mt-1">Try adjusting your search or filter.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-xs text-muted-foreground/40 text-center font-body">
            Biz Toolkit — a free resource hub for small business owners 🍁
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
