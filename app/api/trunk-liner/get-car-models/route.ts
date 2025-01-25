import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toJson } from "@/lib/json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract required query parameter
  const carBrand = searchParams.get("carBrand");

  // Input validation
  if (!carBrand) {
    return new NextResponse("Missing 'carBrand' parameter", { status: 400 });
  }

  try {
    // Query database for distinct car models based on car brand
    const models = await prisma.epTrunkLiner.findMany({
      where: { car_brand: carBrand },
      select: { car_model: true },
      distinct: ["car_model"],
      orderBy: { car_model: "asc" },
    });

    // Respond with the list of car models
    return new NextResponse(toJson(models.map((m) => m.car_model)), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching car models:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
