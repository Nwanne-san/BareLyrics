"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageCircle,
  Send,
  Star,
  Quote,
  ThumbsUp,
  Flag,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getSongComments,
  createSongComment,
  type SongComment,
} from "@/lib/database";

interface CommentsSectionProps {
  songId: number;
  selectedLyrics?: string;
  onClearSelection?: () => void;
  isMobile?: boolean;
}

export function CommentsSection({
  songId,
  selectedLyrics,
  onClearSelection,
  isMobile = false,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<SongComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const [newComment, setNewComment] = useState({
    user_name: "",
    user_email: "",
    comment_text: "",
    comment_type: "general" as "general" | "annotation" | "review",
    rating: 0,
  });

  useEffect(() => {
    loadComments();
  }, [songId]);

  useEffect(() => {
    if (selectedLyrics) {
      setShowCommentForm(true);
      setIsExpanded(true);
      setNewComment((prev) => ({
        ...prev,
        comment_type: "annotation",
      }));
    }
  }, [selectedLyrics]);

  const loadComments = async () => {
    try {
      console.log("Loading comments for song ID:", songId);
      const commentsData = await getSongComments(songId);
      console.log("Loaded comments:", commentsData);
      setComments(commentsData);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.comment_text.trim()) return;

    setIsSubmitting(true);
    try {
      console.log("Submitting comment:", {
        song_id: songId,
        user_name: newComment.user_name || "Anonymous",
        user_email: newComment.user_email,
        comment_text: newComment.comment_text,
        selected_lyrics: selectedLyrics || null,
        comment_type: newComment.comment_type,
        rating: newComment.comment_type === "review" ? newComment.rating : null,
      });

      await createSongComment({
        song_id: songId,
        user_name: newComment.user_name || "Anonymous",
        user_email: newComment.user_email,
        comment_text: newComment.comment_text,
        selected_lyrics: selectedLyrics || null,
        comment_type: newComment.comment_type,
        rating: newComment.comment_type === "review" ? newComment.rating : null,
      });

      // Reset form
      setNewComment({
        user_name: "",
        user_email: "",
        comment_text: "",
        comment_type: "general",
        rating: 0,
      });
      setShowCommentForm(false);
      if (onClearSelection) onClearSelection();

      // Reload comments
      await loadComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCommentTypeIcon = (type: string) => {
    switch (type) {
      case "annotation":
        return <Quote className="w-4 h-4" />;
      case "review":
        return <Star className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getCommentTypeColor = (type: string) => {
    switch (type) {
      case "annotation":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isMobile) {
    return (
      <Card className="border-gray-200">
        <CardHeader
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Comments & Reviews ({comments.length})
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </CardTitle>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0">
                {/* Quick Add Comment Button */}
                <div className="mb-4">
                  <Button
                    onClick={() => setShowCommentForm(!showCommentForm)}
                    className="w-full bg-black hover:bg-gray-800"
                    size="sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {showCommentForm ? "Cancel" : "Add Comment"}
                  </Button>
                </div>

                {/* Selected Lyrics Alert */}
                {selectedLyrics && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-blue-800 mb-1">
                          Selected Lyrics:
                        </p>
                        <p className="text-xs text-blue-700 italic line-clamp-2">
                          "{selectedLyrics}"
                        </p>
                      </div>
                      <Button
                        onClick={onClearSelection}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        ✕
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Comment Form */}
                <AnimatePresence>
                  {showCommentForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6"
                    >
                      <form
                        onSubmit={handleSubmitComment}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-1 gap-3">
                          <Input
                            value={newComment.user_name}
                            onChange={(e) =>
                              setNewComment((prev) => ({
                                ...prev,
                                user_name: e.target.value,
                              }))
                            }
                            placeholder="Your name (optional)"
                            className="text-sm"
                          />
                          <Input
                            type="email"
                            value={newComment.user_email}
                            onChange={(e) =>
                              setNewComment((prev) => ({
                                ...prev,
                                user_email: e.target.value,
                              }))
                            }
                            placeholder="your@email.com (optional)"
                            className="text-sm"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <label className="flex items-center text-xs">
                            <input
                              type="radio"
                              name="comment_type"
                              value="general"
                              checked={newComment.comment_type === "general"}
                              onChange={(e) =>
                                setNewComment((prev) => ({
                                  ...prev,
                                  comment_type: e.target.value as any,
                                }))
                              }
                              className="mr-1"
                            />
                            General
                          </label>
                          <label className="flex items-center text-xs">
                            <input
                              type="radio"
                              name="comment_type"
                              value="annotation"
                              checked={newComment.comment_type === "annotation"}
                              onChange={(e) =>
                                setNewComment((prev) => ({
                                  ...prev,
                                  comment_type: e.target.value as any,
                                }))
                              }
                              className="mr-1"
                            />
                            Annotation
                          </label>
                          <label className="flex items-center text-xs">
                            <input
                              type="radio"
                              name="comment_type"
                              value="review"
                              checked={newComment.comment_type === "review"}
                              onChange={(e) =>
                                setNewComment((prev) => ({
                                  ...prev,
                                  comment_type: e.target.value as any,
                                }))
                              }
                              className="mr-1"
                            />
                            Review
                          </label>
                        </div>

                        {newComment.comment_type === "review" && (
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-600">
                              Rating:
                            </span>
                            {Array.from({ length: 5 }, (_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() =>
                                  setNewComment((prev) => ({
                                    ...prev,
                                    rating: i + 1,
                                  }))
                                }
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    i < newComment.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300 hover:text-yellow-400"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        )}

                        <Textarea
                          value={newComment.comment_text}
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              comment_text: e.target.value,
                            }))
                          }
                          placeholder="Share your thoughts about this song..."
                          rows={3}
                          required
                          className="text-sm"
                        />

                        <div className="flex space-x-2">
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            size="sm"
                            className="flex-1"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            {isSubmitting ? "Submitting..." : "Submit"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowCommentForm(false);
                              if (onClearSelection) onClearSelection();
                            }}
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Comments List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="text-gray-500 mt-2 text-sm">
                        Loading comments...
                      </p>
                    </div>
                  ) : comments.length > 0 ? (
                    <AnimatePresence>
                      {comments.slice(0, 5).map((comment, index) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border border-gray-100 rounded-lg p-3"
                        >
                          <div className="flex items-start space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                <User className="w-3 h-3" />
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1 mb-1">
                                <span className="font-medium text-xs">
                                  {comment.user_name || "Anonymous"}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs px-1 py-0 ${getCommentTypeColor(
                                    comment.comment_type
                                  )}`}
                                >
                                  {getCommentTypeIcon(comment.comment_type)}
                                </Badge>
                                {comment.rating && (
                                  <div className="flex items-center">
                                    {renderStars(comment.rating)}
                                  </div>
                                )}
                              </div>

                              {comment.selected_lyrics && (
                                <div className="bg-gray-50 border-l-2 border-blue-500 pl-2 py-1 mb-2">
                                  <p className="text-xs italic text-gray-700 line-clamp-2">
                                    "{comment.selected_lyrics}"
                                  </p>
                                </div>
                              )}

                              <p className="text-gray-800 text-xs leading-relaxed line-clamp-3">
                                {comment.comment_text}
                              </p>

                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    comment.created_at
                                  ).toLocaleDateString()}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs p-1 h-auto"
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {comments.length > 5 && (
                        <div className="text-center py-2">
                          <Button variant="ghost" size="sm" className="text-xs">
                            View all {comments.length} comments
                          </Button>
                        </div>
                      )}
                    </AnimatePresence>
                  ) : (
                    <div className="text-center py-6">
                      <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">
                        No comments yet. Be the first!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  }

  // Desktop version (existing code)
  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Comments & Reviews ({comments.length})
        </h3>
        <Button
          onClick={() => setShowCommentForm(!showCommentForm)}
          variant="outline"
          size="sm"
        >
          <Send className="w-4 h-4 mr-2" />
          Add Comment
        </Button>
      </div>

      {/* Selected Lyrics Alert */}
      {selectedLyrics && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">
                Selected Lyrics:
              </p>
              <p className="text-sm text-blue-700 italic">"{selectedLyrics}"</p>
            </div>
            <Button
              onClick={onClearSelection}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800"
            >
              Clear
            </Button>
          </div>
        </motion.div>
      )}

      {/* Comment Form */}
      <AnimatePresence>
        {showCommentForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedLyrics
                    ? "Comment on Selected Lyrics"
                    : "Add a Comment"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="user_name">Name (Optional)</Label>
                      <Input
                        id="user_name"
                        value={newComment.user_name}
                        onChange={(e) =>
                          setNewComment((prev) => ({
                            ...prev,
                            user_name: e.target.value,
                          }))
                        }
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user_email">Email (Optional)</Label>
                      <Input
                        id="user_email"
                        type="email"
                        value={newComment.user_email}
                        onChange={(e) =>
                          setNewComment((prev) => ({
                            ...prev,
                            user_email: e.target.value,
                          }))
                        }
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Comment Type</Label>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="comment_type"
                          value="general"
                          checked={newComment.comment_type === "general"}
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              comment_type: e.target.value as any,
                            }))
                          }
                          className="mr-2"
                        />
                        General Comment
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="comment_type"
                          value="annotation"
                          checked={newComment.comment_type === "annotation"}
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              comment_type: e.target.value as any,
                            }))
                          }
                          className="mr-2"
                        />
                        Lyric Annotation
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="comment_type"
                          value="review"
                          checked={newComment.comment_type === "review"}
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              comment_type: e.target.value as any,
                            }))
                          }
                          className="mr-2"
                        />
                        Review
                      </label>
                    </div>
                  </div>

                  {newComment.comment_type === "review" && (
                    <div>
                      <Label>Rating</Label>
                      <div className="flex space-x-1 mt-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              setNewComment((prev) => ({
                                ...prev,
                                rating: i + 1,
                              }))
                            }
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                i < newComment.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 hover:text-yellow-400"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="comment_text">Comment *</Label>
                    <Textarea
                      id="comment_text"
                      value={newComment.comment_text}
                      onChange={(e) =>
                        setNewComment((prev) => ({
                          ...prev,
                          comment_text: e.target.value,
                        }))
                      }
                      placeholder="Share your thoughts about this song..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" disabled={isSubmitting}>
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Submitting..." : "Submit Comment"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCommentForm(false);
                        if (onClearSelection) onClearSelection();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-sm">
                            {comment.user_name || "Anonymous"}
                          </span>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getCommentTypeColor(
                              comment.comment_type
                            )}`}
                          >
                            {getCommentTypeIcon(comment.comment_type)}
                            <span className="ml-1 capitalize">
                              {comment.comment_type}
                            </span>
                          </Badge>
                          {comment.rating && (
                            <div className="flex items-center space-x-1">
                              {renderStars(comment.rating)}
                            </div>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {comment.selected_lyrics && (
                          <div className="bg-gray-50 border-l-4 border-blue-500 pl-3 py-2 mb-3">
                            <p className="text-sm italic text-gray-700">
                              "{comment.selected_lyrics}"
                            </p>
                          </div>
                        )}

                        <p className="text-gray-800 text-sm leading-relaxed">
                          {comment.comment_text}
                        </p>

                        <div className="flex items-center space-x-4 mt-3">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Helpful
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Flag className="w-3 h-3 mr-1" />
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
