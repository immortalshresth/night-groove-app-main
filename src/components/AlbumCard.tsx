import { Play } from "lucide-react";
import { AlbumCover } from "./AlbumCover";
import { usePlayer } from "./player/PlayerProvider";
import { getAlbumTracks, type Album } from "@/data/tracks";
import { cn } from "@/lib/utils";

export function AlbumCard({ album }: { album: Album }) {
  const { playQueue } = usePlayer();
  
  const onPlay = () => {
    // ⚠️ CRITICAL WIRING POINT:
    // If you want this to use the new Engine, you should pass the album.title + album.artist 
    // into the same search function that your Player search bar uses, rather than relying on static tracks.
    
    const t = getAlbumTracks(album);
    if (t.length) playQueue(t, 0);
  };

  return (
    <div className="group relative cursor-pointer rounded-2xl bg-[#1a1a1a] p-4 transition-all duration-300 hover:-translate-y-2 shadow-[8px_8px_16px_rgba(0,0,0,0.6),-4px_-4px_12px_rgba(255,255,255,0.03)] border border-white/5 hover:border-purple-500/30">
      <div className="relative overflow-hidden rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
        <AlbumCover src={album.cover} alt={album.title} seed={album.id} />
        
        {/* The Engine Ignition Switch */}
        <button
          onClick={onPlay}
          aria-label={`Play ${album.title}`}
          className="absolute bottom-3 right-3 flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-purple-600 opacity-0 shadow-[0_0_20px_#a855f7] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110 hover:bg-purple-500"
        >
          <Play className="h-5 w-5 fill-white text-white ml-1" />
        </button>
      </div>
      
      {/* Track Metadata */}
      <div className="mt-4 space-y-1 px-1">
        <h3 className="truncate font-bold tracking-tight text-zinc-200 drop-shadow-md">
          {album.title}
        </h3>
        <p className="truncate text-xs font-medium uppercase tracking-wider text-zinc-500">
          {album.artist}
        </p>
      </div>
    </div>
  );
}