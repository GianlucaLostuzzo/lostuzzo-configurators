import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

type Filter = Parameters<typeof prisma.epTowbars.findMany>[0];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const brandCar = searchParams.get("brandCar");
  const modelCar = searchParams.get("modelCar");
  const yearCar = searchParams.get("yearCar");

  if (!brandCar) {
    return new NextResponse("Missing 'brandCar' parameter", { status: 400 });
  }

  const queryFilter: Filter = {
    where: {
      brand: brandCar,
      ...(modelCar && { model: modelCar }),
      ...(yearCar && { year: yearCar }),
    },
    select: {
      product_code: true,
      brand: true,
      description: true,
      img_url: true,
    },
    orderBy: { product_code: "asc" },
  };

  try {
    const results = await prisma.epTowbars.findMany(queryFilter);

    await prisma.epLog.create({
      data: {
        configurator: "ep_towbars",
        filter: toJson(queryFilter),
      },
    });

    return new NextResponse(
      toJson({
        data: results.map((r) => ({
          product_code: r.product_code,
          description: r.description,
          brand: r.brand,
          image: r.img_url ?? `ep_towbars/${r.product_code}.jpg`,
        })),
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
