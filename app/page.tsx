import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Search, Plus, Database, Users, TrendingUp } from "lucide-react";
import { SearchDropdown } from "@/components/search-dropdown";
import { SongStatsDisplay } from "@/components/song-stat-display";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Discover Song Lyrics
              <span className="block text-gray-600">Like Never Before</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Search through thousands of song lyrics, discover new music, and
              contribute to our growing community database.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchDropdown />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-black hover:bg-gray-800">
                <Link href="/browse">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Songs
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/submit">
                  <Plus className="w-5 h-5 mr-2" />
                  Submit Lyrics
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Our Growing Database
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of music lovers who contribute to and enjoy our
              comprehensive lyrics database
            </p>
          </div>
          <SongStatsDisplay />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Why Choose BareLyrics?
            </h2>
            <p className="text-gray-600">
              Everything you need to discover and share song lyrics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-6 h-6 mr-2 text-blue-600" />
                  Comprehensive Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access thousands of song lyrics from various genres and
                  artists, all in one place.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 mr-2 text-green-600" />
                  Community Driven
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our community contributes and verifies lyrics to ensure
                  accuracy and completeness.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
                  Always Growing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  New songs and lyrics are added regularly, keeping our database
                  fresh and up-to-date.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Start discovering your favorite song lyrics or contribute to our
            community by submitting new ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/browse">Start Browsing</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              <Link href="/submit">Submit Lyrics</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <Music className="w-3 h-3 text-black" />
                </div>
                <span className="text-lg font-bold">BareLyrics</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your go-to destination for discovering and sharing song lyrics.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    href="/browse"
                    className="hover:text-white transition-colors"
                  >
                    Browse Songs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/database"
                    className="hover:text-white transition-colors"
                  >
                    Database
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="hover:text-white transition-colors"
                  >
                    Search
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    href="/submit"
                    className="hover:text-white transition-colors"
                  >
                    Submit Lyrics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 BareLyrics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
