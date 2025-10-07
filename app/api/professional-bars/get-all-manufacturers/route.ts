import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const years = await prisma.epProfessionalBars.findMany({
      select: { manufacturer: true },
      distinct: ["manufacturer"],
      orderBy: { manufacturer: "asc" },
    });

    return NextResponse.json(toApiFilterResult(years.map((y) => y.manufacturer)));
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
