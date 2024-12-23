import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manufacter = searchParams.get("manufacter");
  const brand = searchParams.get("brand");

  if (!manufacter || !brand) {
    return new NextResponse("Missing 'manufacter' or 'brand' parameters", {
      status: 400,
    });
  }

  try {
    const models = await prisma.epRoofBars.findMany({
      where: { manufacter, brand },
      select: { model: true },
      distinct: ["model"],
    });

    return new NextResponse(toJson(models.map((m) => m.model)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching roof bar models:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
