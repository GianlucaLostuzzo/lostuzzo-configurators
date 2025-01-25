import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");

  if (!brand) {
    return new NextResponse("Missing 'brand' parameter", { status: 400 });
  }

  try {
    const models = await prisma.epAutoMats.findMany({
      where: { brand },
      select: { model: true },
      distinct: ["model"],
      orderBy: { model: "asc" },
    });

    return new NextResponse(toJson(models.map((m) => m.model)), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
