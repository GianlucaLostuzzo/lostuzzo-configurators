import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manufacterCar = searchParams.get("manufacterCar");
  const brandCar = searchParams.get("brandCar");
  const modelCar = searchParams.get("modelCar");
  const yearCar = searchParams.get("yearCar");

  try {
    const results = await prisma.epRoofBars.findMany({
      where: {
        ...(manufacterCar && { manufacter: manufacterCar }),
        ...(brandCar && { brand: brandCar }),
        ...(modelCar && { model: modelCar }),
        ...(yearCar && { year: yearCar }),
      },
      select: { code: true },
    });

    return new NextResponse(toJson(results.map((r) => r.code)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
