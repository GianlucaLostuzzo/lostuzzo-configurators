import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const models = await prisma.epAutoMats.findMany({
      select: { model: true },
      distinct: ["model"],
    });

    return new NextResponse(toJson(models.map((m) => m.model)), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
