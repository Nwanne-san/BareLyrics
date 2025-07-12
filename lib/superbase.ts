import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      songs: {
        Row: {
          id: number;
          title: string;
          artist: string;
          album: string | null;
          genre: string | null;
          year: number | null;
          cover: string | null;
          lyrics: string;
          submitter_name: string | null;
          submitter_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
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
        };
        Update: {
          id?: number;
          title?: string;
          artist?: string;
          album?: string | null;
          genre?: string | null;
          year?: number | null;
          cover?: string | null;
          lyrics?: string;
          submitter_name?: string | null;
          submitter_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
