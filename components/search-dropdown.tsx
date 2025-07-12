"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Music } from "lucide-react"
import { searchSongs, type Song } from "@/lib/database"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SearchDropdownProps {
  placeholder?: string
  className?: string
}

export function SearchDropdown({ placeholder = "Search for songs, artists...", className = "" }: SearchDropdownProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Song[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchDebounced = async () => {
      if (query.trim().length > 0) {
        setIsLoading(true)
        try {
          const searchResults = await searchSongs(query)
          setResults(searchResults.slice(0, 5)) // Limit to 5 results
          setIsOpen(true)
        } catch (error) {
          console.error("Search error:", error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setIsOpen(false)
      }
    }

    const timeoutId = setTimeout(searchDebounced, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-12 pr-20 py-4 text-lg border-2 border-gray-200 focus:border-black rounded-full"
        />
        <Button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800 rounded-full px-6"
        >
          Search
        </Button>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((song) => (
                <Link
                  key={song.id}
                  href={`/song/${song.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Music className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-black truncate">
                      {song.title} - {song.artist}
                    </p>
                    {song.album && <p className="text-sm text-gray-500 truncate">{song.album}</p>}
                  </div>
                </Link>
              ))}
              {results.length === 5 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <button onClick={handleSearch} className="text-sm text-black hover:underline">
                    View all results for "{query}"
                  </button>
                </div>
              )}
            </div>
          ) : query.trim().length > 0 ? (
            <div className="p-4 text-center text-gray-500">No songs found for "{query}"</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
