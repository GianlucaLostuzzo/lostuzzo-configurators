import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brands = await prisma.epTowbars.findMany({
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    });

    return NextResponse.json(
      toApiFilterResult(brands.map((b: { brand: string }) => b.brand))
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
