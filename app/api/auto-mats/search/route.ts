import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

type Filter = Parameters<typeof prisma.epAutoMats.findMany>[0];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const brandCar = searchParams.get("brandCar");
  const modelCar = searchParams.get("modelCar");
  const yearCar = searchParams.get("yearCar");
  const typeMat = searchParams.get("typeMat");

  if (!brandCar) {
    return new NextResponse("Missing 'brandCar' parameter", { status: 400 });
  }

  const queryFilter: Filter = {
    where: {
      brand: brandCar,
      ...(modelCar && { model: modelCar }),
      ...(yearCar && { year: yearCar }),
      ...(typeMat && { type: typeMat }),
    },
    select: { code: true, brand: true, description: true, img_url: true },
    orderBy: { code: "asc" },
  };

  try {
    const results = await prisma.epAutoMats.findMany(queryFilter);

    await prisma.epLog.create({
      data: {
        configurator: "ep_auto_mats",
        filter: toJson(queryFilter),
      },
    });

    return new NextResponse(
      toJson({
        data: results.map((r) => ({
          product_code: r.code,
          description: r.description,
          brand: r.brand,
          image: r.img_url,
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
