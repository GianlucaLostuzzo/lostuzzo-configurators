import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await prisma.epSnowChains.findMany({
      distinct: ["width"],
      select: { width: true },
    });

    return new NextResponse(toJson(results.map((r) => r.width)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
