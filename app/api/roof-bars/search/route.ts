import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

type Filter = Parameters<typeof prisma.epRoofBars.findMany>[0];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manufacturerCar =
    searchParams.get("manufacterCar") || searchParams.get("manufacturerCar");
  const brandCar = searchParams.get("brandCar");
  const modelCar = searchParams.get("modelCar");
  const yearCar = searchParams.get("yearCar");
  const typeBar = searchParams.get("typeBar");

  if (!manufacturerCar || !brandCar || !modelCar || !yearCar) {
    return new NextResponse(
      "Missing 'manufacturerCar', 'brandCar', 'modelCar' or 'yearCar' parameters",
      { status: 400 }
    );
  }

  const filter: Filter = {
    where: {
      manufacter: manufacturerCar,
      brand: brandCar,
      model: modelCar,
      year: yearCar,
      ...(typeBar && { type: typeBar }),
    },
    select: { code: true },
    orderBy: { code: "asc" },
  };

  try {
    const results = await prisma.epRoofBars.findMany(filter);

    await prisma.epLog.create({
      data: {
        configurator: "ep_roof_bars",
        filter: toJson(filter),
      },
    });

    return new NextResponse(toJson(results.map((r) => r.code)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
