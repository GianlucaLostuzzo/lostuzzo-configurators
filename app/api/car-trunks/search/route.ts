import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const capacity = searchParams.get("capacity");
  const color = searchParams.get("color");
  const doubleOpening = searchParams.get("doubleOpening");
  const fixingType = searchParams.get("fixingType");

  try {
    const results = await prisma.epCarTrunks.findMany({
      where: {
        ...(capacity && { capacity }),
        ...(color && { color }),
        ...(doubleOpening && { double_opening: doubleOpening }),
        ...(fixingType && { fixing_type: fixingType }),
      },
      select: { code: true },
      orderBy: { code: "asc" },
    });

    return new NextResponse(toJson(results.map((r) => r.code)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
