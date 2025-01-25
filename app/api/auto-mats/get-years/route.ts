import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");

  if (!brand || !model) {
    return new NextResponse("Missing 'brand' or 'model' parameters", {
      status: 400,
    });
  }

  try {
    const years = await prisma.epAutoMats.findMany({
      where: { brand, model },
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "asc" },
    });

    return new NextResponse(toJson(years.map((y) => y.year)), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
