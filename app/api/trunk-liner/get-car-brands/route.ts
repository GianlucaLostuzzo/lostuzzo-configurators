import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brands = await prisma.epTrunkLiner.findMany({
      select: { car_brand: true },
      distinct: ["car_brand"],
      orderBy: { car_brand: "asc" },
    });

    return new NextResponse(toJson(brands.map((b) => b.car_brand)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
