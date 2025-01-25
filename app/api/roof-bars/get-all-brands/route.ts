import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brands = await prisma.epRoofBars.findMany({
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    });

    return new NextResponse(toJson(brands.map((b) => b.brand)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching all roof bar brands:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
