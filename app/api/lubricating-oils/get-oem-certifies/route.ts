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
  const oemBrand = searchParams.get("oemBrand");

  if (!type) {
    return new NextResponse("Missing 'type' parameter", { status: 400 });
  }

  try {
    const oemCertifies = await prisma.epLubricatingOils.findMany({
      where: {
        type,
        ...(gradation && { gradation }),
        ...(brand && { brand }),
        ...(format && { format }),
        ...(specs && { specs }),
        ...(oemBrand && { oem_brand: oemBrand }),
      },
      select: { oem_certify: true },
      distinct: ["oem_certify"],
      orderBy: { oem_certify: "asc" },
    });

    return NextResponse.json(
      toApiFilterResult(oemCertifies.map((o) => o.oem_certify))
    );
  } catch (error) {
    console.error("Error fetching OEM certifies:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
