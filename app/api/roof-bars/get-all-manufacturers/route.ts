import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const years = await prisma.epRoofBars.findMany({
      select: { manufacter: true },
      distinct: ["manufacter"],
      orderBy: { manufacter: "asc" },
    });

    return NextResponse.json(toApiFilterResult(years.map((y) => y.manufacter)));
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
