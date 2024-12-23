import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toJson } from "@/lib/json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manufacter = searchParams.get("manufacter");

  if (!manufacter) {
    return new NextResponse("Missing 'manufacter' parameter", { status: 400 });
  }

  try {
    const brands = await prisma.epRoofBars.findMany({
      where: { manufacter },
      select: { brand: true },
      distinct: ["brand"],
    });

    return new NextResponse(toJson(brands.map((b) => b.brand)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching roof bar brands:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
