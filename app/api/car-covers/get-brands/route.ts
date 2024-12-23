import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brands = await prisma.epCarCovers.findMany({
      select: { brand: true },
      distinct: ["brand"],
    });

    return new NextResponse(toJson(brands.map((b) => b.brand)), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
