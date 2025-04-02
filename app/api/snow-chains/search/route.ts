import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

type Filter = Parameters<typeof prisma.epSnowChains.findMany>[0];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const width = searchParams.get("width");
  const ratio = searchParams.get("ratio");
  const diameter = searchParams.get("diameter");
  const typology = searchParams.get("typology");

  if (!width) {
    return new NextResponse("Missing 'width' parameter", { status: 400 });
  }

  const filter: Filter = {
    where: {
      ...(width && { width }),
      ...(ratio && { ratio }),
      ...(diameter && { diameter }),
      ...(typology && { typology }),
    },
    select: { product_code: true, description: true, img_url: true },
    orderBy: { product_code: "asc" },
  };

  try {
    const results = await prisma.epSnowChains.findMany(filter);

    await prisma.epLog.create({
      data: {
        configurator: "ep_snow_chains",
        filter: toJson(filter),
      },
    });

    return new NextResponse(
      toJson({
        data: results.map((r) => ({
          product_code: r.product_code,
          description: r.description,
          brand: undefined,
          image: r.img_url ?? `ep_snow_chains/${r.product_code}.jpg`,
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
