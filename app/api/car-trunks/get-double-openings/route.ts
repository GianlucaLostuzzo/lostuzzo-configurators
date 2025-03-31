import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract optional query parameters
  const capacity = searchParams.get("capacity");
  const color = searchParams.get("color");
  const fixingType = searchParams.get("fixingType");

  try {
    // Query for distinct double openings with optional filters
    const doubleOpenings = await prisma.epCarTrunks.findMany({
      where: {
        ...(capacity && { capacity }),
        ...(color && { color }),
        ...(fixingType && { fixing_type: fixingType }),
      },
      select: { double_opening: true },
      distinct: ["double_opening"],
      orderBy: { double_opening: "asc" },
    });

    // Respond with the list of double openings
    return NextResponse.json(
      toApiFilterResult(doubleOpenings.map((d) => d.double_opening))
    );
  } catch (error) {
    console.error("Error fetching car trunk double openings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
