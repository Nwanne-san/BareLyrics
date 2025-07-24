import { supabase } from "./superbase";

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

export interface SongSubmission {
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
  submission_type: "new" | "correction";
  original_song_id?: number | null;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SongComment {
  id: number;
  song_id: number;
  user_name?: string | null;
  user_email?: string | null;
  comment_text: string;
  selected_lyrics?: string | null;
  lyrics_start_position?: number | null;
  lyrics_end_position?: number | null;
  comment_type: "general" | "annotation" | "review";
  rating?: number | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// Mock database - fallback when Supabase is not available
const mockSongs: Song[] = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    genre: "Rock",
    year: 1975,
    cover: "/placeholder.svg?height=300&width=300",
    lyrics: `Is this the real life?
Is this just fantasy?
Caught in a landslide
No escape from reality
Open your eyes, look up to the skies and see
I'm just a poor boy, I need no sympathy
Because I'm easy come, easy go, little high, little low
Any way the wind blows doesn't really matter to me, to me

Mama, just killed a man
Put a gun against his head, pulled my trigger, now he's dead
Mama, life had just begun
But now I've gone and thrown it all away

Mama, ooh, didn't mean to make you cry
If I'm not back again this time tomorrow
Carry on, carry on as if nothing really matters

Too late, my time has come
Sends shivers down my spine, body's aching all the time
Goodbye, everybody, I've got to go
Gotta leave you all behind and face the truth

Mama, ooh (any way the wind blows)
I don't wanna die
I sometimes wish I'd never been born at all

[Guitar Solo]

I see a little silhouetto of a man
Scaramouche, Scaramouche, will you do the Fandango?
Thunderbolt and lightning very, very frightening me
(Galileo) Galileo, (Galileo) Galileo, Galileo Figaro
Magnifico-o-o-o-o

I'm just a poor boy, nobody loves me
He's just a poor boy from a poor family
Spare him his life from this monstrosity
Easy come, easy go, will you let me go?
Bismillah! No, we will not let you go
(Let him go!) Bismillah! We will not let you go
(Let him go!) Bismillah! We will not let you go
(Let me go!) Will not let you go
(Let me go!) Will not let you go
(Let me go!) Ah
No, no, no, no, no, no, no
Oh, mama mia, mama mia
Mama mia, let me go
Beelzebub has a devil put aside for me, for me, for me!

[Rock section]

So you think you can stone me and spit in my eye?
So you think you can love me and leave me to die?
Oh, baby, can't do this to me, baby!
Just gotta get out, just gotta get right outta here!

[Outro]

Nothing really matters, anyone can see
Nothing really matters
Nothing really matters to me

Any way the wind blows...`,
  },
  {
    id: 2,
    title: "We Will Rock You",
    artist: "Queen",
    album: "News of the World",
    genre: "Rock",
    year: 1977,
    cover: "/placeholder.svg?height=300&width=300",
    lyrics: `Buddy, you're a boy, make a big noise
Playing in the street, gonna be a big man someday
You got mud on your face, you big disgrace
Kicking your can all over the place, singin'

We will, we will rock you
We will, we will rock you

Buddy, you're a young man, hard man
Shouting in the street, gonna take on the world someday
You got blood on your face, you big disgrace
Waving your banner all over the place

We will, we will rock you, sing it!
We will, we will rock you, yeah

Buddy, you're an old man, poor man
Pleading with your eyes, gonna get you some peace someday
You got mud on your face, big disgrace
Somebody better put you back into your place, do it!

We will, we will rock you, yeah, yeah, come on
We will, we will rock you, alright, louder!
We will, we will rock you, one more time
We will, we will rock you
Yeah`,
  },
  {
    id: 3,
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    genre: "Pop",
    year: 1971,
    cover: "/placeholder.svg?height=300&width=300",
    lyrics: `Imagine there's no heaven
It's easy if you try
No hell below us
Above us only sky
Imagine all the people living for today

Imagine there's no countries
It isn't hard to do
Nothing to kill or die for
And no religion too
Imagine all the people living life in peace

You may say I'm a dreamer
But I'm not the only one
I hope someday you'll join us
And the world will be as one

Imagine no possessions
I wonder if you can
No need for greed or hunger
A brotherhood of man
Imagine all the people sharing all the world

You may say I'm a dreamer
But I'm not the only one
I hope someday you'll join us
And the world will live as one`,
  },
];

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

// Admin function to create song directly
export async function createSongDirect(
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
      console.error("Supabase createSongDirect error:", error);
      throw new Error("Failed to create song");
    }

    return data;
  } catch (error) {
    console.error("createSongDirect error:", error);
    throw error;
  }
}

// User function to submit song for review
export async function createSongSubmission(
  songData: Omit<
    SongSubmission,
    | "id"
    | "status"
    | "admin_notes"
    | "reviewed_by"
    | "reviewed_at"
    | "created_at"
    | "updated_at"
  >
): Promise<SongSubmission> {
  try {
    const { data, error } = await supabase
      .from("song_submissions")
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
          submission_type: songData.submission_type,
          original_song_id: songData.original_song_id,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase createSongSubmission error:", error);
      throw new Error("Failed to submit song for review");
    }

    return data;
  } catch (error) {
    console.error("createSongSubmission error:", error);
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

// Admin functions for managing submissions
export async function getAllSubmissions(): Promise<SongSubmission[]> {
  try {
    const { data, error } = await supabase
      .from("song_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase getAllSubmissions error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("getAllSubmissions error:", error);
    return [];
  }
}

export async function updateSubmissionStatus(
  id: number,
  status: "approved" | "rejected",
  adminNotes?: string,
  reviewedBy?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from("song_submissions")
      .update({
        status,
        admin_notes: adminNotes,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Supabase updateSubmissionStatus error:", error);
      throw new Error("Failed to update submission status");
    }
  } catch (error) {
    console.error("updateSubmissionStatus error:", error);
    throw error;
  }
}

export async function approveSubmission(
  submission: SongSubmission
): Promise<Song> {
  try {
    // First, create the song in the main songs table
    const newSong = await createSongDirect({
      title: submission.title,
      artist: submission.artist,
      album: submission.album,
      genre: submission.genre,
      year: submission.year,
      cover: submission.cover,
      lyrics: submission.lyrics,
      submitter_name: submission.submitter_name,
      submitter_email: submission.submitter_email,
    });

    // Then update the submission status
    await updateSubmissionStatus(
      submission.id,
      "approved",
      "Song approved and added to database"
    );

    return newSong;
  } catch (error) {
    console.error("approveSubmission error:", error);
    throw error;
  }
}

export async function deleteSong(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("songs").delete().eq("id", id);

    if (error) {
      console.error("Supabase deleteSong error:", error);
      throw new Error("Failed to delete song");
    }
  } catch (error) {
    console.error("deleteSong error:", error);
    throw error;
  }
}

export async function updateSong(
  id: number,
  songData: Partial<Song>
): Promise<Song> {
  try {
    // First, let's get the current song to make sure it exists
    const { data: currentSong, error: fetchError } = await supabase
      .from("songs")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching song for update:", fetchError);
      throw new Error("Song not found");
    }

    // Now update the song
    const { data, error } = await supabase
      .from("songs")
      .update({
        ...songData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase updateSong error:", error);
      throw new Error("Failed to update song");
    }

    if (!data) {
      throw new Error("No data returned from update");
    }

    return data;
  } catch (error) {
    console.error("updateSong error:", error);
    throw error;
  }
}

// Comments functions
export async function getSongComments(songId: number): Promise<SongComment[]> {
  try {
    console.log("Fetching comments for song ID:", songId);

    const { data, error } = await supabase
      .from("song_comments")
      .select("*")
      .eq("song_id", songId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase getSongComments error:", error);
      return [];
    }

    console.log("Comments fetched:", data);
    return data || [];
  } catch (error) {
    console.error("getSongComments error:", error);
    return [];
  }
}

export async function createSongComment(
  commentData: Omit<
    SongComment,
    "id" | "is_approved" | "created_at" | "updated_at"
  >
): Promise<SongComment> {
  try {
    console.log("Creating comment:", commentData);

    const { data, error } = await supabase
      .from("song_comments")
      .insert([
        {
          song_id: commentData.song_id,
          user_name: commentData.user_name,
          user_email: commentData.user_email,
          comment_text: commentData.comment_text,
          selected_lyrics: commentData.selected_lyrics,
          lyrics_start_position: commentData.lyrics_start_position,
          lyrics_end_position: commentData.lyrics_end_position,
          comment_type: commentData.comment_type,
          rating: commentData.rating,
          is_approved: true, // Auto-approve for now
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase createSongComment error:", error);
      throw new Error("Failed to create comment");
    }

    console.log("Comment created:", data);
    return data;
  } catch (error) {
    console.error("createSongComment error:", error);
    throw error;
  }
}

export async function getAllComments(): Promise<SongComment[]> {
  try {
    const { data, error } = await supabase
      .from("song_comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase getAllComments error:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("getAllComments error:", error);
    return [];
  }
}

export async function updateCommentStatus(
  id: number,
  isApproved: boolean
): Promise<void> {
  try {
    const { error } = await supabase
      .from("song_comments")
      .update({
        is_approved: isApproved,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Supabase updateCommentStatus error:", error);
      throw new Error("Failed to update comment status");
    }
  } catch (error) {
    console.error("updateCommentStatus error:", error);
    throw error;
  }
}
