"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";
import { createSongSubmission } from "@/lib/database";
import { uploadImageToSupabase } from "@/lib/image-upload";
import {
  songSubmissionSchema,
  type SongSubmissionData,
} from "@/lib/validation";
import Link from "next/link";

export default function SubmitPage() {
  const [formData, setFormData] = useState<SongSubmissionData>({
    title: "",
    artist: "",
    album: "",
    genre: "",
    year: undefined,
    cover: "",
    lyrics: "",
    submitter_name: "",
    submitter_email: "",
    submission_type: "new",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const validateForm = () => {
    try {
      songSubmissionSchema.parse(formData);
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      let coverUrl = formData.cover;

      // Upload image if a file is selected
      if (imageFile) {
        const uploadResult = await uploadImageToSupabase(
          imageFile,
          "song-covers"
        );
        if (uploadResult.success && uploadResult.url) {
          coverUrl = uploadResult.url;
        } else {
          throw new Error(uploadResult.error || "Failed to upload image");
        }
      }

      // Submit the song with the uploaded image URL
      await createSongSubmission({
        ...formData,
        cover: coverUrl,
      });

      setSubmitStatus("success");

      // Reset form
      setFormData({
        title: "",
        artist: "",
        album: "",
        genre: "",
        year: undefined,
        cover: "",
        lyrics: "",
        submitter_name: "",
        submitter_email: "",
        submission_type: "new",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error submitting song:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (value: string | File | null) => {
    if (value instanceof File) {
      setImageFile(value);
      setFormData((prev) => ({ ...prev, cover: "" })); // Clear URL when file is selected
    } else if (typeof value === "string") {
      setFormData((prev) => ({ ...prev, cover: value }));
      setImageFile(null); // Clear file when URL is set
    } else {
      setImageFile(null);
      setFormData((prev) => ({ ...prev, cover: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4 font-poppins">
            Submit Song Lyrics
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Help us grow our collection by submitting new lyrics or correcting
            existing ones. All submissions are reviewed by the BareLyrics team
            before being added to the database.
          </p>
        </div>

        {/* Success Message */}
        {submitStatus === "success" && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center text-green-800">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  Thank you! Your submission has been received and is pending
                  review.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {submitStatus === "error" && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  There was an error submitting your song. Please try again.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Submission Form */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Song Information</span>
                <Badge variant="outline">
                  {formData.submission_type === "new"
                    ? "New Song"
                    : "Correction"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Submission Type */}
                <div>
                  <Label>Submission Type</Label>
                  <div className="flex space-x-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="submission_type"
                        value="new"
                        checked={formData.submission_type === "new"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            submission_type: e.target.value as
                              | "new"
                              | "correction",
                          }))
                        }
                        className="mr-2"
                      />
                      New Song
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="submission_type"
                        value="correction"
                        checked={formData.submission_type === "correction"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            submission_type: e.target.value as
                              | "new"
                              | "correction",
                          }))
                        }
                        className="mr-2"
                      />
                      Correction/Update
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left Column - Image Upload */}
                  <div className="lg:col-span-2">
                    <ImageUpload
                      value={imageFile || formData.cover || null}
                      onChange={handleImageChange}
                      label="Cover Image (Optional)"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Right Column - Form Fields */}
                  <div className="lg:col-span-3 space-y-4">
                    {/* Song Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Song Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className={errors.title ? "border-red-500" : ""}
                          placeholder="Enter song title"
                          disabled={isSubmitting}
                        />
                        {errors.title && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.title}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="artist">Artist *</Label>
                        <Input
                          id="artist"
                          value={formData.artist}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              artist: e.target.value,
                            }))
                          }
                          className={errors.artist ? "border-red-500" : ""}
                          placeholder="Enter artist name"
                          disabled={isSubmitting}
                        />
                        {errors.artist && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.artist}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="album">Album</Label>
                        <Input
                          id="album"
                          value={formData.album}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              album: e.target.value,
                            }))
                          }
                          placeholder="Album name (optional)"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="genre">Genre</Label>
                        <Input
                          id="genre"
                          value={formData.genre}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              genre: e.target.value,
                            }))
                          }
                          placeholder="Genre (optional)"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
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
                          placeholder="Release year"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Submitter Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="submitter_name">Your Name</Label>
                        <Input
                          id="submitter_name"
                          value={formData.submitter_name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              submitter_name: e.target.value,
                            }))
                          }
                          placeholder="Your name (optional)"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="submitter_email">Your Email</Label>
                        <Input
                          id="submitter_email"
                          type="email"
                          value={formData.submitter_email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              submitter_email: e.target.value,
                            }))
                          }
                          placeholder="your.email@example.com (optional)"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lyrics */}
                <div>
                  <Label htmlFor="lyrics">Lyrics *</Label>
                  <Textarea
                    id="lyrics"
                    value={formData.lyrics}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lyrics: e.target.value,
                      }))
                    }
                    className={`min-h-[300px] ${
                      errors.lyrics ? "border-red-500" : ""
                    }`}
                    placeholder="Enter the complete song lyrics here..."
                    disabled={isSubmitting}
                  />
                  {errors.lyrics && (
                    <p className="text-red-500 text-sm mt-1">{errors.lyrics}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Please ensure the lyrics are accurate and complete. Include
                    verse labels, chorus markers, etc.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black hover:bg-gray-800 px-8 py-3 text-lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit for Review"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Review Process</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• All submissions are manually reviewed by our team</li>
                <li>
                  • We check for accuracy, completeness, and appropriate content
                </li>
                <li>• Approved songs are added to our public database</li>
                <li>
                  • You'll be credited as the submitter (if you provide your
                  name)
                </li>
              </ul>

              <h3 className="font-semibold mb-2 mt-4">Image Upload</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Images are uploaded only after successful submission</li>
                <li>• You can change or remove images before submitting</li>
                <li>• Supported formats: PNG, JPG, GIF (max 5MB)</li>
                <li>• Images are stored securely in our database</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
