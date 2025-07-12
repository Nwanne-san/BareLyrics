import { supabase } from "./superbase";
import { mockSongs } from "@/data/songs";
// Database operations for songs
export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string | null;
  genre?: string | null;
  year?: number | null;
  cover?: string | null;
  lyrics: string;
  submitter_name?: string | null;
  submitter_email?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Mock database - fallback when Supabase is not available


// Database functions with Supabase integration
export async function getAllSongs(): Promise<Song[]> {
  try {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return mockSongs;
    }

    return data || mockSongs;
  } catch (error) {
    console.error("Database error:", error);
    return mockSongs;
  }
}

export async function searchSongs(query: string): Promise<Song[]> {
  try {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .or(
        `title.ilike.%${query}%,artist.ilike.%${query}%,album.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase search error:", error);
      // Fallback to mock data search
      const lowercaseQuery = query.toLowerCase();
      return mockSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(lowercaseQuery) ||
          song.artist.toLowerCase().includes(lowercaseQuery) ||
          (song.album && song.album.toLowerCase().includes(lowercaseQuery))
      );
    }

    return data || [];
  } catch (error) {
    console.error("Search error:", error);
    // Fallback to mock data search
    const lowercaseQuery = query.toLowerCase();
    return mockSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowercaseQuery) ||
        song.artist.toLowerCase().includes(lowercaseQuery) ||
        (song.album && song.album.toLowerCase().includes(lowercaseQuery))
    );
  }
}

export async function getSongById(id: number): Promise<Song | null> {
  try {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase getSongById error:", error);
      return mockSongs.find((song) => song.id === id) || null;
    }

    return data;
  } catch (error) {
    console.error("getSongById error:", error);
    return mockSongs.find((song) => song.id === id) || null;
  }
}

export async function createSong(
  songData: Omit<Song, "id" | "created_at" | "updated_at">
): Promise<Song> {
  try {
    const { data, error } = await supabase
      .from("songs")
      .insert([
        {
          title: songData.title,
          artist: songData.artist,
          album: songData.album,
          genre: songData.genre,
          year: songData.year,
          cover: songData.cover,
          lyrics: songData.lyrics,
          submitter_name: songData.submitter_name,
          submitter_email: songData.submitter_email,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase createSong error:", error);
      throw new Error("Failed to create song");
    }

    return data;
  } catch (error) {
    console.error("createSong error:", error);
    throw error;
  }
}

export async function getSongsByArtist(artist: string): Promise<Song[]> {
  try {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .ilike("artist", artist)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase getSongsByArtist error:", error);
      return mockSongs.filter(
        (song) => song.artist.toLowerCase() === artist.toLowerCase()
      );
    }

    return data || [];
  } catch (error) {
    console.error("getSongsByArtist error:", error);
    return mockSongs.filter(
      (song) => song.artist.toLowerCase() === artist.toLowerCase()
    );
  }
}

export async function getAllArtists(): Promise<
  { name: string; songCount: number }[]
> {
  try {
    const { data, error } = await supabase.from("songs").select("artist");

    if (error) {
      console.error("Supabase getAllArtists error:", error);
      // Fallback to mock data
      const artistCounts = mockSongs.reduce((acc, song) => {
        acc[song.artist] = (acc[song.artist] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(artistCounts).map(([name, songCount]) => ({
        name,
        songCount,
      }));
    }

    // Count songs per artist
    const artistCounts = data.reduce((acc, song) => {
      acc[song.artist] = (acc[song.artist] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(artistCounts).map(([name, songCount]) => ({
      name,
      songCount,
    }));
  } catch (error) {
    console.error("getAllArtists error:", error);
    // Fallback to mock data
    const artistCounts = mockSongs.reduce((acc, song) => {
      acc[song.artist] = (acc[song.artist] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(artistCounts).map(([name, songCount]) => ({
      name,
      songCount,
    }));
  }
}

export async function getSimilarSongs(
  currentSongId: number,
  artist: string,
  genre?: string
): Promise<Song[]> {
  try {
    let query = supabase.from("songs").select("*").neq("id", currentSongId);

    if (genre) {
      query = query.or(`artist.ilike.${artist},genre.ilike.${genre}`);
    } else {
      query = query.ilike("artist", artist);
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Supabase getSimilarSongs error:", error);
      // Fallback to mock data
      return mockSongs
        .filter(
          (song) =>
            song.id !== currentSongId &&
            (song.artist.toLowerCase() === artist.toLowerCase() ||
              (genre && song.genre?.toLowerCase() === genre.toLowerCase()))
        )
        .slice(0, 5);
    }

    return data || [];
  } catch (error) {
    console.error("getSimilarSongs error:", error);
    // Fallback to mock data
    return mockSongs
      .filter(
        (song) =>
          song.id !== currentSongId &&
          (song.artist.toLowerCase() === artist.toLowerCase() ||
            (genre && song.genre?.toLowerCase() === genre.toLowerCase()))
      )
      .slice(0, 5);
  }
}
