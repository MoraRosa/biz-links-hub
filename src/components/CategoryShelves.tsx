import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkCardGrid } from "@/components/LinkCard";
import { ALL_CATEGORIES, CATEGORY_META, LinkCategory, LinkItem, linkCategories } from "@/lib/links";

function Shelf({ category, links }: { category: LinkCategory; links: LinkItem[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ atStart: true, atEnd: false });
  const meta = CATEGORY_META[category];

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => setPosition({
      atStart: element.scrollLeft <= 2,
      atEnd: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
    });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [links]);

  const move = (direction: number) => {
    rail.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  return (
    <section aria-label={meta.label} className="min-w-0">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={meta.image} alt="" className="w-9 h-9 object-contain shrink-0" />
          <h2 className="font-display text-xl sm:text-2xl text-foreground truncate">{meta.label}</h2>
          <span className="text-xs text-muted-foreground font-body tabular-nums">{links.length}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button type="button" variant="outline" size="icon" className="h-8 w-8" disabled={position.atStart} aria-label={`Scroll ${meta.label} left`} onClick={() => move(-1)}>
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button type="button" variant="outline" size="icon" className="h-8 w-8" disabled={position.atEnd} aria-label={`Scroll ${meta.label} right`} onClick={() => move(1)}>
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div ref={rail} onScroll={() => {
        const element = rail.current;
        if (element) setPosition({ atStart: element.scrollLeft <= 2, atEnd: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
      }} className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth overscroll-x-contain" tabIndex={0} aria-label={`${meta.label} resources`}>
        {links.map((link) => (
          <div key={link.id} className="w-[min(78vw,260px)] shrink-0 snap-start">
            <LinkCardGrid link={link} index={0} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function CategoryShelves({ links, selected }: { links: LinkItem[]; selected: LinkCategory | "all" }) {
  return (
    <div className="space-y-8 sm:space-y-10">
      {ALL_CATEGORIES.filter((category) => selected === "all" || selected === category).map((category) => {
        const items = links.filter((link) => linkCategories(link).includes(category));
        return items.length ? <Shelf key={category} category={category} links={items} /> : null;
      })}
    </div>
  );
}