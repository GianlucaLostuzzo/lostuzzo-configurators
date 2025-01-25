import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type");
  const gradation = searchParams.get("gradation");
  const brand = searchParams.get("brand");
  const format = searchParams.get("format");
  const oemBrand = searchParams.get("oemBrand");
  const oemCertify = searchParams.get("oemCertify");

  if (!type) {
    return new NextResponse("Missing 'type' parameter", { status: 400 });
  }

  try {
    const specs = await prisma.epLubricatingOils.findMany({
      where: {
        type,
        ...(gradation && { gradation }),
        ...(brand && { brand }),
        ...(format && { format }),
        ...(oemBrand && { oem_brand: oemBrand }),
        ...(oemCertify && { oem_certify: oemCertify }),
      },
      select: { specs: true },
      distinct: ["specs"],
      orderBy: { specs: "asc" },
    });

    return new NextResponse(toJson(specs.map((s) => s.specs)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching specifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
