import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const carBrand = searchParams.get("carBrand");
  const carModel = searchParams.get("carModel");

  if (!carBrand || !carModel) {
    return new NextResponse("Missing 'carBrand' or 'carModel' parameters", {
      status: 400,
    });
  }

  try {
    const years = await prisma.epTrunkLiner.findMany({
      where: { car_brand: carBrand, car_model: carModel },
      select: { car_year: true },
      distinct: ["car_year"],
      orderBy: { car_year: "asc" },
    });

    return new NextResponse(toJson(years.map((y) => y.car_year)), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
