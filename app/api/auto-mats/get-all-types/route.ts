import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { toJson } from "@/lib/json";

export async function GET() {
  try {
    // Query the database for distinct types of auto mats
    const types = await prisma.epAutoMats.findMany({
      select: { type: true },
      distinct: ["type"],
    });

    // Map the types to a JSON-friendly format
    return new NextResponse(toJson(types.map((t) => t.type)), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching types for auto mats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
