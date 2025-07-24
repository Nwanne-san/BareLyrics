"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Share2,
  Copy,
  Download,
  Instagram,
  Twitter,
  Facebook,
  LinkIcon,
  ImageIcon,
  Type,
  Check,
  MessageCircle,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: {
    id: number;
    title: string;
    artist: string;
    album?: string | null;
    cover?: string | null;
  };
  selectedLyrics?: string;
  songUrl: string;
}

export function ShareModal({
  isOpen,
  onClose,
  song,
  selectedLyrics,
  songUrl,
}: ShareModalProps) {
  const [shareType, setShareType] = useState<"link" | "image" | "text">("link");
  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const shareText = selectedLyrics
    ? `"${selectedLyrics}" - ${song.title} by ${song.artist}`
    : `Check out "${song.title}" by ${song.artist} on BareLyrics`;

  const fullShareText = customMessage
    ? `${customMessage}\n\n${shareText}\n\n${songUrl}`
    : `${shareText}\n\n${songUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(songUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const generateAndDownloadImage = async () => {
    if (!canvasRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        width: 400,
        height: 600,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${song.title}-${song.artist}-lyrics.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImageForShare = async (): Promise<string | null> => {
    if (!canvasRef.current) return null;

    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        width: 400,
        height: 600,
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error("Failed to generate image for share:", error);
      return null;
    }
  };

  const shareToSocial = async (platform: string) => {
    const encodedText = encodeURIComponent(fullShareText);
    const encodedUrl = encodeURIComponent(songUrl);
    const encodedTitle = encodeURIComponent(`${song.title} by ${song.artist}`);

    if (shareType === "image") {
      // For image sharing, we need to handle it differently per platform
      if (platform === "twitter") {
        // Twitter doesn't support direct image sharing via URL, so we'll share text with a note about the image
        const twitterText = encodeURIComponent(
          `${fullShareText}\n\n📸 Check out the lyric image I created!`
        );
        window.open(
          `https://twitter.com/intent/tweet?text=${twitterText}`,
          "_blank",
          "width=600,height=400"
        );
        return;
      } else if (platform === "facebook") {
        // Facebook sharing with image note
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(
            fullShareText + "\n\n📸 Created a beautiful lyric image to share!"
          )}`,
          "_blank",
          "width=600,height=400"
        );
        return;
      } else if (platform === "instagram") {
        // Instagram requires manual sharing
        alert(
          "For Instagram: Please download the image using the 'Download Image' button, then share it manually in the Instagram app with your custom message."
        );
        return;
      }
    }

    // Text/Link sharing
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(
        shareText
      )}`,
      instagram: "", // Will be handled below
    };

    if (platform === "instagram") {
      // Instagram doesn't support direct URL sharing, so we copy to clipboard and guide user
      try {
        await navigator.clipboard.writeText(fullShareText);
        alert(
          "Text copied to clipboard! Open Instagram and paste this in your story or post. You can also download the image and share it directly in the Instagram app."
        );
      } catch (error) {
        alert(
          "Please copy this text manually and share it on Instagram:\n\n" +
            fullShareText
        );
      }
      return;
    }

    // Open the sharing URL
    window.open(
      urls[platform as keyof typeof urls],
      "_blank",
      "width=600,height=400"
    );
  };

  const shareToWhatsApp = () => {
    const encodedText = encodeURIComponent(fullShareText);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareToTelegram = () => {
    const encodedText = encodeURIComponent(fullShareText);
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      songUrl
    )}&text=${encodedText}`;
    window.open(telegramUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Share Song
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Type Selection */}
          <div className="flex space-x-2">
            <Button
              variant={shareType === "link" ? "default" : "outline"}
              size="sm"
              onClick={() => setShareType("link")}
              className="flex-1"
            >
              <LinkIcon className="w-4 h-4 mr-1" />
              Link
            </Button>
            <Button
              variant={shareType === "image" ? "default" : "outline"}
              size="sm"
              onClick={() => setShareType("image")}
              className="flex-1"
            >
              <ImageIcon className="w-4 h-4 mr-1" />
              Image
            </Button>
            <Button
              variant={shareType === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setShareType("text")}
              className="flex-1"
            >
              <Type className="w-4 h-4 mr-1" />
              Text
            </Button>
          </div>

          {/* Custom Message */}
          <div>
            <Label htmlFor="custom-message">Custom Message (Optional)</Label>
            <Textarea
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add your own message..."
              className="mt-1"
              rows={2}
            />
          </div>

          {/* Share Content Based on Type */}
          <AnimatePresence mode="wait">
            {shareType === "link" && (
              <motion.div
                key="link"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <Label>Song Link</Label>
                  <div className="flex mt-1">
                    <Input value={songUrl} readOnly className="flex-1" />
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      size="sm"
                      className="ml-2 bg-transparent"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {shareType === "text" && (
              <motion.div
                key="text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <Label>Share Text</Label>
                  <Textarea
                    value={fullShareText}
                    readOnly
                    className="mt-1"
                    rows={4}
                  />
                  <Button
                    onClick={handleCopyText}
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full bg-transparent"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Text
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {shareType === "image" && (
              <motion.div
                key="image"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Image Preview */}
                <div
                  ref={canvasRef}
                  className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-lg text-white text-center"
                  style={{ width: "300px", height: "400px", margin: "0 auto" }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{song.title}</h3>
                      <p className="text-lg opacity-90">{song.artist}</p>
                      {song.album && (
                        <p className="text-sm opacity-75 mt-1">{song.album}</p>
                      )}
                    </div>

                    {selectedLyrics && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 my-4">
                        <p className="text-sm leading-relaxed">
                          "{selectedLyrics}"
                        </p>
                      </div>
                    )}

                    <div className="text-xs opacity-75">BareLyrics.com</div>
                  </div>
                </div>

                <Button
                  onClick={generateAndDownloadImage}
                  disabled={isGenerating}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : "Download Image"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Media Buttons */}
          <div className="space-y-3">
            <Label>Share to Social Media</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => shareToSocial("twitter")}
                variant="outline"
                size="sm"
                className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
              >
                <Twitter className="w-4 h-4 mr-1" />
                Twitter
              </Button>
              <Button
                onClick={() => shareToSocial("facebook")}
                variant="outline"
                size="sm"
                className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
              >
                <Facebook className="w-4 h-4 mr-1" />
                Facebook
              </Button>
              <Button
                onClick={() => shareToSocial("instagram")}
                variant="outline"
                size="sm"
                className="flex items-center justify-center bg-pink-50 hover:bg-pink-100 text-pink-600 border-pink-200"
              >
                <Instagram className="w-4 h-4 mr-1" />
                Instagram
              </Button>
              <Button
                onClick={shareToWhatsApp}
                variant="outline"
                size="sm"
                className="flex items-center justify-center bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
            </div>
            <Button
              onClick={shareToTelegram}
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
            >
              <Send className="w-4 h-4 mr-1" />
              Telegram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
