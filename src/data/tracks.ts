export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string; // path under /public, e.g. /covers/midnight.jpg
  src: string;   // path under /public, e.g. /music/track1.mp3
  duration?: number;
};

// Drop your audio files into public/music/ and cover art into public/covers/.
// If a cover is missing, the AlbumCard component renders a neon gradient placeholder.
export const tracks: Track[] = [
  { id: "t1",  title: "Neon Dreams",      artist: "Voltage",       album: "Midnight Drive",   cover: "/covers/midnight.jpg", src: "/music/aag.mp3" },
  { id: "t2",  title: "Pacific Highway",  artist: "Voltage",       album: "Midnight Drive",   cover: "/covers/midnight.jpg", src: "/music/aagalt.mp3" },
  { id: "t3",  title: "Chrome Sunset",    artist: "Voltage",       album: "Midnight Drive",   cover: "/covers/midnight.jpg", src: "/music/emptyroom.mp3" },

  { id: "t4",  title: "Velvet Lights",    artist: "Lyra Moon",     album: "After Hours",      cover: "/covers/afterhours.jpg", src: "/music/emptyroomalt.mp3" },
  { id: "t5",  title: "Echo Chamber",     artist: "Lyra Moon",     album: "After Hours",      cover: "/covers/afterhours.jpg", src: "/music/hallway.mp3" },
  { id: "t6",  title: "Ghost Frequency",  artist: "Lyra Moon",     album: "After Hours",      cover: "/covers/afterhours.jpg", src: "/music/lost.mp3" },

  { id: "t7",  title: "Skyline Pulse",    artist: "Cassette Wave", album: "Analog Heart",     cover: "/covers/analog.jpg", src: "/music/lost.mp3" },
  { id: "t8",  title: "Magnetic Tape",    artist: "Cassette Wave", album: "Analog Heart",     cover: "/covers/analog.jpg", src: "/music/lostalt.mp3" },
  { id: "t9",  title: "Static Bloom",     artist: "Cassette Wave", album: "Analog Heart",     cover: "/covers/analog.jpg", src: "/music/scream.mp3" },

  { id: "t10", title: "Crystal Coast",    artist: "Aurora Park",   album: "Glass Horizon",    cover: "/covers/glass.jpg", src: "/music/SCREAMw.mp3" },
  { id: "t11", title: "Reverie",          artist: "Aurora Park",   album: "Glass Horizon",    cover: "/covers/glass.jpg", src: "/music/shadow.mp3" },
  { id: "t12", title: "Lavender Sky",     artist: "Aurora Park",   album: "Glass Horizon",    cover: "/covers/glass.jpg", src: "/music/shadowalt.mp3" },

  { id: "t13", title: "Hyperdrive",       artist: "Nova Synth",    album: "Stellar",          cover: "/covers/stellar.jpg", src: "/music/SystemOverload.mp3" },
  { id: "t14", title: "Galactic Bloom",   artist: "Nova Synth",    album: "Stellar",          cover: "/covers/stellar.jpg", src: "/music/SystemOverloadalt.mp3" },
  { id: "t15", title: "Orbital",          artist: "Nova Synth",    album: "Stellar",          cover: "/covers/stellar.jpg", src: "/music/track15.mp3" },

  { id: "t16", title: "Smoke & Mirrors",  artist: "Kaito Ray",     album: "Tokyo Rain",       cover: "/covers/tokyo.jpg", src: "/music/track16.mp3" },
  { id: "t17", title: "Backstreet Glow",  artist: "Kaito Ray",     album: "Tokyo Rain",       cover: "/covers/tokyo.jpg", src: "/music/track17.mp3" },
  { id: "t18", title: "Late Train",       artist: "Kaito Ray",     album: "Tokyo Rain",       cover: "/covers/tokyo.jpg", src: "/music/track18.mp3" },
];

export type Album = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  trackIds: string[];
};

export const albums: Album[] = Array.from(
  tracks.reduce((map, t) => {
    const key = `${t.artist}__${t.album}`;
    if (!map.has(key)) {
      map.set(key, {
        id: key.replace(/\s+/g, "-").toLowerCase(),
        title: t.album,
        artist: t.artist,
        cover: t.cover,
        trackIds: [],
      });
    }
    map.get(key)!.trackIds.push(t.id);
    return map;
  }, new Map<string, Album>()).values()
);

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getAlbumTracks(album: Album): Track[] {
  return album.trackIds.map(getTrack).filter(Boolean) as Track[];
}
