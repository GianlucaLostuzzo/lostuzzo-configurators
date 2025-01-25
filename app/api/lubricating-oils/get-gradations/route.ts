import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toJson } from "@/lib/json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type");
  const format = searchParams.get("format");
  const brand = searchParams.get("brand");
  const specs = searchParams.get("specs");
  const oemBrand = searchParams.get("oemBrand");
  const oemCertify = searchParams.get("oemCertify");

  if (!type) {
    return new NextResponse("Missing 'type' parameter", { status: 400 });
  }

  try {
    const gradations = await prisma.epLubricatingOils.findMany({
      where: {
        type,
        ...(format && { format }),
        ...(brand && { brand }),
        ...(specs && { specs }),
        ...(oemBrand && { oem_brand: oemBrand }),
        ...(oemCertify && { oem_certify: oemCertify }),
      },
      select: { gradation: true },
      distinct: ["gradation"],
      orderBy: { gradation: "asc" },
    });

    return new NextResponse(toJson(gradations.map((g) => g.gradation)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching gradations:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
