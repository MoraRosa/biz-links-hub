const icons = [
  { label: "App Icon 512px", src: `${import.meta.env.BASE_URL}icons/icon-512.png` },
  { label: "App Icon 192px", src: `${import.meta.env.BASE_URL}icons/icon-192.png` },
  { label: "Favicon", src: `${import.meta.env.BASE_URL}favicon.png` },
];

const Images = () => (
  <div className="min-h-screen bg-background p-8">
    <h1 className="font-serif text-3xl text-foreground mb-2">Generated Icons</h1>
    <p className="text-muted-foreground mb-8">Pick your favourite — or use an external tool to refine one.</p>
    <div className="grid gap-8 sm:grid-cols-3">
      {icons.map((icon) => (
        <div key={icon.src} className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6">
          <img src={icon.src} alt={icon.label} className="w-40 h-40 object-contain" />
          <span className="text-sm font-medium text-foreground">{icon.label}</span>
          <span className="text-xs text-muted-foreground">{icon.src}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Images;
