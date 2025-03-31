import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const manufacter =
    searchParams.get("manufacter") || searchParams.get("manufacturer");
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");

  if (!manufacter || !brand || !model) {
    return new NextResponse(
      "Missing 'manufacter', 'brand', or 'model' parameters",
      { status: 400 }
    );
  }

  try {
    const years = await prisma.epRoofBars.findMany({
      where: { manufacter, brand, model },
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "asc" },
    });

    return NextResponse.json(toApiFilterResult(years.map((y) => y.year)));
  } catch (error) {
    console.error("Error fetching years:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
