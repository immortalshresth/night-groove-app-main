import { Heart, Pause, Play } from "lucide-react";
import { usePlayer } from "./player/PlayerProvider";
import { AlbumCover } from "./AlbumCover";
import type { Track } from "@/data/tracks";
import { cn } from "@/lib/utils";

type Props = {
  track: Track;
  index?: number;
  queue?: Track[];      // queue context to load when this row plays
  showCover?: boolean;
};

export function TrackRow({ track, index, queue, showCover = true }: Props) {
  const { current, isPlaying, togglePlay, playTrack, isLiked, toggleLike } = usePlayer();
  const isCurrent = current?.id === track.id;
  const liked = isLiked(track.id);

  const onPlay = () => {
    if (isCurrent) togglePlay();
    else playTrack(track, queue);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent/10",
        isCurrent && "bg-accent/10"
      )}
    >
      <button
        onClick={onPlay}
        aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
        className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
      >
        {typeof index === "number" && (
          <span className={cn("text-sm group-hover:hidden", isCurrent && "hidden text-primary")}>
            {index + 1}
          </span>
        )}
        <span className={cn(typeof index === "number" ? "hidden group-hover:inline" : "inline", isCurrent && "inline")}>
          {isCurrent && isPlaying ? (
            <Pause className="h-4 w-4 text-primary" />
          ) : (
            <Play className="h-4 w-4 fill-current" />
          )}
        </span>
      </button>

      {showCover && (
        <div className="h-10 w-10 shrink-0">
          <AlbumCover src={track.cover} alt={track.album} seed={track.album} className="rounded" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-medium", isCurrent && "text-primary")}>
          {track.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{track.artist} · {track.album}</p>
      </div>

      <button
        onClick={() => toggleLike(track.id)}
        aria-label={liked ? "Unlike" : "Like"}
        className={cn(
          "flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-primary",
          liked && "text-primary"
        )}
      >
        <Heart className={cn("h-4 w-4", liked && "fill-current")} />
      </button>
    </div>
  );
}
