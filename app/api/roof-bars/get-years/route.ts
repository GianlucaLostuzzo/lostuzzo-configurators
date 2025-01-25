import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
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

    return new NextResponse(toJson(years.map((y) => y.year)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching years:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
