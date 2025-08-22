import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

type RowTypology = { typology: string | null };

export async function GET() {
  try {
    const rows: RowTypology[] = await prisma.epBatteries.findMany({
      select: { typology: true },
      distinct: ["typology"],
      orderBy: { typology: "asc" },
    });

    const values = rows
      .map((r) => (r.typology ?? "").trim())
      .filter((v) => v.length > 0);

    return NextResponse.json(toApiFilterResult(values));
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
