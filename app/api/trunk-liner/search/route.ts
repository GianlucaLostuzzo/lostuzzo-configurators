import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toJson } from "@/lib/json";

type Filter = Parameters<typeof prisma.epTrunkLiner.findMany>[0];

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

  const filter: Filter = {
    where: {
      car_brand: carBrand,
      ...(carModel && { car_model: carModel }),
      ...(carYear && { car_year: carYear }),
    },
    select: {
      product_code: true,
      brand: true,
      description: true,
      img_url: true,
    },
    orderBy: { product_code: "asc" },
  };

  try {
    // Query database for trunk liner product codes
    const products = await prisma.epTrunkLiner.findMany(filter);

    await prisma.epLog.create({
      data: {
        configurator: "ep_trunk_liner",
        filter: toJson(filter),
      },
    });

    // Respond with the list of product codes
    return new NextResponse(
      toJson({
        data: products.map((r) => ({
          product_code: r.product_code,
          description: r.description,
          brand: r.brand,
          image: r.img_url,
        })),
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error searching trunk liners:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
