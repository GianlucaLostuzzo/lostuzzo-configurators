import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ratios = await prisma.epSnowChains.findMany({
      select: { ratio: true },
      distinct: ["ratio"],
      orderBy: { ratio: "asc" },
    });

    return NextResponse.json(toApiFilterResult(ratios.map((r) => r.ratio)));
  } catch (error) {
    console.error("Error fetching all ratios:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
