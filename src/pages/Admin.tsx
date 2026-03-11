import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Lock, LogOut } from "lucide-react";
import {
  getLinks,
  addLink,
  updateLink,
  deleteLink,
  LinkItem,
  LinkCategory,
  CATEGORY_META,
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
const ADMIN_PASSWORD = "letmein"; // Simple, change as needed

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_PASS_KEY) === "true");
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>(() => getLinks());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LinkItem | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<LinkCategory>("tools");

  const refreshLinks = useCallback(() => setLinks(getLinks()), []);

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
    setDialogOpen(true);
  };

  const openEdit = (link: LinkItem) => {
    setEditing(link);
    setTitle(link.title);
    setUrl(link.url);
    setDescription(link.description);
    setCategory(link.category);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!title.trim() || !url.trim()) return;
    if (editing) {
      updateLink(editing.id, { title: title.trim(), url: url.trim(), description: description.trim(), category });
    } else {
      addLink({ title: title.trim(), url: url.trim(), description: description.trim(), category });
    }
    refreshLinks();
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteLink(id);
    refreshLinks();
  };

  const categories = Object.entries(CATEGORY_META) as [LinkCategory, { label: string; emoji: string }][];

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">Admin Access</h1>
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
            {passError && (
              <p className="text-xs text-destructive font-body">Incorrect password</p>
            )}
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
            <h1 className="font-display text-xl font-bold text-foreground">Manage Resources</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={openAdd} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add Link
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
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
                    <p className="font-display font-semibold text-foreground text-sm truncate">
                      {link.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
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
              <label className="text-sm font-medium text-foreground font-body block mb-1.5">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SBA Business Guide"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-body block mb-1.5">
                URL
              </label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-body block mb-1.5">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this resource..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-body block mb-1.5">
                Category
              </label>
              <Select value={category} onValueChange={(v) => setCategory(v as LinkCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(([key, meta]) => (
                    <SelectItem key={key} value={key}>
                      {meta.emoji} {meta.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
