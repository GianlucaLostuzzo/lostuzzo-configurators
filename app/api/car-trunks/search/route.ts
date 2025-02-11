import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

type Filter = Parameters<typeof prisma.epCarTrunks.findMany>[0];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const capacity = searchParams.get("capacity");
  const color = searchParams.get("color");
  const doubleOpening = searchParams.get("doubleOpening");
  const fixingType = searchParams.get("fixingType");

  const filter: Filter = {
    where: {
      ...(capacity && { capacity }),
      ...(color && { color }),
      ...(doubleOpening && { double_opening: doubleOpening }),
      ...(fixingType && { fixing_type: fixingType }),
    },
    select: { code: true, brand: true, description: true },
    orderBy: { code: "asc" },
  };

  try {
    const results = await prisma.epCarTrunks.findMany(filter);

    await prisma.epLog.create({
      data: {
        configurator: "ep_car_trunks",
        filter: toJson(filter),
      },
    });

    return new NextResponse(
      toJson(
        results.map((r) => ({
          product_code: r.code,
          brand: r.brand,
          description: r.description,
        }))
      ),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
