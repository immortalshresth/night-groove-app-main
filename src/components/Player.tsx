import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Heart, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2, VolumeX, ListMusic } from "lucide-react";
import { usePlayer } from "./player/PlayerProvider";
import { AlbumCover } from "./AlbumCover";
import { QueuePanel } from "./QueuePanel";
import { cn } from "@/lib/utils";
export function Player() {
  const { current, isPlaying, togglePlay, volume, setVolume } = usePlayer();
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
 
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState("");
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [tempMetadata, setTempMetadata] = useState<any>(null);
  // --- LIKED SONGS STORAGE ---
const [likedSongs, setLikedSongs] = useState<any[]>(() => {
  // Check if we are running in the browser (client-side)
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem("liked-songs");
    return saved ? JSON.parse(saved) : [];
  }
  // If we are in the terminal/Node, return an empty array
  return [];
});

useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("liked-songs", JSON.stringify(likedSongs));
  }
}, [likedSongs]);

const toggleLike = () => {
    if (!activeVideoId) return;

    // Check if current ID is already in the liked list
    const isAlreadyLiked = likedSongs.some(song => song.id === activeVideoId);

    if (isAlreadyLiked) {
      // Logic for Unliking
      setLikedSongs(likedSongs.filter(song => song.id !== activeVideoId));
      console.log("💔 Removed from collection");
    } else if (tempMetadata) {
      // Logic for Liking: Use the metadata we saved during search
      setLikedSongs([...likedSongs, tempMetadata]);
      console.log("❤️ Added to collection:", tempMetadata.title);
    }
  };


const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search button clicked! Query:", searchQuery);

    if (!searchQuery) return;

    setIsLoadingSearch(true); 
    
    try {
      const res = await fetch(`https://neonwave-streaming-platform-backend.onrender.com/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      // ⚡ THIS IS THE LINE THAT WAS MISSING! It defines 'data'
      const data = await res.json(); 
      console.log("✅ Data received from backend:", data);

// ⚡ THIS IS THE FIX: Look for 'data.id' instead of 'data.audioUrl'
      if (data.id) { 
        const id = data.id; 
        
        setActiveVideoId(id);
        setTempMetadata({
          id: id,
          title: data.title,
          artist: data.artist,
          cover: data.cover,
          // We don't need audioUrl anymore since the audio tag uses the ID directly!
        });
        
        console.log("🎥 Active Track Set:", data.title);
      }
    } catch (error: any) {
      console.error("❌ Fetch Error:", error.message);
      alert("Backend connection failed.");
    } finally {
      setIsLoadingSearch(false);
    }
  };



  return (
    <>
      {/* THE HIDDEN ENGINE: This handles the audio without being seen */}
      <div className="hidden">

 
{/* ⚡ THE NATIVE PROXY AUDIO ENGINE (Re-installed) */}
<div className="hidden">
  {activeVideoId && (
    <audio
      ref={audioRef}
      src={`https://neonwave-streaming-platform-backend.onrender.com/api/stream?id=${activeVideoId}`} 
      autoPlay 
      onPlay={() => setIsAudioPlaying(true)}   
      onPause={() => setIsAudioPlaying(false)} 
      onEnded={() => setIsAudioPlaying(false)} 
      onError={() => {
        console.log("⚠️ Stream dropped.");
        setIsAudioPlaying(false);
      }}
    />
  )}
</div>
      </div>

{/* ⚡ UPGRADED SEARCH BAR: Snapped to the chassis instead of floating */}
<form onSubmit={handleSearch} className="mt-8 relative z-50 bg-[#1e1e1e] border border-white/5 p-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex gap-2 w-full max-w-md mx-auto">
  <input 
    value={searchQuery} 
    onChange={(e) => setSearchQuery(e.target.value)} 
    placeholder="Load track..." 
    className="bg-transparent px-4 py-1 outline-none text-white placeholder-zinc-600 w-full text-sm font-mono" 
  />
  <button type="submit" disabled={isLoadingSearch} className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase disabled:opacity-50 transition-colors">
    {isLoadingSearch ? "..." : "Drop"}
  </button>
</form>
        {/* --- LIKED PLAYLIST SECTION --- */}
       <div className="w-full flex-1 flex flex-col items-center justify-center py-12 font-sans antialiased relative z-10">
  
  {/* --- MAIN GRAPHITE CHASSIS --- */}
  <div className="relative w-full max-w-2xl aspect-3/4 bg-[#262626] rounded-[3rem] p-10 flex flex-col shadow-[20px_30px_40px_rgba(0,0,0,0.8),inset_1px_1px_2px_rgba(255,255,255,0.05)] border border-white/5">
    
    {/* Top Left Knob (Volume/Power) */}
    <div className="absolute top-10 left-10 w-16 h-16 bg-[#262626] rounded-full shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#323232] flex items-center justify-center cursor-pointer active:shadow-[inset_3px_3px_5px_#1a1a1a,inset_-3px_-3px_5px_#323232] transition-shadow">
      <div className="w-1 h-4 bg-purple-500 rounded-full -translate-y-4 shadow-[0_0_8px_#a855f7]" />
    </div>

    {/* --- THE TURNTABLE & VINYL --- */}
    <div className="relative w-full aspect-square mt-8 flex items-center justify-center">
      {/* Platter Base/Well */}
      <div className="absolute w-[95%] h-[95%] bg-[#1a1a1a] rounded-full shadow-[inset_10px_10px_20px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)]" />
      
      {/* The Vinyl Record */}
      <div className={cn(
        "relative w-[90%] h-[90%] bg-[#0a0a0a] rounded-full shadow-2xl border-4px border-[#18181b] flex items-center justify-center overflow-hidden",
        activeVideoId ? "animate-[spin_4s_linear_infinite]" : ""
      )}>
        {/* Grooves */}
        <div className="absolute inset-0 rounded-full border border-white/2 m-4" />
        <div className="absolute inset-0 rounded-full border border-white/3 m-8" />
        <div className="absolute inset-0 rounded-full border border-white/2 m-12" />
        <div className="absolute inset-0 rounded-full border border-white/4 m-16" />
        
        {/* Center Label */}
        <div className="relative w-1/3 h-1/3 bg-zinc-900 rounded-full flex flex-col items-center justify-center border-2 border-zinc-700 shadow-[inset_0_0_15px_rgba(0,0,0,0.9)] overflow-hidden z-10">
          {tempMetadata?.cover ? (
            <>
              <img src={tempMetadata.cover} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" alt="" />
              <p className="z-10 text-[10px] font-bold text-white text-center px-2 uppercase tracking-tighter leading-tight drop-shadow-md">
                {tempMetadata.title || "No Track"}
              </p>
              <p className="z-10 text-[8px] font-bold text-purple-400 text-center mt-1 drop-shadow-md">
                {tempMetadata.artist || "Insert Record"}
              </p>
            </>
          ) : (
            <p className="text-[10px] font-bold text-zinc-600 tracking-widest">NO SIGNAL</p>
          )}
          {/* Spindle */}
          <div className="absolute w-4 h-4 bg-[#111] rounded-full z-20 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)] border border-black" />
        </div>
      </div>

      {/* The Tonearm */}
      <div className={cn(
        "absolute top-4 -right-4 w-12 h-64 origin-top transition-transform duration-700 z-30",
        activeVideoId ? "rotate-25" : "rotate-0"
      )}>
        {/* Arm Base */}
        <div className="w-12 h-12 bg-zinc-800 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_2px_2px_rgba(255,255,255,0.1)] border-4 border-zinc-900" />
        {/* Carbon Fiber/Metal Rod */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-2.5 h-48 bg-linear-to-r from-zinc-600 via-zinc-400 to-zinc-700 shadow-xl" />
        {/* Cartridge */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-5 h-10 bg-[#111] rounded-sm -rotate-20 shadow-[2px_5px_10px_rgba(0,0,0,0.5)] border-t border-zinc-700" />
      </div>
    </div>

    {/* Custom Engraving */}
    <div className="mt-12 text-center flex justify-center">
      <span 
        className="font-serif tracking-[0.6em] text-sm uppercase font-bold text-[#1a1a1a]"
        style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.08)' }}
      >
        S H R E S T H &nbsp; P A N I G R A H I
      </span>
    </div>

    {/* --- BOTTOM TACTILE CONTROLS --- */}
    <div className="mt-auto flex items-end justify-between">
      
      {/* Bottom Left Knob (Like Button) */}
      <div 
        onClick={toggleLike}
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300",
          likedSongs.some(s => s.id === activeVideoId) 
            ? "bg-[#262626] shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#323232]" 
            : "bg-[#262626] shadow-[6px_6px_12px_#1a1a1a,-6px_-6px_12px_#323232]"
        )}
      >
        <Heart className={cn(
          "h-6 w-6 transition-colors duration-300", 
          likedSongs.some(s => s.id === activeVideoId) ? "fill-purple-500 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "text-zinc-600"
        )} />
      </div>

      {/* Play/Pause physical switch */}
      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] text-zinc-600 font-bold tracking-widest rotate--90 translate-y-4 -translate-x-6" style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.05)' }}>
            POWER
          </span>
          <div className="w-8 h-20 bg-[#1a1a1a] rounded-full shadow-[inset_2px_2px_8px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)] p-1 relative flex flex-col justify-between">
<button 
  onClick={() => audioRef.current?.play()}
  className={cn(
    "w-6 h-8 rounded-full flex items-center justify-center transition-all",
    activeVideoId ? "bg-purple-500 shadow-[0_0_10px_#a855f7]" : "bg-zinc-800 hover:bg-zinc-700"
  )}
>
  <Play className={cn("h-3 w-3 ml-0.5", activeVideoId ? "text-white fill-current" : "text-zinc-400")} />
</button>
<button 
  onClick={() => audioRef.current?.pause()} 
  className="w-6 h-8 bg-transparent rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
>
  <Pause className="h-3 w-3 text-zinc-500" />
</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Search Interface (Floating below the chassis) */}
  <form onSubmit={handleSearch} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1e1e1e] border border-white/5 p-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex gap-2 w-[90%] max-w-md">
    <input 
      value={searchQuery} 
      onChange={(e) => setSearchQuery(e.target.value)} 
      placeholder="Load track..." 
      className="bg-transparent px-4 py-1 outline-none text-white placeholder-zinc-600 w-full text-sm font-mono" 
    />
    <button type="submit" disabled={isLoadingSearch} className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase disabled:opacity-50 transition-colors">
      {isLoadingSearch ? "..." : "Drop"}
    </button>
  </form>
</div>
<footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
          
          {/* --- LEFT SIDE: TACTILE CONTROLS --- */}
          <div className="flex items-center gap-6">
            
{/* ⚡ THE UNIFIED MASTER TOGGLE SWITCH */}
<button 
onClick={() => {
    // ⚡ FIX: Swap ytPlayer back to audioRef
    if (!audioRef.current) return; 
    
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }}
              className={cn(
                "relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 border shadow-xl group",
                isAudioPlaying 
                  ? "bg-zinc-900 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2),inset_0_2px_10px_rgba(0,0,0,0.5)]" 
                  : "bg-zinc-800 border-white/10 hover:bg-zinc-700 hover:border-white/20 hover:scale-105"
              )}
            >
              {isAudioPlaying ? (
                <Pause className="h-6 w-6 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              ) : (
                <Play className="h-6 w-6 text-zinc-100 ml-1 drop-shadow-md group-hover:text-white" />
              )}
            </button>

            {/* ⚡ LIKED SONGS BUTTON */}
            <button
              onClick={toggleLike}
              className={cn(
                "transition-all hover:scale-110 active:scale-95",
                likedSongs.some(s => s.id === activeVideoId) ? "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "text-white/40 hover:text-white"
              )}
            >
              <Heart 
                className={cn("h-6 w-6", likedSongs.some(s => s.id === activeVideoId) && "fill-current")} 
              />
            </button>
          </div>

          {/* --- RIGHT SIDE: TELEMETRY DISPLAY --- */}
          <div className="flex flex-col text-right">
             {activeVideoId ? (
               <>
                 <span className="text-sm font-bold text-zinc-200 truncate max-w-50 md:max-w-md drop-shadow-md">
                   {tempMetadata?.title || "Streaming..."}
                 </span>
                 <span className="text-[10px] text-purple-500/80 font-mono tracking-widest uppercase mt-0.5">
                   IMMORTAL ENGINE ACTIVE
                 </span>
               </>
             ) : (
               <span className="text-sm text-zinc-500 font-medium tracking-wide">
                 Ready to drop needle
               </span>
             )}
          </div>

        </div>
      </footer>
    </>
  );
}