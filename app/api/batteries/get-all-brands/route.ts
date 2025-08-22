import prisma from "@/lib/db";
import { NextResponse } from "next/server";

type RowBrand = { brand: string | null };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const typology = searchParams.get("typology");

  if (!typology) return NextResponse.json({ data: [] });

  try {
    const rows: RowBrand[] = await prisma.epBatteries.findMany({
      select: { brand: true },               // <— importante
      where: { typology, brand: { not: null } },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    });

    const data = rows
      .map((r) => (r.brand ?? "").trim())
      .filter((v) => v.length > 0)
      .map((v) => ({ value: v }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
