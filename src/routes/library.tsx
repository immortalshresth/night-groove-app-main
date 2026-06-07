import { createFileRoute } from "@tanstack/react-router";
import { tracks, albums } from "@/data/tracks";
import { usePlayer } from "@/components/player/PlayerProvider";
import { AlbumCard } from "@/components/AlbumCard";
import { TrackRow } from "@/components/TrackRow";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Your Library — Neonwave" },
      { name: "description", content: "Your liked tracks and saved albums." },
      { property: "og:title", content: "Your Library — Neonwave" },
      { property: "og:description", content: "Your liked tracks and saved albums." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { liked } = usePlayer();
  const likedTracks = tracks.filter((t) => liked.has(t.id));
  const likedAlbumIds = new Set(likedTracks.map((t) => `${t.artist}__${t.album}`.replace(/\s+/g, "-").toLowerCase()));
  const likedAlbums = albums.filter((a) => likedAlbumIds.has(a.id));

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="mb-1 text-3xl font-bold text-gradient-neon md:text-4xl">Your Library</h1>
      <p className="mb-8 text-muted-foreground">Tracks and albums you've liked.</p>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Liked tracks</h2>
        {likedTracks.length === 0 ? (
          <p className="rounded-lg bg-card/40 p-6 text-sm text-muted-foreground">
            No liked tracks yet — tap the heart icon on any song to save it here.
          </p>
        ) : (
          <div className="rounded-xl bg-card/40 p-2 backdrop-blur">
            {likedTracks.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i} queue={likedTracks} />
            ))}
          </div>
        )}
      </section>

      {likedAlbums.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">From albums you like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {likedAlbums.map((a) => <AlbumCard key={a.id} album={a} />)}
          </div>
        </section>
      )}
    </div>
  );
}
