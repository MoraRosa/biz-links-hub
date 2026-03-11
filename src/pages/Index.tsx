import { useState, useMemo } from "react";
import { Search, Briefcase } from "lucide-react";
import { getLinks, LinkCategory } from "@/lib/links";
import { LinkCard } from "@/components/LinkCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Link } from "react-router-dom";

const Index = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<LinkCategory | "all">("all");
  const links = useMemo(() => getLinks(), []);

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
      const matchSearch =
        !search ||
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [links, category, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  Biz Toolkit
                </h1>
                <p className="text-sm text-muted-foreground font-body">
                  Curated resources for small business owners
                </p>
              </div>
            </div>
            <Link
              to="/admin"
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors font-body"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground/60 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-all"
          />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <CategoryFilter selected={category} onSelect={setCategory} counts={counts} />
        </div>

        {/* Links Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((link, i) => (
              <LinkCard key={link.id} link={link} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-body">No resources found.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-xs text-muted-foreground/50 text-center font-body">
            A free resource hub for small business owners ✦
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
