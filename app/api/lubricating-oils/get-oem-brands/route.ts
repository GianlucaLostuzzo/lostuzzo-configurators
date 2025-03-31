import prisma from "@/lib/db";
import { toApiFilterResult } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type");
  const gradation = searchParams.get("gradation");
  const brand = searchParams.get("brand");
  const format = searchParams.get("format");
  const specs = searchParams.get("specs");
  const oemCertify = searchParams.get("oemCertify");

  if (!type) {
    return new NextResponse("Missing 'type' parameter", { status: 400 });
  }

  try {
    const oemBrands = await prisma.epLubricatingOils.findMany({
      where: {
        type,
        ...(gradation && { gradation }),
        ...(brand && { brand }),
        ...(format && { format }),
        ...(specs && { specs }),
        ...(oemCertify && { oem_certify: oemCertify }),
      },
      select: { oem_brand: true },
      distinct: ["oem_brand"],
      orderBy: { oem_brand: "asc" },
    });

    return NextResponse.json(
      toApiFilterResult(oemBrands.map((o) => o.oem_brand))
    );
  } catch (error) {
    console.error("Error fetching OEM brands:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
