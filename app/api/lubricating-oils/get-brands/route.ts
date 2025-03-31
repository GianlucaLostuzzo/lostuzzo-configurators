import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type");
  const gradation = searchParams.get("gradation");
  const format = searchParams.get("format");
  const specs = searchParams.get("specs");
  const oemBrand = searchParams.get("oemBrand");
  const oemCertify = searchParams.get("oemCertify");

  if (!type) {
    return new NextResponse("Missing 'type' parameter", { status: 400 });
  }

  try {
    const brands = await prisma.epLubricatingOils.findMany({
      where: {
        type,
        ...(gradation && { gradation }),
        ...(format && { format }),
        ...(specs && { specs }),
        ...(oemBrand && { oem_brand: oemBrand }),
        ...(oemCertify && { oem_certify: oemCertify }),
      },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    });

    return NextResponse.json(toApiFilterResult(brands.map((b) => b.brand)));
  } catch (error) {
    console.error("Error fetching brands:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
