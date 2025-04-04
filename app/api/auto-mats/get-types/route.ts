import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toApiFilterResult } from "@/lib/json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const year = searchParams.get("year");

  if (!brand || !model || !year) {
    return new NextResponse("Missing 'brand', 'model', or 'year' parameters", {
      status: 400,
    });
  }

  try {
    const types = await prisma.epAutoMats.findMany({
      where: {
        brand: brand,
        model: model,
        year: year,
      },
      select: { type: true },
      distinct: ["type"],
      orderBy: { type: "asc" },
    });

    return NextResponse.json(toApiFilterResult(types.map((t) => t.type)));
  } catch (error) {
    console.error("Error fetching types for auto mats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
