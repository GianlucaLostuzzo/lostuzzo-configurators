import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

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

  try {
    const products = await prisma.epLubricatingOils.findMany({
      where: {
        type,
        ...(gradation && { gradation }),
        ...(format && { format }),
        ...(specs && { specs }),
        ...(brand && { brand }),
        ...(oemBrand && { oem_brand: oemBrand }),
        ...(oemCertify && { oem_certify: oemCertify }),
      },
      select: { product_code: true },
    });

    return new NextResponse(toJson(products.map((y) => y.product_code)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
