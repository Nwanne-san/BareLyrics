"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Plus,
  Users,
  FileText,
  LogOut,
  Check,
  X,
  Eye,
  Edit,
  Trash2,
  Send,
  Settings,
  UserPlus,
  Shield,
} from "lucide-react";
import {
  removeAdminToken,
  hasRequiredRole,
  type AdminUser,
  getAllAdminUsers,
  createAdminUser,
} from "@/lib/admin-auth";
import {
  getAllSongs,
  getAllSubmissions,
  createSongDirect,
  approveSubmission,
  updateSubmissionStatus,
  deleteSong,
  type Song,
  type SongSubmission,
} from "@/lib/database";
import { adminSongSchema, type AdminSongData } from "@/lib/validation";
import { ImageUpload } from "@/components/image-upload";
import { uploadImageToSupabase } from "@/lib/image-upload";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { EditSongModal } from "@/components/edit-song-modal";
import { AdminSetupBanner } from "@/components/admin-setup-banner";

interface AdminDashboardProps {
  currentUser: AdminUser | null;
}

export function AdminDashboard({ currentUser }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [songs, setSongs] = useState<Song[]>([]);
  const [submissions, setSubmissions] = useState<SongSubmission[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SongSubmission | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    song: Song | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    song: null,
    isDeleting: false,
  });

  // Edit modal state
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    song: Song | null;
  }>({
    isOpen: false,
    song: null,
  });

  // Form states
  const [newSong, setNewSong] = useState<AdminSongData>({
    title: "",
    artist: "",
    album: "",
    genre: "",
    year: undefined,
    cover: "",
    lyrics: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    password: "",
    role: "moderator" as "admin" | "moderator",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [songsData, submissionsData] = await Promise.all([
        getAllSongs(),
        getAllSubmissions(),
      ]);
      setSongs(songsData);
      setSubmissions(submissionsData);

      // Load admin users if user has permission
      if (currentUser && hasRequiredRole(currentUser.role, "admin")) {
        try {
          const adminUsersData = await getAllAdminUsers();
          setAdminUsers(adminUsersData);
        } catch (error) {
          console.error("Error loading admin users:", error);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    removeAdminToken();
    window.location.reload();
  };

  const validateForm = () => {
    try {
      adminSongSchema.parse(newSong);
      setFormErrors({});
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
      setFormErrors(fieldErrors);
      return false;
    }
  };

  const handleCreateSong = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let coverUrl = newSong.cover;

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

      await createSongDirect({
        ...newSong,
        cover: coverUrl,
      });

      setNewSong({
        title: "",
        artist: "",
        album: "",
        genre: "",
        year: undefined,
        cover: "",
        lyrics: "",
      });
      setImageFile(null);
      await loadData();
      alert("Song created successfully!");
    } catch (error) {
      console.error("Error creating song:", error);
      alert("Failed to create song");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !hasRequiredRole(currentUser.role, "admin")) {
      alert("You don't have permission to create users");
      return;
    }

    setIsSubmitting(true);
    try {
      await createAdminUser(newUser);
      setNewUser({
        email: "",
        name: "",
        password: "",
        role: "moderator",
      });
      setShowCreateUser(false);
      await loadData();
      alert("Admin user created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveSubmission = async (submission: SongSubmission) => {
    try {
      await approveSubmission(submission);
      await loadData();
      setSelectedSubmission(null);
      alert("Submission approved and song added!");
    } catch (error) {
      console.error("Error approving submission:", error);
      alert("Failed to approve submission");
    }
  };

  const handleRejectSubmission = async (
    submission: SongSubmission,
    reason: string
  ) => {
    try {
      await updateSubmissionStatus(
        submission.id,
        "rejected",
        reason,
        currentUser?.name || "Admin"
      );
      await loadData();
      setSelectedSubmission(null);
      alert("Submission rejected");
    } catch (error) {
      console.error("Error rejecting submission:", error);
      alert("Failed to reject submission");
    }
  };

  const handleDeleteSong = async () => {
    if (!deleteModal.song) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await deleteSong(deleteModal.song.id);
      await loadData(); // This will refresh the songs list
      setDeleteModal({ isOpen: false, song: null, isDeleting: false });
    } catch (error) {
      console.error("Error deleting song:", error);
      alert("Failed to delete song");
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleEditSong = (song: Song) => {
    setEditModal({ isOpen: true, song });
  };

  const handleEditSave = async () => {
    await loadData(); // This will refresh the songs list
    setEditModal({ isOpen: false, song: null });
  };

  const handleImageChange = (value: string | File | null) => {
    if (value instanceof File) {
      setImageFile(value);
      setNewSong((prev) => ({ ...prev, cover: "" })); // Clear URL when file is selected
    } else if (typeof value === "string") {
      setNewSong((prev) => ({ ...prev, cover: value }));
      setImageFile(null); // Clear file when URL is set
    } else {
      setImageFile(null);
      setNewSong((prev) => ({ ...prev, cover: "" }));
    }
  };

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");
  const recentSubmissions = submissions.slice(0, 5);

  // Determine available tabs based on user role
  const availableTabs = ["dashboard", "add-song", "submissions", "manage"];
  if (currentUser && hasRequiredRole(currentUser.role, "admin")) {
    availableTabs.push("admin-users");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold text-black">
              BareLyrics Admin
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="text-right">
                <p className="text-sm font-medium text-black">
                  {currentUser.name}
                </p>
                <div className="flex items-center space-x-1">
                  <Badge
                    variant={
                      currentUser.role === "developer"
                        ? "default"
                        : currentUser.role === "admin"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {currentUser.role}
                  </Badge>
                </div>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-300 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <AdminSetupBanner />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className={`grid w-full ${
              availableTabs.length === 5 ? "grid-cols-5" : "grid-cols-4"
            }`}
          >
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="add-song">Add Song</TabsTrigger>
            <TabsTrigger value="submissions">
              Submissions
              {pendingSubmissions.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingSubmissions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="manage">Manage Songs</TabsTrigger>
            {currentUser && hasRequiredRole(currentUser.role, "admin") && (
              <TabsTrigger value="admin-users">
                <Settings className="w-4 h-4 mr-1" />
                Admin Users
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Music className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="text-2xl font-bold">{songs.length}</h3>
                  <p className="text-gray-600">Total Songs</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                  <h3 className="text-2xl font-bold">
                    {pendingSubmissions.length}
                  </h3>
                  <p className="text-gray-600">Pending Reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h3 className="text-2xl font-bold">
                    {new Set(songs.map((s) => s.artist)).size}
                  </h3>
                  <p className="text-gray-600">Artists</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Check className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="text-2xl font-bold">
                    {submissions.filter((s) => s.status === "approved").length}
                  </h3>
                  <p className="text-gray-600">Approved</p>
                </CardContent>
              </Card>
            </div>

            {/* User Info */}
            {currentUser && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Current Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Name:</strong> {currentUser.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {currentUser.email}
                    </div>
                    <div>
                      <strong>Role:</strong>
                      <Badge
                        className="ml-2"
                        variant={
                          currentUser.role === "developer"
                            ? "default"
                            : currentUser.role === "admin"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {currentUser.role}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Submissions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {recentSubmissions.length > 0 ? (
                  <div className="space-y-4">
                    {recentSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">
                            {submission.title} - {submission.artist}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {submission.submission_type === "new"
                              ? "New Song"
                              : "Correction"}{" "}
                            •
                            {new Date(
                              submission.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            submission.status === "pending"
                              ? "secondary"
                              : submission.status === "approved"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No submissions yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-song" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Song (Direct to Database)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSong} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Image Upload */}
                    <div className="lg:col-span-1">
                      <ImageUpload
                        value={imageFile || newSong.cover || null}
                        onChange={handleImageChange}
                        label="Cover Image"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Right Column - Form Fields */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Song Title *</Label>
                          <Input
                            id="title"
                            value={newSong.title}
                            onChange={(e) =>
                              setNewSong((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            className={formErrors.title ? "border-red-500" : ""}
                            disabled={isSubmitting}
                          />
                          {formErrors.title && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.title}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="artist">Artist *</Label>
                          <Input
                            id="artist"
                            value={newSong.artist}
                            onChange={(e) =>
                              setNewSong((prev) => ({
                                ...prev,
                                artist: e.target.value,
                              }))
                            }
                            className={
                              formErrors.artist ? "border-red-500" : ""
                            }
                            disabled={isSubmitting}
                          />
                          {formErrors.artist && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.artist}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="album">Album</Label>
                          <Input
                            id="album"
                            value={newSong.album}
                            onChange={(e) =>
                              setNewSong((prev) => ({
                                ...prev,
                                album: e.target.value,
                              }))
                            }
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="genre">Genre</Label>
                          <Input
                            id="genre"
                            value={newSong.genre}
                            onChange={(e) =>
                              setNewSong((prev) => ({
                                ...prev,
                                genre: e.target.value,
                              }))
                            }
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <Label htmlFor="year">Year</Label>
                          <Input
                            id="year"
                            type="number"
                            value={newSong.year || ""}
                            onChange={(e) =>
                              setNewSong((prev) => ({
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
                        <Label htmlFor="lyrics">Lyrics *</Label>
                        <Textarea
                          id="lyrics"
                          value={newSong.lyrics}
                          onChange={(e) =>
                            setNewSong((prev) => ({
                              ...prev,
                              lyrics: e.target.value,
                            }))
                          }
                          className={`min-h-[300px] ${
                            formErrors.lyrics ? "border-red-500" : ""
                          }`}
                          placeholder="Enter the complete song lyrics..."
                          disabled={isSubmitting}
                        />
                        {formErrors.lyrics && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.lyrics}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black hover:bg-gray-800"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Creating..." : "Create Song"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Pending Submissions ({pendingSubmissions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingSubmissions.length > 0 ? (
                  <div className="space-y-4">
                    {pendingSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-lg">
                              {submission.title} - {submission.artist}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {submission.submission_type === "new"
                                ? "New Song"
                                : "Correction"}{" "}
                              • Submitted{" "}
                              {new Date(
                                submission.created_at
                              ).toLocaleDateString()}
                            </p>
                            {submission.submitter_name && (
                              <p className="text-sm text-gray-600">
                                By: {submission.submitter_name}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => setSelectedSubmission(submission)}
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>

                        {submission.album && (
                          <p className="text-sm">
                            <strong>Album:</strong> {submission.album}
                          </p>
                        )}
                        {submission.genre && (
                          <p className="text-sm">
                            <strong>Genre:</strong> {submission.genre}
                          </p>
                        )}
                        {submission.year && (
                          <p className="text-sm">
                            <strong>Year:</strong> {submission.year}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No pending submissions
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Submission Review Modal */}
            {selectedSubmission && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Review Submission</CardTitle>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">
                          {selectedSubmission.title}
                        </h3>
                        <p className="text-gray-600">
                          {selectedSubmission.artist}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {selectedSubmission.submission_type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Album:</strong>{" "}
                        {selectedSubmission.album || "N/A"}
                      </div>
                      <div>
                        <strong>Genre:</strong>{" "}
                        {selectedSubmission.genre || "N/A"}
                      </div>
                      <div>
                        <strong>Year:</strong>{" "}
                        {selectedSubmission.year || "N/A"}
                      </div>
                      <div>
                        <strong>Submitter:</strong>{" "}
                        {selectedSubmission.submitter_name || "Anonymous"}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Lyrics:</h4>
                      <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm">
                          {selectedSubmission.lyrics}
                        </pre>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        onClick={() =>
                          handleApproveSubmission(selectedSubmission)
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve & Add to Database
                      </Button>
                      <Button
                        onClick={() => {
                          const reason = prompt("Reason for rejection:");
                          if (reason)
                            handleRejectSubmission(selectedSubmission, reason);
                        }}
                        variant="destructive"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => setSelectedSubmission(null)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Songs ({songs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {songs.length > 0 ? (
                  <div className="space-y-4">
                    {songs.map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">
                            {song.title} - {song.artist}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {song.album && `${song.album} • `}
                            {song.genre && `${song.genre} • `}
                            {song.year}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEditSong(song)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          {currentUser &&
                            hasRequiredRole(currentUser.role, "admin") && (
                              <Button
                                onClick={() =>
                                  setDeleteModal({
                                    isOpen: true,
                                    song,
                                    isDeleting: false,
                                  })
                                }
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No songs in database
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {currentUser && hasRequiredRole(currentUser.role, "admin") && (
            <TabsContent value="admin-users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Admin Users ({adminUsers.length})
                    </CardTitle>
                    <Button
                      onClick={() => setShowCreateUser(true)}
                      className="bg-black hover:bg-gray-800"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {adminUsers.length > 0 ? (
                    <div className="space-y-4">
                      {adminUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created:{" "}
                              {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "secondary"
                              }
                            >
                              {user.role}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No admin users found
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Create User Modal */}
              {showCreateUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Create Admin User</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                          <Label htmlFor="user-name">Name</Label>
                          <Input
                            id="user-name"
                            value={newUser.name}
                            onChange={(e) =>
                              setNewUser((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="user-email">Email</Label>
                          <Input
                            id="user-email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) =>
                              setNewUser((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="user-password">Password</Label>
                          <Input
                            id="user-password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) =>
                              setNewUser((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="user-role">Role</Label>
                          <select
                            id="user-role"
                            value={newUser.role}
                            onChange={(e) =>
                              setNewUser((prev) => ({
                                ...prev,
                                role: e.target.value as "admin" | "moderator",
                              }))
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="flex space-x-4">
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-black hover:bg-gray-800"
                          >
                            {isSubmitting ? "Creating..." : "Create User"}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setShowCreateUser(false)}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() =>
            setDeleteModal({ isOpen: false, song: null, isDeleting: false })
          }
          onConfirm={handleDeleteSong}
          title="Delete Song"
          description="Are you sure you want to delete this song? This action cannot be undone and will permanently remove the song from the database."
          itemName={
            deleteModal.song
              ? `${deleteModal.song.title} by ${deleteModal.song.artist}`
              : ""
          }
          isDeleting={deleteModal.isDeleting}
        />

        {/* Edit Song Modal */}
        <EditSongModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, song: null })}
          onSave={handleEditSave}
          song={editModal.song}
        />
      </div>
    </div>
  );
}
