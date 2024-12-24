import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const years = await prisma.epRoofBars.findMany({
      select: { manufacter: true },
      distinct: ["manufacter"],
    });

    return new NextResponse(toJson(years.map((y) => y.manufacter)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
