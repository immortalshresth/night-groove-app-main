import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { tracks as allTracks, getTrack, type Track } from "@/data/tracks";

type Repeat = "off" | "all" | "one";

type PlayerState = {
  current: Track | null;
  queue: Track[];                // upcoming tracks (excluding current)
  history: Track[];
  isPlaying: boolean;
  progress: number;              // seconds
  duration: number;              // seconds
  volume: number;                // 0..1
  muted: boolean;
  shuffle: boolean;
  repeat: Repeat;
  liked: Set<string>;
  playlists: Playlist[];
};

export type Playlist = {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
};

type PlayerActions = {
  playTrack: (track: Track, queue?: Track[]) => void;
  playQueue: (tracks: Track[], startIndex?: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  createPlaylist: (name: string) => string;
  addToPlaylist: (playlistId: string, trackId: string) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  removeFromQueue: (index: number) => void;
};

const PlayerContext = createContext<(PlayerState & PlayerActions) | null>(null);

const LS_KEY = "neon-player-state-v1";

function loadPersisted(): { liked: string[]; playlists: Playlist[]; volume: number } {
  if (typeof window === "undefined") return { liked: [], playlists: [], volume: 0.8 };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { liked: [], playlists: [], volume: 0.8 };
    const p = JSON.parse(raw);
    return {
      liked: Array.isArray(p.liked) ? p.liked : [],
      playlists: Array.isArray(p.playlists) ? p.playlists : [],
      volume: typeof p.volume === "number" ? p.volume : 0.8,
    };
  } catch {
    return { liked: [], playlists: [], volume: 0.8 };
  }
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [current, setCurrent] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<Repeat>("off");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  // hydrate from localStorage on client
  useEffect(() => {
    const p = loadPersisted();
    setLiked(new Set(p.liked));
    setPlaylists(p.playlists);
    setVolumeState(p.volume);
  }, []);

  // persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ liked: Array.from(liked), playlists, volume })
    );
  }, [liked, playlists, volume]);

  // sync volume/mute to audio element
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
    a.muted = muted;
  }, [volume, muted]);

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    setCurrent(track);
    if (newQueue) {
      const idx = newQueue.findIndex((t) => t.id === track.id);
      const upcoming = idx >= 0 ? newQueue.slice(idx + 1) : newQueue;
      setQueue(upcoming);
    }
    setIsPlaying(true);
  }, []);

  const playQueue = useCallback((tracks: Track[], startIndex = 0) => {
    if (tracks.length === 0) return;
    const start = tracks[startIndex];
    setCurrent(start);
    setQueue(tracks.slice(startIndex + 1));
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!current) {
      // If nothing loaded, play first track of all
      if (allTracks.length > 0) playQueue(allTracks, 0);
      return;
    }
    setIsPlaying((p) => !p);
  }, [current, playQueue]);

  const next = useCallback(() => {
    setCurrent((cur) => {
      if (!cur) return cur;
      let upcoming = queue;
      let nextTrack: Track | undefined;

      if (shuffle && upcoming.length > 0) {
        const i = Math.floor(Math.random() * upcoming.length);
        nextTrack = upcoming[i];
        upcoming = upcoming.filter((_, idx) => idx !== i);
      } else if (upcoming.length > 0) {
        nextTrack = upcoming[0];
        upcoming = upcoming.slice(1);
      } else if (repeat === "all") {
        // restart from full library or just loop to first of original
        nextTrack = allTracks[0];
        upcoming = allTracks.slice(1);
      }

      if (!nextTrack) {
        setIsPlaying(false);
        return cur;
      }
      setHistory((h) => [...h, cur]);
      setQueue(upcoming);
      setIsPlaying(true);
      return nextTrack;
    });
  }, [queue, shuffle, repeat]);

  const prev = useCallback(() => {
    // If played > 3s, restart current
    const a = audioRef.current;
    if (a && a.currentTime > 3) {
      a.currentTime = 0;
      return;
    }
    setHistory((h) => {
      if (h.length === 0) {
        if (a) a.currentTime = 0;
        return h;
      }
      const prevTrack = h[h.length - 1];
      setQueue((q) => (current ? [current, ...q] : q));
      setCurrent(prevTrack);
      setIsPlaying(true);
      return h.slice(0, -1);
    });
  }, [current]);

  const seek = useCallback((seconds: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = seconds;
    setProgress(seconds);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.max(0, Math.min(1, v)));
    if (v > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);
  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);
  const cycleRepeat = useCallback(() =>
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off")), []);

  const toggleLike = useCallback((trackId: string) => {
    setLiked((s) => {
      const n = new Set(s);
      if (n.has(trackId)) n.delete(trackId);
      else n.add(trackId);
      return n;
    });
  }, []);

  const isLiked = useCallback((trackId: string) => liked.has(trackId), [liked]);

  const createPlaylist = useCallback((name: string) => {
    const id = `pl-${Date.now()}`;
    setPlaylists((pls) => [...pls, { id, name, trackIds: [], createdAt: Date.now() }]);
    return id;
  }, []);

  const addToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists((pls) => pls.map((p) =>
      p.id === playlistId && !p.trackIds.includes(trackId)
        ? { ...p, trackIds: [...p.trackIds, trackId] }
        : p
    ));
  }, []);

  const removeFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists((pls) => pls.map((p) =>
      p.id === playlistId ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) } : p
    ));
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists((pls) => pls.filter((p) => p.id !== playlistId));
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue((q) => q.filter((_, i) => i !== index));
  }, []);

  // audio element side-effects
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!current) {
      a.pause();
      return;
    }
    if (a.src !== window.location.origin + current.src) {
      a.src = current.src;
    }
    if (isPlaying) {
      a.play().catch(() => setIsPlaying(false));
    } else {
      a.pause();
    }
  }, [current, isPlaying]);

  const handleEnded = useCallback(() => {
    if (repeat === "one" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }
    next();
  }, [repeat, next]);

  const value = useMemo<PlayerState & PlayerActions>(() => ({
    current, queue, history, isPlaying, progress, duration,
    volume, muted, shuffle, repeat, liked, playlists,
    playTrack, playQueue, togglePlay, next, prev, seek,
    setVolume, toggleMute, toggleShuffle, cycleRepeat,
    toggleLike, isLiked,
    createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist,
    removeFromQueue,
  }), [
    current, queue, history, isPlaying, progress, duration,
    volume, muted, shuffle, repeat, liked, playlists,
    playTrack, playQueue, togglePlay, next, prev, seek,
    setVolume, toggleMute, toggleShuffle, cycleRepeat,
    toggleLike, isLiked,
    createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist,
    removeFromQueue,
  ]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress((e.target as HTMLAudioElement).currentTime)}
        onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration || 0)}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

export { getTrack };
