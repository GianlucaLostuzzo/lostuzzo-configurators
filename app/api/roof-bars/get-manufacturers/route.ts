import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

type Row = { manufacter: string | null };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const brand = searchParams.get("brand")?.trim() || "";
  const model = searchParams.get("model")?.trim() || "";
  const year = searchParams.get("year")?.trim() || "";
  const type = searchParams.get("type")?.trim() || ""; // opzionale

  // type NON obbligatorio
  if (!brand || !model || !year) {
    return new NextResponse("Missing 'brand', 'model' or 'year' parameter(s)", {
      status: 400,
    });
  }

  try {
    const rows: Row[] = await prisma.epRoofBars.findMany({
      where: {
        brand,
        model,
        year,
        ...(type ? { type } : {}), // filtra per type SOLO se presente
      },
      select: { manufacter: true },
      distinct: ["manufacter"],
      orderBy: { manufacter: "asc" },
    });

    const values = rows
      .map((r) => (r.manufacter ?? "").trim())
      .filter((v) => v.length > 0);

    return NextResponse.json(toApiFilterResult(values));
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
