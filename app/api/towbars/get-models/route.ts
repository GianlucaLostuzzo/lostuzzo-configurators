import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");

  if (!brand) {
    return NextResponse.json(
      { error: "Missing brand parameter" },
      { status: 400 }
    );
  }

  try {
    const models = await prisma.epTowbars.findMany({
      where: { brand },
      select: { model: true },
      distinct: ["model"],
      orderBy: { model: "asc" },
    });

    return NextResponse.json(
      toApiFilterResult(models.map((m: { model: string }) => m.model))
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
