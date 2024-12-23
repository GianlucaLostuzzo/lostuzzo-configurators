import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toJson } from "@/lib/json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract query parameters
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const year = searchParams.get("year");

  // Input validation
  if (!brand || !model || !year) {
    return new NextResponse("Missing 'brand', 'model', or 'year' parameters", {
      status: 400,
    });
  }

  try {
    // Query the database for distinct types of auto mats
    const types = await prisma.epAutoMats.findMany({
      where: {
        brand: brand,
        model: model,
        year: year,
      },
      select: { type: true },
      distinct: ["type"],
    });

    // Map the types to a JSON-friendly format
    return new NextResponse(toJson(types.map((t) => t.type)), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching types for auto mats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
