import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toApiFilterResult } from "@/lib/json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract optional query parameters
  const capacity = searchParams.get("capacity");
  const doubleOpening = searchParams.get("doubleOpening");
  const fixingType = searchParams.get("fixingType");

  try {
    // Query for distinct colors with optional filters
    const colors = await prisma.epCarTrunks.findMany({
      where: {
        ...(capacity && { capacity }),
        ...(doubleOpening && { double_opening: doubleOpening }),
        ...(fixingType && { fixing_type: fixingType }),
      },
      select: { color: true },
      distinct: ["color"],
      orderBy: { color: "asc" },
    });

    // Respond with the list of colors
    return NextResponse.json(toApiFilterResult(colors.map((c) => c.color)));
  } catch (error) {
    console.error("Error fetching car trunk colors:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
