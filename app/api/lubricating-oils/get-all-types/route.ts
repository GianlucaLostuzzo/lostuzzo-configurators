import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const years = await prisma.epLubricatingOils.findMany({
      select: { type: true },
      distinct: ["type"],
      orderBy: { type: "asc" },
    });

    return new NextResponse(toJson(years.map((y) => y.type)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
