import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brands = await prisma.epAutoMats.findMany({
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    });

    return NextResponse.json(brands.map((b) => b.brand));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
