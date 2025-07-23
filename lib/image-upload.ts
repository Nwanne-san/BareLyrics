import { supabase } from "./superbase";

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Upload image to Supabase Storage
export async function uploadImageToSupabase(
  file: File,
  folder = "song-covers"
): Promise<ImageUploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Please select a valid image file" };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "Image size must be less than 5MB" };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage with public access
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);

      // If it's an RLS error, try creating the bucket first
      if (
        error.message.includes("row-level security") ||
        error.message.includes("Unauthorized")
      ) {
        // Try to create bucket if it doesn't exist
        const { error: bucketError } = await supabase.storage.createBucket(
          "images",
          {
            public: true,
            allowedMimeTypes: ["image/*"],
            fileSizeLimit: 5242880, // 5MB
          }
        );

        if (bucketError && !bucketError.message.includes("already exists")) {
          console.error("Bucket creation error:", bucketError);
        }

        // Retry upload
        const { data: retryData, error: retryError } = await supabase.storage
          .from("images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (retryError) {
          return {
            success: false,
            error: "Failed to upload image. Please try again.",
          };
        }

        return {
          success: true,
          url: supabase.storage.from("images").getPublicUrl(filePath).data
            .publicUrl,
        };
      } else {
        return { success: false, error: "Failed to upload image" };
      }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Image upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

// Delete image from Supabase Storage
export async function deleteImageFromSupabase(
  imageUrl: string
): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage.from("images").remove([filePath]);

    if (error) {
      console.error("Error deleting image:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

// Alternative: Upload to Cloudinary (if you prefer)
export async function uploadImageToCloudinary(
  file: File
): Promise<ImageUploadResult> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "barelyrics"
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      return { success: false, error: "Failed to upload to Cloudinary" };
    }

    const data = await response.json();
    return { success: true, url: data.secure_url };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

// Helper function to create object URL for preview
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

// Helper function to cleanup preview URL
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
