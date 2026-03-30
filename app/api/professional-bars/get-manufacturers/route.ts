import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const year = searchParams.get("year");

  if (!brand || !model) {
    return new NextResponse(
      "Missing 'brand', or 'model' parameters",
      { status: 400 }
    );
  }

  try {
    const years = await prisma.epProfessionalBars.findMany({
      where: { brand, model, year: year || undefined },
      select: { manufacturer: true },
      distinct: ["manufacturer"],
      orderBy: { manufacturer: "asc" },
    });

    return NextResponse.json(toApiFilterResult(years.map((y) => y.manufacturer)));
  } catch (error) {
    console.error("Error fetching years:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
