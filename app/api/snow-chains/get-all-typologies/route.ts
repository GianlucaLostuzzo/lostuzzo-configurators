import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const typologies = await prisma.epSnowChains.findMany({
      select: { typology: true },
      distinct: ["typology"],
      orderBy: { typology: "asc" },
    });

    return new NextResponse(toJson(typologies.map((t) => t.typology)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching all typologies:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
