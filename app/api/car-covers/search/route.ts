import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

type Filter = Parameters<typeof prisma.epCarCovers.findMany>[0];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");

  const filter: Filter = {
    where: {
      ...(brand && { brand }),
      ...(model && { model }),
    },
    select: { code: true },
    orderBy: { code: "asc" },
  };

  try {
    const results = await prisma.epCarCovers.findMany(filter);

    await prisma.epLog.create({
      data: {
        configurator: "ep_car_covers",
        filter: toJson(filter),
      },
    });

    return new NextResponse(toJson(results.map((r) => r.code)), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
