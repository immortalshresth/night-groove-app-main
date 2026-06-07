import { Link } from "@tanstack/react-router";
import { Home, Library, ListMusic, Radio, Plus } from "lucide-react";
import { usePlayer } from "./player/PlayerProvider";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/library", label: "Your Library", icon: Library, exact: false },
  { to: "/playlists", label: "Playlists", icon: ListMusic, exact: false },
] as const;

export function Sidebar() {
  const { playlists, createPlaylist } = usePlayer();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return setCreating(false);
    createPlaylist(n);
    setName("");
    setCreating(false);
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar/80 px-3 py-5 backdrop-blur md:flex">
      <Link to="/" className="mb-6 flex items-center gap-2 px-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-neon shadow-[0_0_15px_oklch(0.72_0.30_340/0.5)]">
          <Radio className="h-5 w-5 text-background" />
        </div>
        <span className="text-lg font-bold tracking-wide text-gradient-neon">NEONWAVE</span>
      </Link>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-primary data-[status=active]:shadow-[inset_3px_0_0_var(--neon-pink)]"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 flex items-center justify-between px-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your Playlists
        </h3>
        <button
          onClick={() => setCreating(true)}
          aria-label="New playlist"
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-primary"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 flex-1 space-y-0.5 overflow-y-auto">
        {creating && (
          <form onSubmit={submit} className="px-3 py-1">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={submit}
              placeholder="Playlist name"
              className="w-full rounded bg-sidebar-accent px-2 py-1 text-sm outline-none ring-1 ring-border focus:ring-primary"
            />
          </form>
        )}
        {playlists.length === 0 && !creating && (
          <p className="px-3 py-2 text-xs text-muted-foreground">No playlists yet.</p>
        )}
        {playlists.map((p) => (
          <Link
            key={p.id}
            to="/playlists/$id"
            params={{ id: p.id }}
            className="block truncate rounded-md px-3 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground data-[status=active]:text-primary"
          >
            {p.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}
