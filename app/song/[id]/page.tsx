import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSongById, getSimilarSongs } from "@/lib/database";

export default async function SongPage(props: { params: { id: string } }) {
  const { params } = await props;
  const songId = Number.parseInt(params.id);
  const song = await getSongById(songId);

  if (!song) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Song Not Found</h1>
          <Link href="/browse">
            <Button className="bg-black hover:bg-gray-800 text-white">
              Browse Songs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const similarSongs = await getSimilarSongs(
    song.id,
    song.artist,
    song.genre || undefined
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
  

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 ">
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/browse" className="hover:text-black">
            Browse
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/artist/${encodeURIComponent(song.artist)}`}
            className="hover:text-black"
          >
            {song.artist}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black truncate max-w-[100px] sm:max-w-[200px]">
            {song.title}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content - Lyrics Priority */}
          <div className="lg:col-span-3 order-1">
            {/* Compact Song Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black mb-2 font-poppins">
                  {song.title}
                </h1>
                <Link href={`/artist/${encodeURIComponent(song.artist)}`}>
                  <p className="text-xl md:text-2xl text-gray-600 mb-4 hover:text-black transition-colors cursor-pointer">
                    {song.artist}
                  </p>
                </Link>
              </div>
              <Image
                src={song.cover || "/placeholder.svg"}
                alt={`${song.title} cover`}
                width={150}
                height={200}
                className=" sm:w-full aspect-square  rounded-lg object-cover mb-4"
              />
            </div>

            {/* Lyrics - Main Priority */}
            <Card className="border-gray-200">
              <CardContent className="p-6 md:p-8">
                <div className="prose prose-lg max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-base md:text-lg">
                    {song.lyrics}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Correction Notice */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                Found an error in these lyrics?{" "}
                <Link
                  href="/submit"
                  className="text-black font-medium hover:underline"
                >
                  Submit a correction
                </Link>
              </p>
            </div>

            {/* Similar Songs Section - Below lyrics on mobile */}
            {similarSongs.length > 0 && (
              <div className="mt-12 lg:hidden">
                <h3 className="text-2xl font-bold text-black mb-6 font-poppins">
                  Similar Songs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similarSongs.map((similarSong) => (
                    <Link key={similarSong.id} href={`/song/${similarSong.id}`}>
                      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Music className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-black text-sm truncate">
                                {similarSong.title}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {similarSong.artist}
                              </p>
                              {similarSong.album && (
                                <p className="text-xs text-gray-500 truncate">
                                  {similarSong.album}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Secondary Info */}
          <div className="lg:col-span-1 order-2">
            {/* Song Details Card */}
            <Card className="border-gray-200 mb-6">
              <CardContent className="p-6">
                <Image
                  src={song.cover || "/placeholder.svg"}
                  alt={`${song.title} cover`}
                  width={200}
                  height={200}
                  className=" sm:w-full aspect-square  rounded-lg object-cover mb-4"
                />
                <div className="space-y-2 text-sm">
                  {song.album && (
                    <p>
                      <span className="font-medium">Album:</span> {song.album}
                    </p>
                  )}
                  {song.genre && (
                    <p>
                      <span className="font-medium">Genre:</span> {song.genre}
                    </p>
                  )}
                  {song.year && (
                    <p>
                      <span className="font-medium">Year:</span> {song.year}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Similar Songs - Desktop sidebar */}
            {similarSongs.length > 0 && (
              <Card className="border-gray-200 hidden lg:block">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-black mb-4 font-poppins">
                    Similar Songs
                  </h3>
                  <div className="space-y-3">
                    {similarSongs.map((similarSong) => (
                      <Link
                        key={similarSong.id}
                        href={`/song/${similarSong.id}`}
                      >
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Music className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-black text-sm truncate">
                              {similarSong.title}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {similarSong.artist}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href={`/artist/${encodeURIComponent(song.artist)}`}>
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-gray-300 bg-transparent"
                    >
                      View All by {song.artist}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
