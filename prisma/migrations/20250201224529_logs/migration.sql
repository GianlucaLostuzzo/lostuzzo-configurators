-- CreateTable
CREATE TABLE "ep_log" (
    "id" BIGSERIAL NOT NULL,
    "configurator" VARCHAR(255) NOT NULL,
    "filter" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ep_log_pkey" PRIMARY KEY ("id")
);
