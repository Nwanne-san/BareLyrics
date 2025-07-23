"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Save, X } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { updateSong, type Song } from "@/lib/database";
import { adminSongSchema, type AdminSongData } from "@/lib/validation";

interface EditSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  song: Song | null;
}

export function EditSongModal({
  isOpen,
  onClose,
  onSave,
  song,
}: EditSongModalProps) {
  const [formData, setFormData] = useState<AdminSongData>({
    title: "",
    artist: "",
    album: "",
    genre: "",
    year: undefined,
    cover: "",
    lyrics: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title,
        artist: song.artist,
        album: song.album || "",
        genre: song.genre || "",
        year: song.year || undefined,
        cover: song.cover || "",
        lyrics: song.lyrics,
      });
      setErrors({}); // Clear any previous errors
    }
  }, [song]);

  const validateForm = () => {
    try {
      adminSongSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
      }
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!song || !validateForm()) return;

    setIsSubmitting(true);
    try {
      // Prepare update data, filtering out empty strings for optional fields
      const updateData: Partial<Song> = {
        title: formData.title,
        artist: formData.artist,
        album: formData.album || null,
        genre: formData.genre || null,
        year: formData.year || null,
        cover: formData.cover || null,
        lyrics: formData.lyrics,
      };

      await updateSong(song.id, updateData);
      onSave(); // This will refresh the data in the parent component
      alert("Song updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating song:", error);
      alert("Failed to update song. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({});
      onClose();
    }
  };

  if (!isOpen || !song) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Edit Song
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Image Upload */}
              <div className="lg:col-span-1">
                <ImageUpload
                  value={formData.cover}
                  onChange={(url) =>
                    setFormData((prev) => ({
                      ...prev,
                      cover: typeof url === "string" ? url : "",
                    }))
                  }
                  label="Cover Image"
                />
              </div>

              {/* Right Column - Form Fields */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-title">Song Title *</Label>
                    <Input
                      id="edit-title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className={errors.title ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="edit-artist">Artist *</Label>
                    <Input
                      id="edit-artist"
                      value={formData.artist}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          artist: e.target.value,
                        }))
                      }
                      className={errors.artist ? "border-red-500" : ""}
                      disabled={isSubmitting}
                    />
                    {errors.artist && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.artist}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-album">Album</Label>
                    <Input
                      id="edit-album"
                      value={formData.album}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          album: e.target.value,
                        }))
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-genre">Genre</Label>
                    <Input
                      id="edit-genre"
                      value={formData.genre}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          genre: e.target.value,
                        }))
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-year">Year</Label>
                    <Input
                      id="edit-year"
                      type="number"
                      value={formData.year || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          year: e.target.value
                            ? Number.parseInt(e.target.value)
                            : undefined,
                        }))
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-lyrics">Lyrics *</Label>
                  <Textarea
                    id="edit-lyrics"
                    value={formData.lyrics}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lyrics: e.target.value,
                      }))
                    }
                    className={`min-h-[200px] ${
                      errors.lyrics ? "border-red-500" : ""
                    }`}
                    placeholder="Enter the complete song lyrics..."
                    disabled={isSubmitting}
                  />
                  {errors.lyrics && (
                    <p className="text-red-500 text-sm mt-1">{errors.lyrics}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-black hover:bg-gray-800"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
