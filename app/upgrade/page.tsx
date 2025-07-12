import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Music,
  Database,
  Zap,
  Shield,
  Globe,
  Users,
  ArrowRight,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function UpgradePage() {
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Database Upgrade Plan
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            We're planning to enhance BareLyrics with a powerful cloud database
            system to serve you better. Here's what's coming and how it will
            improve your experience.
          </p>
        </div>

        {/* Current vs Future */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-black flex items-center">
                <Music className="w-6 h-6 mr-2" />
                Current System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <p className="text-gray-600">
                  Local data storage within the application
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <p className="text-gray-600">Limited song collection</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <p className="text-gray-600">Manual content updates</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <p className="text-gray-600">Basic search functionality</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black border-2">
            <CardHeader>
              <CardTitle className="text-xl text-black flex items-center">
                <Database className="w-6 h-6 mr-2" />
                Future System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-gray-800">
                  Cloud-based database with real-time sync
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-gray-800">
                  Massive song library (100,000+ songs)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-gray-800">
                  Instant content updates and additions
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-gray-800">
                  Advanced search with filters and suggestions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            What's Coming
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  Lightning Fast Search
                </h3>
                <p className="text-gray-600">
                  Instant search results with autocomplete, typo tolerance, and
                  smart suggestions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  Global Content
                </h3>
                <p className="text-gray-600">
                  Access to international music from every genre, language, and
                  era.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  User Accounts
                </h3>
                <p className="text-gray-600">
                  Save favorites, create playlists, and track your lyric reading
                  history.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  Quality Assurance
                </h3>
                <p className="text-gray-600">
                  AI-powered lyric verification and community moderation for
                  accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  Real-time Updates
                </h3>
                <p className="text-gray-600">
                  New releases added automatically, corrections applied
                  instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                  Enhanced Experience
                </h3>
                <p className="text-gray-600">
                  Better recommendations, related songs, and personalized
                  content discovery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            Development Timeline
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-black rounded-full"></div>
                <div className="flex-1">
                  <h3 className="font-bold text-black">
                    Phase 1: Database Architecture
                  </h3>
                  <p className="text-gray-600">
                    Design and implement the cloud database infrastructure
                  </p>
                  <p className="text-sm text-gray-500">Timeline: 2-3 months</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="font-bold text-black">
                    Phase 2: Data Migration
                  </h3>
                  <p className="text-gray-600">
                    Transfer existing content and expand the song library
                  </p>
                  <p className="text-sm text-gray-500">Timeline: 1-2 months</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="font-bold text-black">
                    Phase 3: Feature Enhancement
                  </h3>
                  <p className="text-gray-600">
                    Add advanced search, user accounts, and personalization
                  </p>
                  <p className="text-sm text-gray-500">Timeline: 2-3 months</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="font-bold text-black">Phase 4: Launch</h3>
                  <p className="text-gray-600">
                    Full deployment with all new features and improvements
                  </p>
                  <p className="text-sm text-gray-500">Timeline: 1 month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-black mb-4">Stay Updated</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Want to be the first to know when we launch the new database system?
            Contact us to join our update list.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                Get Notified
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                variant="outline"
                className="border-gray-300 px-8 py-3 bg-transparent"
              >
                Explore Current Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
