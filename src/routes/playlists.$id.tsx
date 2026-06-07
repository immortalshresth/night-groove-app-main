import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Play, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { TrackRow } from "@/components/TrackRow";
import { tracks as allTracks, getTrack } from "@/data/tracks";

export const Route = createFileRoute("/playlists/$id")({
  head: () => ({
    meta: [
      { title: "Playlist — Neonwave" },
      { name: "description", content: "View and play your playlist." },
      { property: "og:title", content: "Playlist — Neonwave" },
      { property: "og:description", content: "View and play your playlist." },
    ],
  }),
  component: PlaylistPage,
});

function PlaylistPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { playlists, playQueue, deletePlaylist, addToPlaylist, removeFromPlaylist } = usePlayer();
  const [picker, setPicker] = useState(false);

  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div className="px-6 py-8 md:px-10">
        <h1 className="text-2xl font-semibold">Playlist not found</h1>
        <Link to="/playlists" className="mt-4 inline-block text-primary hover:underline">
          ← Back to playlists
        </Link>
      </div>
    );
  }

  const playlistTracks = playlist.trackIds.map(getTrack).filter(Boolean) as ReturnType<typeof getTrack> extends undefined ? never : NonNullable<ReturnType<typeof getTrack>>[];
  const tracksList = playlistTracks as NonNullable<ReturnType<typeof getTrack>>[];

  const onPlayAll = () => {
    if (tracksList.length) playQueue(tracksList, 0);
  };

  const onDelete = () => {
    if (confirm(`Delete playlist "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
      navigate({ to: "/playlists" });
    }
  };

  const candidates = allTracks.filter((t) => !playlist.trackIds.includes(t.id));

  return (
    <div className="px-6 py-8 md:px-10">
      <Link to="/playlists" className="mb-4 inline-block text-sm text-muted-foreground hover:text-primary">
        ← All playlists
      </Link>

      <header className="mb-8 flex flex-wrap items-end gap-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Playlist</p>
          <h1 className="mt-1 text-4xl font-bold text-gradient-neon md:text-5xl">{playlist.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {tracksList.length} {tracksList.length === 1 ? "track" : "tracks"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayAll}
            disabled={tracksList.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-neon px-5 py-2.5 text-sm font-semibold text-background shadow-[0_0_20px_oklch(0.72_0.30_340/0.5)] transition-transform hover:scale-105 disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-current" /> Play
          </button>
          <button
            onClick={() => setPicker((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-4 py-2.5 text-sm hover:border-primary"
          >
            <Plus className="h-4 w-4" /> Add tracks
          </button>
          <button
            onClick={onDelete}
            aria-label="Delete playlist"
            className="rounded-full border border-border bg-card/60 p-2.5 text-muted-foreground hover:border-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {picker && (
        <section className="mb-8 rounded-xl border border-border bg-card/40 p-3">
          <p className="mb-2 px-2 text-xs uppercase tracking-wider text-muted-foreground">Add a track</p>
          {candidates.length === 0 ? (
            <p className="px-2 py-2 text-sm text-muted-foreground">All tracks already added.</p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {candidates.map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent/10">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{t.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.artist} · {t.album}</p>
                  </div>
                  <button
                    onClick={() => addToPlaylist(playlist.id, t.id)}
                    className="rounded-md bg-accent/20 px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/30"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tracksList.length === 0 ? (
        <p className="rounded-lg bg-card/40 p-6 text-sm text-muted-foreground">
          This playlist is empty. Use "Add tracks" to fill it up.
        </p>
      ) : (
        <div className="rounded-xl bg-card/40 p-2 backdrop-blur">
          {tracksList.map((t, i) => (
            <div key={t.id} className="group flex items-center">
              <div className="flex-1">
                <TrackRow track={t} index={i} queue={tracksList} />
              </div>
              <button
                onClick={() => removeFromPlaylist(playlist.id, t.id)}
                aria-label="Remove from playlist"
                className="mr-3 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
