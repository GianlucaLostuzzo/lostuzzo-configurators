import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

type Filter = Parameters<typeof prisma.epRoofBars.findMany>[0];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const brandCar = searchParams.get("brandCar");
  const modelCar = searchParams.get("modelCar");
  const yearCar = searchParams.get("yearCar");
  const typeBar = searchParams.get("typeBar");
    const manufacturerCar =
    searchParams.get("manufacterCar") || searchParams.get("manufacturerCar");

  if (!brandCar || !modelCar || !yearCar) {
    return new NextResponse(
      "Missing 'brandCar', 'modelCar' or 'yearCar' parameters",
      { status: 400 }
    );
  }

  const filter: Filter = {
    where: {
      brand: brandCar,
      model: modelCar,
      year: yearCar,
      ...(typeBar && { type: typeBar }),
      ...(manufacturerCar && { manufacter: manufacturerCar }),
    },
    select: { code: true, brand: true, description: true, img_url: true },
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

    return new NextResponse(
      toJson({
        data: results.map((r) => ({
          product_code: r.code,
          brand: r.brand,
          description: r.description,
          image: r.img_url ?? `ep_roof_bars/${r.code}.jpg`,
        })),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
