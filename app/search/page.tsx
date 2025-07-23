import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, SearchIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { searchSongs } from "@/lib/database";
import { SearchDropdown } from "@/components/search-dropdown";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const results = query ? await searchSongs(query) : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 font-poppins">
            {query ? `Search Results for "${query}"` : "Search Songs"}
          </h1>
          {query && (
            <p className="text-gray-600 text-lg">
              Found {results.length} {results.length === 1 ? "song" : "songs"}
            </p>
          )}
        </div>

        {/* Search Bar */}
        <SearchDropdown className="max-w-2xl mx-auto mb-12" />

        {/* Results */}
        {query && (
          <section>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {results.map((song) => (
                  <Link key={song.id} href={`/song/${song.id}`}>
                    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-gray-200 h-full">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col space-y-4">
                          <Image
                            src={song.cover || "/placeholder.svg"}
                            alt={`${song.title} cover`}
                            width={200}
                            height={200}
                            className="w-full aspect-square rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-black text-lg mb-1 truncate font-poppins">
                              {song.title}
                            </h3>
                            <p className="text-gray-600 mb-2 truncate">
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
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-4 font-poppins">
                  No Results Found
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find any songs matching "{query}". Try searching
                  with different keywords or check the spelling.
                </p>
                <Link href="/browse">
                  <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                    Browse All Songs
                  </Button>
                </Link>
              </div>
            )}
          </section>
        )}

        {!query && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4 font-poppins">
              Start Your Search
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Enter a song title or artist name in the search bar above to find
              lyrics.
            </p>
            <Link href="/browse">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                Browse All Songs
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
