import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const years = await prisma.epRoofBars.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "asc" },
    });

    return new NextResponse(toJson(years.map((y) => y.year)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching all years:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
