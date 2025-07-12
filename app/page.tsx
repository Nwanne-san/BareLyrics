import { Button } from "@/components/ui/button";
import { Music, Users, Heart } from "lucide-react";
import Link from "next/link";
import { SearchDropdown } from "@/components/search-dropdown";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-">
            <Image src="/logo.png" alt="" width={200} height={80}  className="h-16 w-24"/>
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 animate-fade-in font-poppins">
            Find Your Favorite
            <span className="block text-gray-600">Song Lyrics</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover, explore, and sing along to millions of song lyrics from
            your favorite artists. Clean, simple, and always up-to-date.
          </p>

          {/* Search Bar */}
          <SearchDropdown className="max-w-2xl mx-auto mb-12" />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2 font-poppins">
                10,000+
              </h3>
              <p className="text-gray-600">Songs Available</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2 font-poppins">
                500+
              </h3>
              <p className="text-gray-600">Artists Featured</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2 font-poppins">
                100%
              </h3>
              <p className="text-gray-600">Free to Use</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-bold text-black mb-8 font-poppins">
            What is BareLyrics?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            BareLyrics is your go-to destination for finding accurate song
            lyrics from all your favorite artists. We believe in keeping things
            simple - no clutter, no distractions, just pure lyrics presented in
            a clean and readable format. Whether you're looking to sing along,
            learn new songs, or just satisfy your curiosity about those
            hard-to-understand lyrics, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                Browse All Songs
              </Button>
            </Link>
            <Link href="/submit">
              <Button
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white px-8 py-3 bg-transparent"
              >
                Submit Lyrics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Music className="w-4 h-4 text-black" />
                </div>
                <span className="text-2xl font-bold">BareLyrics</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Your trusted source for accurate song lyrics. Simple, clean, and
                always free.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 font-poppins">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
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
              <h3 className="font-semibold mb-4 font-poppins">About</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/team"
                    className="hover:text-white transition-colors"
                  >
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="/upgrade"
                    className="hover:text-white transition-colors"
                  >
                    Database Upgrade
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} BareLyrics Team. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
