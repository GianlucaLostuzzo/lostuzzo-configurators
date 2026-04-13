import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product = searchParams.get("product");

  if (!product) {
    return new NextResponse(
      "Missing 'product' parameter",
      { status: 400 }
    );
  }

  try {
    const datasheet = await prisma.epTechnicalSheets.findFirst({
      where: { code: product },
      select: { sheet: true },
    });

    if (!datasheet?.sheet) {
      return new NextResponse(
        "Datasheet not found for the given product code",
        { status: 404 }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_DATASHEET_URL}/${datasheet.sheet}.pdf`;
    console.log("Redirecting to datasheet URL:", url);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Error fetching datasheets:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
