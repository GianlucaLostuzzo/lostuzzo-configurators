import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toJson } from "@/lib/json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const width = searchParams.get("width");

  if (!width) {
    return new NextResponse("Missing 'width' parameter", { status: 400 });
  }

  try {
    const ratios = await prisma.epSnowChains.findMany({
      where: { width },
      select: { ratio: true },
      distinct: ["ratio"],
      orderBy: { ratio: "asc" },
    });

    return new NextResponse(toJson(ratios.map((r) => r.ratio)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching ratios:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
