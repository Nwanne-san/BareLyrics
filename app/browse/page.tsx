import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SearchDropdown } from "@/components/search-dropdown";
import { getAllSongs, getAllArtists } from "@/lib/database";

export default async function BrowsePage() {
  const [allSongs, allArtists] = await Promise.all([
    getAllSongs(),
    getAllArtists(),
  ]);

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
            <Link href="/browse" className="text-black font-medium">
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

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4 font-poppins">
            Browse Songs & Artists
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our collection of song lyrics from various artists and
            genres
          </p>
        </div>

        {/* Search Bar */}
        <SearchDropdown
          className="max-w-2xl mx-auto mb-12"
          placeholder="Search songs or artists..."
        />

        {/* Artists Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-8 font-poppins">
            All Artists
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {allArtists.map((artist, index) => (
              <Link
                key={index}
                href={`/artist/${encodeURIComponent(artist.name)}`}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200">
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-black mb-1 font-poppins text-sm">
                      {artist.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {artist.songCount}{" "}
                      {artist.songCount === 1 ? "song" : "songs"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Songs Section */}
        <section>
          <h2 className="text-2xl font-bold text-black mb-8 font-poppins">
            All Songs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allSongs.map((song) => (
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
                        {song.album && (
                          <p className="text-sm text-gray-500 mb-2 truncate">
                            {song.album}
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

        {/* Load More */}
        {allSongs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4 font-poppins">
              No Songs Yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Be the first to contribute! Submit some lyrics to get started.
            </p>
            <Link href="/submit">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                Submit First Song
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
