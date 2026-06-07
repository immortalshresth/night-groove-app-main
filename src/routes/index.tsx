import { createFileRoute } from "@tanstack/react-router";
import { albums, tracks } from "@/data/tracks";
import { AlbumCard } from "@/components/AlbumCard";
import { TrackRow } from "@/components/TrackRow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — Neonwave" },
      { name: "description", content: "Browse featured synthwave albums and recent tracks." },
      { property: "og:title", content: "Home — Neonwave" },
      { property: "og:description", content: "Browse featured synthwave albums and recent tracks." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = albums;
  const recent = tracks.slice(0, 6);

  return (
    <div className="px-6 py-8 md:px-10">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Welcome to</p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-gradient-neon md:text-5xl">
          Neonwave
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Glowing synthwave, retro electronica, and late-night drives.
        </p>
      </header>

      <section aria-labelledby="featured" className="mb-10">
        <h2 id="featured" className="mb-4 text-xl font-semibold text-foreground">
          Featured albums
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {featured.map((a) => <AlbumCard key={a.id} album={a} />)}
        </div>
      </section>

      <section aria-labelledby="recent">
        <h2 id="recent" className="mb-3 text-xl font-semibold text-foreground">
          Recently added
        </h2>
        <div className="rounded-xl bg-card/40 p-2 backdrop-blur">
          {recent.map((t, i) => (
            <TrackRow key={t.id} track={t} index={i} queue={recent} />
          ))}
        </div>
      </section>
    </div>
  );
}
