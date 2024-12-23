import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const width = searchParams.get("width");
  const ratio = searchParams.get("ratio");
  const diameter = searchParams.get("diameter");

  if (!width || !ratio || !diameter) {
    return new NextResponse(
      "Missing 'width', 'ratio', or 'diameter' parameters",
      { status: 400 }
    );
  }

  try {
    const typologies = await prisma.epSnowChains.findMany({
      where: { width, ratio, diameter },
      select: { typology: true },
      distinct: ["typology"],
    });

    return new NextResponse(toJson(typologies.map((t) => t.typology)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching typologies:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
