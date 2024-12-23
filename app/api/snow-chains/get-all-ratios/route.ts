import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ratios = await prisma.epSnowChains.findMany({
      select: { ratio: true },
      distinct: ["ratio"],
    });

    return new NextResponse(toJson(ratios.map((r) => r.ratio)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching all ratios:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
