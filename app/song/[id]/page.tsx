"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, ChevronRight, Share2, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSongById, getSimilarSongs, type Song } from "@/lib/database";
import { ShareModal } from "@/components/share-modal";
import { CommentsSection } from "@/components/comments-section";
import { motion } from "framer-motion";

export default function SongPage({ params }: { params: { id: string } }) {
  const [song, setSong] = useState<Song | null>(null);
  const [similarSongs, setSimilarSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLyrics, setSelectedLyrics] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMobileComments, setShowMobileComments] = useState(false);

  const songId = Number.parseInt(params.id);
  const songUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    loadSongData();
  }, [songId]);

  const loadSongData = async () => {
    try {
      const songData = await getSongById(songId);
      if (songData) {
        setSong(songData);
        const similar = await getSimilarSongs(
          songData.id,
          songData.artist,
          songData.genre || undefined
        );
        setSimilarSongs(similar);
      }
    } catch (error) {
      console.error("Error loading song data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedLyrics(selection.toString().trim());
    }
  };

  const clearSelection = () => {
    setSelectedLyrics("");
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 pt-4">
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
        <div className="sm:grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 h-[calc(100vh-200px)]">
          {/* Main Content - Lyrics Priority */}
          <div className="lg:col-span-3 sm:order-1 overflow-y-auto scrollbar-hide">
            {/* Song Header with Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between"
            >
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black mb-2 font-poppins">
                  {song.title}
                </h1>
                <Link href={`/artist/${encodeURIComponent(song.artist)}`}>
                  <p className="text-xl md:text-2xl text-gray-600 mb-4 hover:text-black transition-colors cursor-pointer">
                    {song.artist}
                  </p>
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex  items-center space-x-2 ml-4">
                <Button
                  onClick={() => setShowShareModal(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={() => setShowMobileComments(!showMobileComments)}
                  variant="outline"
                  size="sm"
                  className="flex items-center lg:hidden"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comments
                </Button>
              </div>
            </motion.div>

            {/* Selection Alert */}
            {selectedLyrics && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      Selected: "{selectedLyrics}"
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setShowShareModal(true)}
                        size="sm"
                        variant="outline"
                        className="text-blue-700 border-blue-300"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share Selection
                      </Button>
                      <Button
                        onClick={() => setShowMobileComments(true)}
                        size="sm"
                        variant="outline"
                        className="text-blue-700 border-blue-300 lg:hidden"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Comment
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={clearSelection}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Lyrics - Main Priority */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-gray-200">
                <CardContent className="p-4 md:p-8">
                  <div className="prose prose-lg max-w-none">
                    <pre
                      className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-sm md:text-lg cursor-text select-text"
                      onMouseUp={handleTextSelection}
                      onTouchEnd={handleTextSelection}
                    >
                      {song.lyrics}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 lg:hidden"
              >
                <CommentsSection
                  songId={song.id}
                  selectedLyrics={selectedLyrics}
                  onClearSelection={clearSelection}
                  isMobile={false}
                />
              </motion.div>

            {/* Correction Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg"
            >
              <p className="text-sm text-gray-600 text-center">
                Found an error in these lyrics?{" "}
                <Link
                  href="/submit"
                  className="text-black font-medium hover:underline"
                >
                  Submit a correction
                </Link>
              </p>
            </motion.div>

            {/* Mobile Comments Section */}
            {/* {showMobileComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 lg:hidden"
              >
                <CommentsSection
                  songId={song.id}
                  selectedLyrics={selectedLyrics}
                  onClearSelection={clearSelection}
                  isMobile={false}
                />
              </motion.div>
            )} */}

            {/* Similar Songs Section - Below lyrics on mobile */}
            {similarSongs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 lg:hidden"
              >
                <h3 className="text-2xl font-bold text-black mb-6 font-poppins">
                  Similar Songs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similarSongs.map((similarSong, index) => (
                    <motion.div
                      key={similarSong.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link href={`/song/${similarSong.id}`}>
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
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Fixed Sidebar - Secondary Info */}
          <div className="lg:col-span-2 order-1 sm:order-2 sm:overflow-y-auto h-full scrollbar-hide">
            <div className="sm:sticky sm:top-0 space-y-6">
              {/* Song Details Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4 ">
                      <div className="flex-1 min-w-0 text-base">
                        <p className="font-semibold text-xl text-black text- truncate">
                          {song.title} -
                          <span className="ml-1 text-gray-600 text-base truncate">
                            {song.artist}
                          </span>
                        </p>

                        {song.album && (
                          <p className="text-xs text-gray-500 truncate">
                            {song.album}
                          </p>
                        )}
                        {song.album && (
                          <p>
                            <span className="font-medium">Album:</span>{" "}
                            {song.album}
                          </p>
                        )}
                        {song.genre && (
                          <p>
                            <span className="font-medium">Genre:</span>{" "}
                            {song.genre}
                          </p>
                        )}
                        {song.year && (
                          <p>
                            <span className="font-medium">Year:</span>{" "}
                            {song.year}
                          </p>
                        )}
                      </div>
                      <Image
                        src={song.cover || "/placeholder.svg"}
                        alt={`${song.title} cover`}
                        width={80}
                        height={80}
                        className="w-ful aspect-square rounded-lg object-cover "
                      />
                    </div>
                    <div className="space-y-2 text-sm"></div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Comments Section - Desktop */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block"
              >
                <CommentsSection
                  songId={song.id}
                  selectedLyrics={selectedLyrics}
                  onClearSelection={clearSelection}
                  isMobile={false}
                />
              </motion.div>

              {/* Similar Songs - Desktop sidebar */}
              {similarSongs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="hidden lg:block"
                >
                  <Card className="border-gray-200">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-black mb-4 font-poppins">
                        Similar Songs
                      </h3>
                      <div className="space-y-3">
                        {similarSongs.map((similarSong, index) => (
                          <motion.div
                            key={similarSong.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            <Link href={`/song/${similarSong.id}`}>
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
                          </motion.div>
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
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        song={song}
        selectedLyrics={selectedLyrics}
        songUrl={songUrl}
      />
    </div>
  );
}
