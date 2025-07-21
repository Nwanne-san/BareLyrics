import { type NextRequest, NextResponse } from "next/server";
import { createSongDirect } from "@/lib/database";
import { adminSongSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the data
    const validatedData = adminSongSchema.parse(body);

    // Create the song directly (admin bypass)
    const newSong = await createSongDirect(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Song created successfully!",
        song: newSong,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin song creation error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create song. Please try again.",
      },
      { status: 500 }
    );
  }
}
