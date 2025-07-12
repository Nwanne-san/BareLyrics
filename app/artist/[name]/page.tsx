import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSongsByArtist } from "@/lib/database";

interface ArtistPageProps {
  params: { name: string };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const artistName = decodeURIComponent(params.name);
  const songs = await getSongsByArtist(artistName);

  // Group songs by album
  const albumGroups = songs.reduce((acc, song) => {
    const albumName = song.album || "Singles";
    if (!acc[albumName]) {
      acc[albumName] = [];
    }
    acc[albumName].push(song);
    return acc;
  }, {} as Record<string, typeof songs>);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold text-black">BareLyrics</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/browse"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/submit"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Submit Lyrics
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/browse" className="hover:text-black">
            Browse
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">{artistName}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Artist Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <Music className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 font-poppins">
            {artistName}
          </h1>
          <p className="text-gray-600 text-lg">
            {songs.length} {songs.length === 1 ? "song" : "songs"} available
          </p>
        </div>

        {songs.length > 0 ? (
          <div className="space-y-12">
            {Object.entries(albumGroups).map(([albumName, albumSongs]) => (
              <section key={albumName}>
                <h2 className="text-2xl font-bold text-black mb-6 font-poppins">
                  {albumName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {albumSongs.map((song) => (
                    <Link key={song.id} href={`/song/${song.id}`}>
                      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Image
                              src={song.cover || "/placeholder.svg"}
                              alt={`${song.title} cover`}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-black text-lg mb-1 truncate font-poppins">
                                {song.title}
                              </h3>
                              <p className="text-gray-600 mb-1 truncate">
                                {song.artist}
                              </p>
                              {song.year && (
                                <p className="text-sm text-gray-500 mb-2">
                                  {song.year}
                                </p>
                              )}
                              {song.genre && (
                                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                  {song.genre}
                                </span>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-4 h-4 text-white ml-0.5" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4 font-poppins">
              No Songs Found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We don't have any songs by {artistName} yet. Would you like to
              submit some?
            </p>
            <Link href="/submit">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                Submit Songs
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
