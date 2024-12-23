import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toJson } from "@/lib/json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract optional query parameters
  const carBrand = searchParams.get("carBrand");
  const carModel = searchParams.get("carModel");
  const carYear = searchParams.get("carYear");

  // Input validation: 'carBrand' is required
  if (!carBrand) {
    return new NextResponse("Missing 'carBrand' parameter", { status: 400 });
  }

  try {
    // Query database for trunk liner product codes
    const products = await prisma.epTrunkLiner.findMany({
      where: {
        car_brand: carBrand,
        ...(carModel && { car_model: carModel }),
        ...(carYear && { car_year: carYear }),
      },
      select: { product_code: true },
    });

    // Respond with the list of product codes
    return new NextResponse(toJson(products.map((p) => p.product_code)), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error searching trunk liners:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
