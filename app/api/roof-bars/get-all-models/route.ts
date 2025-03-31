import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const models = await prisma.epRoofBars.findMany({
      select: { model: true },
      distinct: ["model"],
      orderBy: { model: "asc" },
    });

    return NextResponse.json(toApiFilterResult(models.map((m) => m.model)));
  } catch (error) {
    console.error("Error fetching all roof bar models:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
