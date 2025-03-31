import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract optional query parameters
  const capacity = searchParams.get("capacity");
  const color = searchParams.get("color");
  const doubleOpening = searchParams.get("doubleOpening");

  try {
    // Query for distinct fixing types with optional filters
    const fixingTypes = await prisma.epCarTrunks.findMany({
      where: {
        ...(capacity && { capacity }),
        ...(color && { color }),
        ...(doubleOpening && { double_opening: doubleOpening }),
      },
      select: { fixing_type: true },
      distinct: ["fixing_type"],
      orderBy: { fixing_type: "asc" },
    });

    // Respond with the list of fixing types
    return NextResponse.json(
      toApiFilterResult(fixingTypes.map((f) => f.fixing_type))
    );
  } catch (error) {
    console.error("Error fetching car trunk fixing types:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
