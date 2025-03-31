-- CreateTable
CREATE TABLE "ep_towbars" (
    "id" BIGINT NOT NULL,
    "brand" VARCHAR(20) NOT NULL,
    "model" VARCHAR(40) NOT NULL,
    "year" VARCHAR(20) NOT NULL,
    "product_code" VARCHAR(20) NOT NULL,
    "description" VARCHAR(80),
    "created_by" BIGINT,
    "date_created" TIMESTAMP(6),
    "date_updated" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "ep_towbars_pkey" PRIMARY KEY ("id")
);
