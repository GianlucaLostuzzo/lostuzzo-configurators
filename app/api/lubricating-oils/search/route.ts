import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

type Filter = Parameters<typeof prisma.epLubricatingOils.findMany>[0];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const gradation = searchParams.get("gradation");
  const format = searchParams.get("format");
  const brand = searchParams.get("brand");
  const specs = searchParams.get("specs");
  const oemBrand = searchParams.get("oemBrand");
  const oemCertify = searchParams.get("oemCertify");

  if (!type) {
    return new NextResponse("Missing 'type' parameter", {
      status: 400,
    });
  }

  const filter: Filter = {
    where: {
      type,
      ...(gradation && { gradation }),
      ...(format && { format }),
      ...(specs && { specs }),
      ...(brand && { brand }),
      ...(oemBrand && { oem_brand: oemBrand }),
      ...(oemCertify && { oem_certify: oemCertify }),
    },
    select: { product_code: true, description: true, brand: true },
    distinct: ["product_code"],
    orderBy: { product_code: "asc" },
  };

  try {
    const products = await prisma.epLubricatingOils.findMany(filter);

    await prisma.epLog.create({
      data: {
        configurator: "ep_lubricating_oils",
        filter: toJson(filter),
      },
    });

    return new NextResponse(toJson(products), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
