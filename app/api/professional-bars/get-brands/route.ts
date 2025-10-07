import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toApiFilterResult } from "@/lib/json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manufacter =
    searchParams.get("manufacter") || searchParams.get("manufacturer");

  if (!manufacter) {
    return new NextResponse("Missing 'manufacturer' parameter", {
      status: 400,
    });
  }

  try {
    const brands = await prisma.epProfessionalBars.findMany({
      where: { manufacturer: manufacter },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    });

    return NextResponse.json(toApiFilterResult(brands.map((b) => b.brand)));
  } catch (error) {
    console.error("Error fetching professional bar brands:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
