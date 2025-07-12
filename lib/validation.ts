import { z } from "zod";

export const songSubmissionSchema = z.object({
  title: z.string().min(1, "Song title is required").max(200, "Title too long"),
  artist: z
    .string()
    .min(1, "Artist name is required")
    .max(100, "Artist name too long"),
  album: z.string().max(200, "Album name too long").optional(),
  genre: z.string().max(50, "Genre too long").optional(),
  year: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future")
    .optional(),
  cover: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  lyrics: z
    .string()
    .min(10, "Lyrics must be at least 10 characters long")
    .max(10000, "Lyrics too long"),
  submitter_name: z.string().max(100, "Name too long").optional(),
  submitter_email: z
    .string()
    .email("Must be a valid email")
    .optional()
    .or(z.literal("")),
});

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  email: z.string().email("Must be a valid email"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(2000, "Message too long"),
});

export type SongSubmissionData = z.infer<typeof songSubmissionSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
