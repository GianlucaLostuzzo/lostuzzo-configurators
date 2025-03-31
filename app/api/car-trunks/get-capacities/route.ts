import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const color = searchParams.get("color");
  const doubleOpening = searchParams.get("doubleOpening");
  const fixingType = searchParams.get("fixingType");

  try {
    const capacities = await prisma.epCarTrunks.findMany({
      where: {
        ...(color && { color }),
        ...(doubleOpening && { double_opening: doubleOpening }),
        ...(fixingType && { fixing_type: fixingType }),
      },
      select: { capacity: true },
      distinct: ["capacity"],
      orderBy: { capacity: "asc" },
    });

    return NextResponse.json(
      toApiFilterResult(capacities.map((c) => c.capacity))
    );
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
