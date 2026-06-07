import { useState } from "react";
import { Music } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src?: string;
  alt: string;
  seed?: string;
  className?: string;
};

// Deterministic hue from string for placeholder gradient
function hueFromSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360;
}

export function AlbumCover({ src, alt, seed, className }: Props) {
  const [errored, setErrored] = useState(false);
  const showImg = src && !errored;
  const hue = hueFromSeed(seed ?? alt);

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-lg bg-[#0a0a0a]",
        // Added a subtle hardware bezel and deep shadow to embed it in the chassis
        "border border-white/5 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      {showImg ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center relative overflow-hidden"
          style={{
            // ⚡ UPGRADE: Muted, dark-mode gradients (40% sat, 15% lightness)
            background: `linear-gradient(135deg, hsl(${hue} 40% 15%), hsl(${(hue + 60) % 360} 30% 10%))`,
          }}
          aria-label={alt}
        >
          {/* subtle scanline overlay for the hardware feel */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cGF0aCBkPSJNMCAwTDEgMEwwIDFMMCAxWiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPgo8L3N2Zz4=')] opacity-50 pointer-events-none" />
          
          <Music className="h-1/3 w-1/3 text-white/20 drop-shadow-md z-10" />
        </div>
      )}
    </div>
  );
}