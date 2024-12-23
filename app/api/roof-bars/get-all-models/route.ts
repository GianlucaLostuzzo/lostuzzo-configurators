import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const models = await prisma.epRoofBars.findMany({
      select: { model: true },
      distinct: ["model"],
    });

    return new NextResponse(toJson(models.map((m) => m.model)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching all roof bar models:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
