import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manufacter =
    searchParams.get("manufacter") || searchParams.get("manufacturer");
  const brand = searchParams.get("brand");

  if (!manufacter || !brand) {
    return new NextResponse("Missing 'manufacturer' or 'brand' parameters", {
      status: 400,
    });
  }

  try {
    const models = await prisma.epRoofBars.findMany({
      where: { manufacter, brand },
      select: { model: true },
      distinct: ["model"],
      orderBy: { model: "asc" },
    });

    return NextResponse.json(toApiFilterResult(models.map((m) => m.model)));
  } catch (error) {
    console.error("Error fetching roof bar models:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
