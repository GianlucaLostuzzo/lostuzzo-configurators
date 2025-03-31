import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const typologies = await prisma.epBatteries.findMany({
      select: { typology: true },
      distinct: ["typology"],
      orderBy: { typology: "asc" },
    });

    return NextResponse.json(
      toApiFilterResult(typologies.map((t) => t.typology))
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
