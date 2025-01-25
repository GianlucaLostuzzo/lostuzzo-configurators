import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const diameters = await prisma.epSnowChains.findMany({
      select: { diameter: true },
      distinct: ["diameter"],
      orderBy: { diameter: "asc" },
    });

    return new NextResponse(toJson(diameters.map((d) => d.diameter)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching all diameters:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
