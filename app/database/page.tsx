import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Database, Upload, Search, Download } from "lucide-react"
import Link from "next/link"
import { getAllSongs } from "@/lib/database"

export default async function DatabasePage() {
  const allSongs = await getAllSongs()

  return (
    <div className="min-h-screen bg-white">
 

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 font-poppins">
            Database Management
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Manage the BareLyrics song database. View all songs, search through the collection, and upload new content.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-1 font-poppins">{allSongs.length}</h3>
              <p className="text-gray-600">Total Songs</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-1 font-poppins">
                {new Set(allSongs.map((song) => song.artist)).size}
              </h3>
              <p className="text-gray-600">Unique Artists</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-1 font-poppins">Active</h3>
              <p className="text-gray-600">Database Status</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-black font-poppins flex items-center">
                <Search className="w-6 h-6 mr-2" />
                Search Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Search through all songs in the database by title, artist, album, or genre. Get instant results with our
                fast search functionality.
              </p>
              <Link href="/search">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">Open Search</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-black font-poppins flex items-center">
                <Upload className="w-6 h-6 mr-2" />
                Upload New Song
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Add new songs to the database. Include all song details, lyrics, and metadata to expand our collection.
              </p>
              <Link href="/submit">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">Upload Song</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* All Songs Table */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl text-black font-poppins">All Songs in Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-black">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Artist</th>
                    <th className="text-left py-3 px-4 font-semibold text-black hidden md:table-cell">Album</th>
                    <th className="text-left py-3 px-4 font-semibold text-black hidden lg:table-cell">Genre</th>
                    <th className="text-left py-3 px-4 font-semibold text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allSongs.map((song) => (
                    <tr key={song.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">{song.id}</td>
                      <td className="py-3 px-4">
                        <Link href={`/song/${song.id}`} className="font-medium text-black hover:underline">
                          {song.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{song.artist}</td>
                      <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{song.album || "-"}</td>
                      <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">{song.genre || "-"}</td>
                      <td className="py-3 px-4">
                        <Link href={`/song/${song.id}`}>
                          <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {allSongs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No songs in database</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/browse">
            <Button variant="outline" className="border-gray-300 bg-transparent px-8 py-3">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </Link>
          <Link href="/upgrade">
            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">
              <Database className="w-4 h-4 mr-2" />
              Upgrade Database
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
