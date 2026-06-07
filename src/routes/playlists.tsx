import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ListMusic } from "lucide-react";
import { useState } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";

export const Route = createFileRoute("/playlists")({
  head: () => ({
    meta: [
      { title: "Playlists — Neonwave" },
      { name: "description", content: "Create and manage your custom playlists." },
      { property: "og:title", content: "Playlists — Neonwave" },
      { property: "og:description", content: "Create and manage your custom playlists." },
    ],
  }),
  component: PlaylistsPage,
});

function PlaylistsPage() {
  const { playlists, createPlaylist } = usePlayer();
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    createPlaylist(n);
    setName("");
  };

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="mb-1 text-3xl font-bold text-gradient-neon md:text-4xl">Playlists</h1>
      <p className="mb-8 text-muted-foreground">Build your own neon soundtracks.</p>

      <form onSubmit={submit} className="mb-8 flex max-w-md gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New playlist name"
          className="flex-1 rounded-md border border-border bg-card/60 px-3 py-2 text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_oklch(0.72_0.30_340/0.2)]"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-md bg-gradient-neon px-3 py-2 text-sm font-medium text-background transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" /> Create
        </button>
      </form>

      {playlists.length === 0 ? (
        <p className="rounded-lg bg-card/40 p-6 text-sm text-muted-foreground">No playlists yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {playlists.map((p) => (
            <Link
              key={p.id}
              to="/playlists/$id"
              params={{ id: p.id }}
              className="group flex flex-col rounded-xl bg-card/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-card hover:shadow-[0_0_25px_oklch(0.78_0.18_200/0.4)]"
            >
              <div className="mb-3 flex aspect-square w-full items-center justify-center rounded-lg bg-gradient-neon shadow-[0_0_20px_oklch(0.72_0.30_340/0.4)]">
                <ListMusic className="h-12 w-12 text-background" />
              </div>
              <h3 className="truncate font-semibold">{p.name}</h3>
              <p className="text-xs text-muted-foreground">
                {p.trackIds.length} {p.trackIds.length === 1 ? "track" : "tracks"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
