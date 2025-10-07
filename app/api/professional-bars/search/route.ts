import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

type Filter = Parameters<typeof prisma.epProfessionalBars.findMany>[0];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const brandCar = searchParams.get("brandCar");
  const modelCar = searchParams.get("modelCar");
  const yearCar = searchParams.get("yearCar");

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
    },
    select: {
      product_code: true,
      fix_type1: true,
      fix_type2: true,
      fix_type3: true,
      fix_type4: true,
      fix_type5: true,
      fix_type6: true,
      brand: true,
      description: true,
      img_url: true,
      manufacturer: true,
    },
    distinct: ["product_code"],
    orderBy: { product_code: "asc" },
  };

  try {
    const results = await prisma.epProfessionalBars.findMany(filter);

    await prisma.epLog.create({
      data: {
        configurator: "ep_professional_bars",
        filter: toJson(filter),
      },
    });

    return new NextResponse(
      toJson({
        data: results.map((r) => ({
          product_code: r.product_code,
          brand: r.brand,
          description: r.description,
          manufacturer: r.manufacturer,
          image: r.img_url ?? `ep_professional_bars/${r.product_code}.jpg`,
          fixTypes: [
            r.fix_type1 ? { code: r.fix_type1, type: 1 } : null,
            r.fix_type2 ? { code: r.fix_type2, type: 2 } : null,
            r.fix_type3 ? { code: r.fix_type3, type: 3 } : null,
            r.fix_type4 ? { code: r.fix_type4, type: 4 } : null,
            r.fix_type5 ? { code: r.fix_type5, type: 5 } : null,
            r.fix_type6 ? { code: r.fix_type6, type: 6 } : null,
          ].filter(Boolean),
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
