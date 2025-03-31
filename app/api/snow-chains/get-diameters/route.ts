import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const width = searchParams.get("width");
  const ratio = searchParams.get("ratio");

  if (!width || !ratio) {
    return new NextResponse("Missing 'width' or 'ratio' parameter", {
      status: 400,
    });
  }

  try {
    const diameters = await prisma.epSnowChains.findMany({
      where: { width, ratio },
      select: { diameter: true },
      distinct: ["diameter"],
      orderBy: { diameter: "asc" },
    });

    return NextResponse.json(
      toApiFilterResult(diameters.map((d) => d.diameter))
    );
  } catch (error) {
    console.error("Error fetching diameters:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
