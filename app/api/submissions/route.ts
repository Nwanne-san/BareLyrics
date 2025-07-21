import { type NextRequest, NextResponse } from "next/server";
import { createSongSubmission } from "@/lib/database";
import { songSubmissionSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the data
    const validatedData = songSubmissionSchema.parse(body);

    // Create the submission for review
    const newSubmission = await createSongSubmission(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Song submitted for review! Our team will review it shortly.",
        submission: newSubmission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Song submission error:", error);

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
        message: "Failed to submit song for review. Please try again.",
      },
      { status: 500 }
    );
  }
}
