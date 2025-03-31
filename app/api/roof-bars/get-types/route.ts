import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const manufacter =
    searchParams.get("manufacter") || searchParams.get("manufacturer");
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const year = searchParams.get("year");

  if (!manufacter || !brand || !model || !year) {
    return new NextResponse(
      "Missing 'manufacter', 'brand', 'model', or 'year' parameters",
      { status: 400 }
    );
  }

  try {
    const types = await prisma.epRoofBars.findMany({
      where: { manufacter, brand, model, year },
      select: { type: true },
      distinct: ["type"],
      orderBy: { type: "asc" },
    });

    return NextResponse.json(toApiFilterResult(types.map((t) => t.type)));
  } catch (error) {
    console.error("Error fetching types:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
