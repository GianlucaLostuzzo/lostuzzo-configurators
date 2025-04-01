import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-rev-secret");
  const envSecret = process.env.REVALIDATION_SECRET;

  // Check if the secret is configured in the environment
  if (!envSecret || envSecret.trim() === "") {
    return NextResponse.json(
      { message: "Revalidation not properly configured" },
      { status: 500 }
    );
  }

  // Check for secret to confirm this is a valid request
  if (secret !== envSecret) {
    return NextResponse.json(
      { message: "Invalid revalidation token" },
      { status: 401 }
    );
  }

  try {
    revalidatePath("/", "layout");

    const configurators = [
      "/auto-mats",
      "/batteries",
      "/car-covers",
      "/car-trunks",
      "/lubricating-oils",
      "/roof-bars",
      "/snow-chains",
      "/towbars",
      "/trunk-liners",
    ];

    for (const path of configurators) {
      revalidatePath(path);
    }

    return NextResponse.json(
      {
        revalidated: true,
        message: "All pages revalidated successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        revalidated: false,
        message: "Error revalidating pages",
        error: err instanceof Error ? err.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
