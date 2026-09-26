import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Lock, LogOut, Download, Upload } from "lucide-react";
import {
  fetchLinks,
  LinkItem,
  LinkCategory,
  CATEGORY_META,
  ALL_CATEGORIES,
} from "@/lib/links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ADMIN_PASS_KEY = "biz-toolkit-admin";
const ADMIN_PASSWORD = "letmein";
const LOCAL_EDITS_KEY = "biz-toolkit-local-edits";

function getLocalEdits(): LinkItem[] | null {
  const stored = localStorage.getItem(LOCAL_EDITS_KEY);
  return stored ? JSON.parse(stored) : null;
}

function saveLocalEdits(links: LinkItem[]) {
  localStorage.setItem(LOCAL_EDITS_KEY, JSON.stringify(links));
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_PASS_KEY) === "true");
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LinkItem | null>(null);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<LinkCategory>("tools");
  const [tags, setTags] = useState<LinkCategory[]>([]);

  useEffect(() => {
    const local = getLocalEdits();
    if (local) {
      setLinks(local);
    } else {
      fetchLinks().then(setLinks);
    }
  }, []);

  const persist = useCallback((updated: LinkItem[]) => {
    setLinks(updated);
    saveLocalEdits(updated);
  }, []);

  const handleLogin = () => {
    if (passInput === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_PASS_KEY, "true");
      setAuthed(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_PASS_KEY);
    setAuthed(false);
  };

  const openAdd = () => {
    setEditing(null);
    setTitle("");
    setUrl("");
    setDescription("");
    setCategory("tools");
    setTags([]);
    setDialogOpen(true);
  };

  const openEdit = (link: LinkItem) => {
    setEditing(link);
    setTitle(link.title);
    setUrl(link.url);
    setDescription(link.description);
    setCategory(link.category);
    setTags(link.tags ?? []);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!title.trim() || !url.trim()) return;
    let updated: LinkItem[];
    if (editing) {
      updated = links.map((l) =>
        l.id === editing.id
          ? { ...l, title: title.trim(), url: url.trim(), description: description.trim(), category, tags: tags.filter((t) => t !== category) }
          : l
      );
    } else {
      const newLink: LinkItem = {
        id: crypto.randomUUID(),
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        category,
        tags: tags.filter((t) => t !== category),
        createdAt: new Date().toISOString(),
      };
      updated = [newLink, ...links];
    }
    persist(updated);
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    persist(links.filter((l) => l.id !== id));
  };

  const handleExport = () => {
    const json = JSON.stringify({ links }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "links.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const data = JSON.parse(text);
        if (data.links && Array.isArray(data.links)) {
          persist(data.links);
        }
      } catch {
        alert("Invalid JSON file");
      }
    };
    input.click();
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display text-xl text-foreground">Admin Access</h1>
            <p className="text-sm text-muted-foreground font-body mt-1">Enter your password to continue</p>
          </div>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Password"
              value={passInput}
              onChange={(e) => {
                setPassInput(e.target.value);
                setPassError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className={passError ? "border-destructive" : ""}
            />
            {passError && <p className="text-xs text-destructive font-body">Incorrect password</p>}
            <Button onClick={handleLogin} className="w-full">
              Sign In
            </Button>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1 justify-center mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            <ArrowLeft className="w-3 h-3" /> Back to directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display text-xl text-foreground">Manage Resources</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleImport} variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-1" /> Import
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
            <Button onClick={openAdd} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <p className="text-xs text-muted-foreground font-body mb-4">
          Edit links here, then <strong>Export JSON</strong> and replace <code className="text-primary">public/data/links.json</code> in your repo to publish changes.
        </p>

        {links.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-body mb-4">No resources yet.</p>
            <Button onClick={openAdd}>
              <Plus className="w-4 h-4 mr-1" /> Add your first link
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link) => {
              const meta = CATEGORY_META[link.category];
              return (
                <div
                  key={link.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-muted-foreground font-body">
                        {meta.emoji} {meta.label}
                      </span>
                    </div>
                    <p className="font-display text-sm text-foreground truncate">{link.title}</p>
                    <p className="text-xs text-muted-foreground truncate font-body">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(link)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(link.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit Resource" : "Add Resource"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground font-body block mb-1.5">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Canada Business Network" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-body block mb-1.5">URL</label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-body block mb-1.5">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-body block mb-1.5">Category</label>
              <Select value={category} onValueChange={(v) => setCategory(v as LinkCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_CATEGORIES.map((key) => {
                    const meta = CATEGORY_META[key];
                    return (
                      <SelectItem key={key} value={key}>
                        {meta.emoji} {meta.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-body block mb-1.5">Also fits in (optional)</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_CATEGORIES.filter((k) => k !== category).map((key) => {
                  const on = tags.includes(key);
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setTags(on ? tags.filter((t) => t !== key) : [...tags, key])}
                      className={`text-xs font-body px-2.5 py-1 rounded-full border transition-colors ${on ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
                    >
                      {CATEGORY_META[key].emoji} {CATEGORY_META[key].label}
                    </button>
                  );
                })}
              </div>
            </div>
            <Button onClick={handleSave} className="w-full" disabled={!title.trim() || !url.trim()}>
              {editing ? "Save Changes" : "Add Resource"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
