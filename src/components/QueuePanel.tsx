import { X } from "lucide-react";
import { usePlayer } from "./player/PlayerProvider";
import { AlbumCover } from "./AlbumCover";

export function QueuePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { current, queue, removeFromQueue } = usePlayer();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-80 flex-col border-l border-border bg-sidebar/95 backdrop-blur transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ paddingBottom: "6.5rem" }}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gradient-neon">Queue</h2>
          <button onClick={onClose} aria-label="Close queue" className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {current && (
            <>
              <p className="mb-2 px-2 text-xs uppercase text-muted-foreground">Now playing</p>
              <div className="mb-4 flex items-center gap-3 rounded-md bg-accent/10 p-2">
                <div className="h-12 w-12 shrink-0">
                  <AlbumCover src={current.cover} alt={current.album} seed={current.album} className="rounded" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-primary">{current.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{current.artist}</p>
                </div>
              </div>
            </>
          )}

          <p className="mb-2 px-2 text-xs uppercase text-muted-foreground">Up next</p>
          {queue.length === 0 ? (
            <p className="px-2 text-sm text-muted-foreground">Queue is empty.</p>
          ) : (
            <ul className="space-y-1">
              {queue.map((t, i) => (
                <li key={`${t.id}-${i}`} className="group flex items-center gap-3 rounded-md p-2 hover:bg-accent/10">
                  <div className="h-10 w-10 shrink-0">
                    <AlbumCover src={t.cover} alt={t.album} seed={t.album} className="rounded" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{t.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.artist}</p>
                  </div>
                  <button
                    onClick={() => removeFromQueue(i)}
                    aria-label="Remove from queue"
                    className="text-muted-foreground opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
