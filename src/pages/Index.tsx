import { useState, useMemo, useEffect } from "react";
import { Search, LayoutGrid, List, Briefcase } from "lucide-react";
import { fetchLinks, LinkItem, LinkCategory } from "@/lib/links";
import { LinkCardGrid, LinkCardList } from "@/components/LinkCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Link } from "react-router-dom";

const Index = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<LinkCategory | "all">("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchLinks().then((data) => {
      setLinks(data);
      setLoading(false);
    });
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: links.length };
    links.forEach((l) => {
      c[l.category] = (c[l.category] || 0) + 1;
    });
    return c;
  }, [links]);

  const filtered = useMemo(() => {
    return links.filter((l) => {
      const matchCat = category === "all" || l.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.includes(q);
      return matchCat && matchSearch;
    });
  }, [links, category, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-warm opacity-[0.07]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pt-14 sm:pb-14">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-warm flex items-center justify-center shadow-hero">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg text-foreground">Biz Toolkit</span>
            </div>
            <Link
              to="/admin"
              className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors font-body"
            >
              Admin
            </Link>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-normal text-foreground leading-tight mb-3">
            Your go-to resources,{" "}
            <span className="text-gradient-warm italic">all in one place.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-body max-w-xl leading-relaxed">
            A curated collection of tools, grants, guides, and connections for Canadian small business owners.
          </p>
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

          <div className="flex items-center gap-2">
            <CategoryFilter selected={category} onSelect={setCategory} counts={counts} />

            {/* View toggle */}
            <div className="flex items-center rounded-lg border border-border bg-card overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`p-2 transition-colors ${
                  view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 transition-colors ${
                  view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
          view === "grid" ? (
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
