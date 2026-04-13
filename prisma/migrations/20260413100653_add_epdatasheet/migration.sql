-- CreateTable
CREATE TABLE "public"."ep_technical_sheets" (
    "id" BIGINT NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "sheet" VARCHAR(100) NOT NULL,

    CONSTRAINT "ep_technical_sheets_pkey" PRIMARY KEY ("id")
);
