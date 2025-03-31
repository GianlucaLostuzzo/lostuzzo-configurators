import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toApiFilterResult } from "@/lib/json";

export async function GET() {
  try {
    const types = await prisma.epAutoMats.findMany({
      select: { type: true },
      distinct: ["type"],
      orderBy: { type: "asc" },
    });

    return NextResponse.json(toApiFilterResult(types.map((t) => t.type)));
  } catch (error) {
    console.error("Error fetching types for auto mats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
