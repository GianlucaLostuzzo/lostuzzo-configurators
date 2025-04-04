import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

type Filter = Parameters<typeof prisma.epCarCovers.findMany>[0];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");

  const filter: Filter = {
    where: {
      ...(brand && { brand }),
      ...(model && { model }),
    },
    select: { code: true, brand: true, description: true, img_url: true },
    orderBy: { code: "asc" },
  };

  try {
    const results = await prisma.epCarCovers.findMany(filter);

    await prisma.epLog.create({
      data: {
        configurator: "ep_car_covers",
        filter: toJson(filter),
      },
    });

    return new NextResponse(
      toJson({
        data: results.map((r) => ({
          product_code: r.code,
          brand: r.brand,
          description: r.description,
          image: r.img_url ?? `ep_car_covers/${r.code}.jpg`,
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
