import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const types = await prisma.epRoofBars.findMany({
      select: { type: true },
      distinct: ["type"],
      orderBy: { type: "asc" },
    });

    return NextResponse.json(toApiFilterResult(types.map((t) => t.type)));
  } catch (error) {
    console.error("Error fetching all types:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
