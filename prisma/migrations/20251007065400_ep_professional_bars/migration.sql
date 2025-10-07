-- CreateTable
CREATE TABLE "public"."ep_professional_bars" (
    "id" BIGINT NOT NULL,
    "manufacturer" VARCHAR(20) NOT NULL,
    "brand" VARCHAR(20) NOT NULL,
    "model" VARCHAR(255) NOT NULL,
    "year" VARCHAR(20) NOT NULL,
    "product_code" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "fix_type1" VARCHAR(255),
    "fix_type2" VARCHAR(255),
    "fix_type3" VARCHAR(255),
    "fix_type4" VARCHAR(255),
    "fix_type5" VARCHAR(255),
    "fix_type6" VARCHAR(255),
    "img_url" TEXT,

    CONSTRAINT "ep_professional_bars_pkey" PRIMARY KEY ("id")
);
