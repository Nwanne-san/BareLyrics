"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Send, Info, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  songSubmissionSchema,
  type SongSubmissionData,
} from "@/lib/validation";

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
    original_song_id: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (
    field: keyof SongSubmissionData,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setSubmitMessage(result.message);
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
          original_song_id: undefined,
        });
      } else {
        setSubmitStatus("error");
        setSubmitMessage(result.message || "Failed to submit song");
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Link href="/submit" className="text-black font-medium">
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
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

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{submitMessage}</p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{submitMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-black font-poppins">
                  Song Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Submission Type */}
                  <div>
                    <Label className="text-black font-medium">
                      Submission Type *
                    </Label>
                    <div className="mt-2 space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="new"
                          checked={formData.submission_type === "new"}
                          onChange={(e) =>
                            handleInputChange(
                              "submission_type",
                              e.target.value as "new" | "correction"
                            )
                          }
                          className="mr-2"
                        />
                        New Song
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="correction"
                          checked={formData.submission_type === "correction"}
                          onChange={(e) =>
                            handleInputChange(
                              "submission_type",
                              e.target.value as "new" | "correction"
                            )
                          }
                          className="mr-2"
                        />
                        Correction to Existing Song
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="artist"
                        className="text-black font-medium"
                      >
                        Artist Name *
                      </Label>
                      <Input
                        id="artist"
                        type="text"
                        placeholder="e.g., Queen"
                        className={`mt-2 border-gray-300 focus:border-black ${
                          errors.artist ? "border-red-500" : ""
                        }`}
                        value={formData.artist}
                        onChange={(e) =>
                          handleInputChange("artist", e.target.value)
                        }
                      />
                      {errors.artist && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.artist}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="title" className="text-black font-medium">
                        Song Title *
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="e.g., Bohemian Rhapsody"
                        className={`mt-2 border-gray-300 focus:border-black ${
                          errors.title ? "border-red-500" : ""
                        }`}
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="album" className="text-black font-medium">
                        Album
                      </Label>
                      <Input
                        id="album"
                        type="text"
                        placeholder="e.g., A Night at the Opera"
                        className={`mt-2 border-gray-300 focus:border-black ${
                          errors.album ? "border-red-500" : ""
                        }`}
                        value={formData.album}
                        onChange={(e) =>
                          handleInputChange("album", e.target.value)
                        }
                      />
                      {errors.album && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.album}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="genre" className="text-black font-medium">
                        Genre
                      </Label>
                      <Input
                        id="genre"
                        type="text"
                        placeholder="e.g., Rock"
                        className={`mt-2 border-gray-300 focus:border-black ${
                          errors.genre ? "border-red-500" : ""
                        }`}
                        value={formData.genre}
                        onChange={(e) =>
                          handleInputChange("genre", e.target.value)
                        }
                      />
                      {errors.genre && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.genre}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year" className="text-black font-medium">
                        Year
                      </Label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="e.g., 1975"
                        className={`mt-2 border-gray-300 focus:border-black ${
                          errors.year ? "border-red-500" : ""
                        }`}
                        value={formData.year || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "year",
                            e.target.value
                              ? Number.parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                      {errors.year && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.year}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cover" className="text-black font-medium">
                        Album Cover URL
                      </Label>
                      <Input
                        id="cover"
                        type="url"
                        placeholder="https://example.com/cover.jpg"
                        className={`mt-2 border-gray-300 focus:border-black ${
                          errors.cover ? "border-red-500" : ""
                        }`}
                        value={formData.cover}
                        onChange={(e) =>
                          handleInputChange("cover", e.target.value)
                        }
                      />
                      {errors.cover && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cover}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lyrics" className="text-black font-medium">
                      Lyrics *
                    </Label>
                    <Textarea
                      id="lyrics"
                      placeholder="Enter the complete song lyrics here..."
                      className={`mt-2 min-h-[300px] border-gray-300 focus:border-black resize-none ${
                        errors.lyrics ? "border-red-500" : ""
                      }`}
                      value={formData.lyrics}
                      onChange={(e) =>
                        handleInputChange("lyrics", e.target.value)
                      }
                    />
                    {errors.lyrics && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lyrics}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="submitter_name"
                        className="text-black font-medium"
                      >
                        Your Name (Optional)
                      </Label>
                      <Input
                        id="submitter_name"
                        type="text"
                        placeholder="Your name for attribution"
                        className={`mt-2 border-gray-300 focus:border-black ${
                          errors.submitter_name ? "border-red-500" : ""
                        }`}
                        value={formData.submitter_name}
                        onChange={(e) =>
                          handleInputChange("submitter_name", e.target.value)
                        }
                      />
                      {errors.submitter_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.submitter_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="submitter_email"
                        className="text-black font-medium"
                      >
                        Your Email (Optional)
                      </Label>
                      <Input
                        id="submitter_email"
                        type="email"
                        placeholder="your.email@example.com"
                        className={`mt-2 border-gray-300 focus:border-black ${
                          errors.submitter_email ? "border-red-500" : ""
                        }`}
                        value={formData.submitter_email}
                        onChange={(e) =>
                          handleInputChange("submitter_email", e.target.value)
                        }
                      />
                      {errors.submitter_email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.submitter_email}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        We'll only use this to contact you about your submission
                        if needed.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white py-3"
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting
                      ? "Submitting for Review..."
                      : "Submit for Review"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Guidelines */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-black flex items-center font-poppins">
                  <Info className="w-5 h-5 mr-2" />
                  Submission Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-black mb-2 font-poppins">
                    Review Process
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• All submissions go through admin review</li>
                    <li>• Typical review time: 1-3 business days</li>
                    <li>• You'll be notified if we need clarification</li>
                    <li>• Approved songs are added to the main database</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-black mb-2 font-poppins">
                    Quality Standards
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Ensure lyrics are accurate and complete</li>
                    <li>• Include proper formatting and line breaks</li>
                    <li>• Use correct spelling and punctuation</li>
                    <li>• Verify song information is correct</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-black mb-2 font-poppins">
                    What We Accept
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• New song lyrics not in our database</li>
                    <li>• Corrections to existing lyrics</li>
                    <li>• Missing information for existing songs</li>
                    <li>• Updated or alternative versions</li>
                  </ul>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-800">
                    <strong>Important:</strong> Submissions are now reviewed
                    before being added to prevent conflicts. This ensures
                    quality and accuracy in our database.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    <strong>Note:</strong> By submitting lyrics, you confirm
                    that you have the right to share this content and that it
                    doesn't violate any copyright laws.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 mt-6">
              <CardContent className="p-6 text-center">
                <h3 className="font-medium text-black mb-2 font-poppins">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about submitting lyrics or found an issue?
                </p>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="border-gray-300 bg-transparent"
                  >
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
