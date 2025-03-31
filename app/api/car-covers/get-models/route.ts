import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toApiFilterResult } from "@/lib/json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract query parameter
  const brand = searchParams.get("brand");

  // Input validation
  if (!brand) {
    return new NextResponse("Missing 'brand' parameter", { status: 400 });
  }

  try {
    // Query the database for distinct car cover models by brand
    const models = await prisma.epCarCovers.findMany({
      where: { brand: brand },
      select: { model: true },
      distinct: ["model"],
      orderBy: { model: "asc" },
    });

    // Map the models to a JSON-friendly format
    return NextResponse.json(toApiFilterResult(models.map((m) => m.model)));
  } catch (error) {
    console.error("Error fetching car cover models:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
