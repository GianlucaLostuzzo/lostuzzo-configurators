import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const width = searchParams.get("width");
  const ratio = searchParams.get("ratio");
  const diameter = searchParams.get("diameter");
  const typology = searchParams.get("typology");

  if (!width) {
    return new NextResponse("Missing 'width' parameter", { status: 400 });
  }

  try {
    const results = await prisma.epSnowChains.findMany({
      where: {
        ...(width && { width }),
        ...(ratio && { ratio }),
        ...(diameter && { diameter }),
        ...(typology && { typology }),
      },
      select: { product_code: true },
    });

    return new NextResponse(toJson(results.map((r) => r.product_code)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
