import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await prisma.epSnowChains.findMany({
      distinct: ["width"],
      select: { width: true },
      orderBy: { width: "asc" },
    });

    return NextResponse.json(toApiFilterResult(results.map((r) => r.width)));
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
