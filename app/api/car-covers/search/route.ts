import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");

  try {
    const results = await prisma.epCarCovers.findMany({
      where: {
        ...(brand && { brand }),
        ...(model && { model }),
      },
      select: { code: true },
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
