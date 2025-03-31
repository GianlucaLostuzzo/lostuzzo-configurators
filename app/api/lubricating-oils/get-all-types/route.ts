import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const years = await prisma.epLubricatingOils.findMany({
      select: { type: true },
      distinct: ["type"],
      orderBy: { type: "asc" },
    });

    return NextResponse.json(toApiFilterResult(years.map((y) => y.type)));
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
