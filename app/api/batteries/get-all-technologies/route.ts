import prisma from "@/lib/db";
import { NextResponse } from "next/server";

type RowTech = { technology: string | null };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const typology = searchParams.get("typology");
  const brand = searchParams.get("brand") || "";

  if (!typology) {
    return NextResponse.json({ data: [] }, { status: 200 });
  }

  try {
    const rows: RowTech[] = await prisma.epBatteries.findMany({
      select: { technology: true },
      where: {
        typology,
        ...(brand ? { brand } : {}),
        technology: { not: null },
      },
      distinct: ["technology"],
      orderBy: { technology: "asc" },
    });

    const data = rows
      .map((r) => (r.technology ?? "").trim())
      .filter((v) => v.length > 0)
      .map((v) => ({ value: v }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
