import prisma from "@/lib/db";
import { toJson } from "@/lib/json";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

type Filter = Parameters<typeof prisma.epBatteries.findMany>[0];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const typology = searchParams.get("typology");
  const ahInterval = searchParams.get("ahInterval");
  const length = searchParams.get("length");
  const width = searchParams.get("width");
  const height = searchParams.get("height");
  const lengthTolerance =
    searchParams.get("lengthTolerance") || searchParams.get("lengthTollerance");
  const widthTolerance =
    searchParams.get("widthTolerance") || searchParams.get("widthTollerance");
  const heightTolerance =
    searchParams.get("heightTolerance") || searchParams.get("heightTollerance");
  const positivePolarity = searchParams.get("positivePolarity");

  const lengthDecimal = new Prisma.Decimal(Number(length));
  const widthDecimal = new Prisma.Decimal(Number(width));
  const heightDecimal = new Prisma.Decimal(Number(height));
  const lengthToleranceDecimal = new Prisma.Decimal(Number(lengthTolerance));
  const widthToleranceDecimal = new Prisma.Decimal(Number(widthTolerance));
  const heightToleranceDecimal = new Prisma.Decimal(Number(heightTolerance));

  if (!typology) {
    return new NextResponse("Missing 'typology' parameter", { status: 400 });
  }

  let minimumAh = undefined;
  let maximumAh = undefined;

  if (ahInterval?.match(/^\d+-\d+$/)) {
    [minimumAh, maximumAh] = ahInterval
      ?.split("-")
      .map((x) => new Prisma.Decimal(x));
  }

  if (ahInterval?.match(/^\d+\+$/)) {
    minimumAh = new Prisma.Decimal(ahInterval.slice(0, -1));
  }

  const hasAhInterval = minimumAh !== undefined && maximumAh !== undefined;
  const hasAhLowerBound = minimumAh !== undefined && maximumAh === undefined;

  const filter: Filter = {
    where: {
      typology,
      ...(hasAhInterval && { ah: { gte: minimumAh, lte: maximumAh } }),
      ...(hasAhLowerBound && { ah: { gte: minimumAh } }),
      ...(length &&
        length != "0" && {
          length: {
            lte: lengthDecimal.add(lengthToleranceDecimal),
            gte: lengthDecimal.sub(lengthToleranceDecimal),
          },
        }),
      ...(width &&
        width != "0" && {
          width: {
            lte: widthDecimal.add(widthToleranceDecimal),
            gte: widthDecimal.sub(widthToleranceDecimal),
          },
        }),
      ...(height &&
        height != "0" && {
          height: {
            lte: heightDecimal.add(heightToleranceDecimal),
            gte: heightDecimal.sub(heightToleranceDecimal),
          },
        }),
      ...(positivePolarity && { positive_polarity: positivePolarity }),
    },
    select: { product_code: true, description: true, img_url: true },
    orderBy: { product_code: "asc" },
  };

  try {
    const results = await prisma.epBatteries.findMany(filter);

    await prisma.epLog.create({
      data: {
        configurator: "ep_batteries",
        filter: toJson(filter),
      },
    });

    return new NextResponse(
      toJson({
        data: results.map((r) => ({
          product_code: r.product_code,
          description: r.description,
          brand: undefined,
          image: r.img_url ?? `ep_batteries/${r.product_code}.jpg`,
        })),
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
