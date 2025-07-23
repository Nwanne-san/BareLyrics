"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Users, Calendar, TrendingUp } from "lucide-react";
import { getAllSongs, getAllArtists } from "@/lib/database";

interface SongStats {
  totalSongs: number;
  totalArtists: number;
  recentSongs: number;
  topGenres: string[];
}

export function SongStatsDisplay() {
  const [stats, setStats] = useState<SongStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [songs, artists] = await Promise.all([
        getAllSongs(),
        getAllArtists(),
      ]);

      // Calculate recent songs (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentSongs = songs.filter((song) => {
        if (!song.created_at) return false;
        return new Date(song.created_at) > thirtyDaysAgo;
      }).length;

      // Get top genres
      const genreCounts = songs.reduce((acc, song) => {
        if (song.genre) {
          acc[song.genre] = (acc[song.genre] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const topGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([genre]) => genre);

      setStats({
        totalSongs: songs.length,
        totalArtists: artists.length,
        recentSongs,
        topGenres,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6 text-center">
          <Music className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <h3 className="text-2xl font-bold">
            {stats.totalSongs.toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Songs</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <h3 className="text-2xl font-bold">
            {stats.totalArtists.toLocaleString()}
          </h3>
          <p className="text-gray-600">Artists</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <h3 className="text-2xl font-bold">{stats.recentSongs}</h3>
          <p className="text-gray-600">Added This Month</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <h3 className="text-lg font-bold">
            {stats.topGenres.length > 0 ? stats.topGenres[0] : "Various"}
          </h3>
          <p className="text-gray-600">Top Genre</p>
        </CardContent>
      </Card>
    </div>
  );
}
