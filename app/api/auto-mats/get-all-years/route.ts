import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const years = await prisma.epAutoMats.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "asc" },
    });

    return NextResponse.json(toApiFilterResult(years.map((y) => y.year)));
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
