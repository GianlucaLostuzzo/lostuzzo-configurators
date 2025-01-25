import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const brandCar = searchParams.get("brandCar");
  const modelCar = searchParams.get("modelCar");
  const yearCar = searchParams.get("yearCar");
  const typeMat = searchParams.get("typeMat");

  if (!brandCar) {
    return new NextResponse("Missing 'brandCar' parameter", { status: 400 });
  }

  try {
    const results = await prisma.epAutoMats.findMany({
      where: {
        brand: brandCar,
        ...(modelCar && { model: modelCar }),
        ...(yearCar && { year: yearCar }),
        ...(typeMat && { type: typeMat }),
      },
      select: { code: true },
      orderBy: { code: "asc" },
    });

    return new NextResponse(toJson(results.map((r) => r.code)), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
