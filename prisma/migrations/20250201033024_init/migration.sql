-- CreateTable
CREATE TABLE "ep_auto_mats" (
    "auto_mats_id" BIGINT NOT NULL,
    "brand" VARCHAR(20) NOT NULL,
    "model" VARCHAR(40) NOT NULL,
    "year" VARCHAR(20) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "created_by" BIGINT,
    "date_created" TIMESTAMP(6),
    "date_updated" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "ep_auto_mats_pkey" PRIMARY KEY ("auto_mats_id")
);

-- CreateTable
CREATE TABLE "ep_batteries" (
    "batteries_id" BIGINT NOT NULL,
    "typology" VARCHAR(255) NOT NULL,
    "product_code" VARCHAR(255) NOT NULL,
    "cdalias" VARCHAR(255),
    "size" VARCHAR(255) NOT NULL,
    "length" DECIMAL(19,5),
    "width" DECIMAL(19,5),
    "height" DECIMAL(19,5),
    "volt" DECIMAL(19,5),
    "ah" DECIMAL(19,5),
    "a_en" DECIMAL(19,5),
    "positive_polarity" VARCHAR(10),
    "created_by" BIGINT,
    "date_created" TIMESTAMP(6),
    "date_updated" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "ep_batteries_pkey" PRIMARY KEY ("batteries_id")
);

-- CreateTable
CREATE TABLE "ep_car_covers" (
    "car_covers_id" BIGINT NOT NULL,
    "brand" VARCHAR(40) NOT NULL,
    "model" VARCHAR(40) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "created_by" BIGINT,
    "date_created" TIMESTAMP(6),
    "date_updated" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "ep_car_covers_pkey" PRIMARY KEY ("car_covers_id")
);

-- CreateTable
CREATE TABLE "ep_car_trunks" (
    "car_trunks_id" BIGINT NOT NULL,
    "brand" VARCHAR(20) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "capacity" VARCHAR(20) NOT NULL,
    "color" VARCHAR(20) NOT NULL,
    "double_opening" VARCHAR(10) NOT NULL,
    "fixing_type" VARCHAR(40) NOT NULL,
    "created_by" BIGINT,
    "date_created" TIMESTAMP(6),
    "date_updated" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "ep_car_trunks_pkey" PRIMARY KEY ("car_trunks_id")
);

-- CreateTable
CREATE TABLE "ep_lubricating_oils" (
    "lubricating_oils_id" BIGINT NOT NULL,
    "type" VARCHAR(255),
    "gradation" VARCHAR(255),
    "brand" VARCHAR(255),
    "format" VARCHAR(255),
    "specs" VARCHAR(255),
    "oem_brand" VARCHAR(255),
    "oem_certify" VARCHAR(255),
    "product_code" VARCHAR(255) NOT NULL,
    "created_by" BIGINT,
    "date_created" TIMESTAMP(6),
    "date_updated" TIMESTAMP(6),
    "updated_by" BIGINT,
    "dsmarca" VARCHAR(40),

    CONSTRAINT "ep_lubricating_oils_pkey" PRIMARY KEY ("lubricating_oils_id")
);

-- CreateTable
CREATE TABLE "ep_roof_bars" (
    "roof_bars_id" BIGINT NOT NULL,
    "manufacter" VARCHAR(20) NOT NULL,
    "brand" VARCHAR(20) NOT NULL,
    "model" VARCHAR(255) NOT NULL,
    "year" VARCHAR(20) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "created_by" BIGINT,
    "date_created" TIMESTAMP(6),
    "date_updated" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "ep_roof_bars_pkey" PRIMARY KEY ("roof_bars_id")
);

-- CreateTable
CREATE TABLE "ep_snow_chains" (
    "snow_chains_id" BIGINT NOT NULL,
    "diameter" VARCHAR(10) NOT NULL,
    "width" VARCHAR(10) NOT NULL,
    "ratio" VARCHAR(10) NOT NULL,
    "created_by" BIGINT,
    "date_created" TIMESTAMP(6),
    "date_updated" TIMESTAMP(6),
    "updated_by" BIGINT,
    "product_code" VARCHAR(255),
    "typology" VARCHAR(255),

    CONSTRAINT "ep_snow_chains_pkey" PRIMARY KEY ("snow_chains_id")
);

-- CreateTable
CREATE TABLE "ep_trunk_liner" (
    "trunk_liner_id" BIGINT NOT NULL,
    "car_brand" VARCHAR(255) NOT NULL,
    "car_model" VARCHAR(255) NOT NULL,
    "car_year" VARCHAR(255),
    "cdalias" VARCHAR(255),
    "product_code" VARCHAR(255) NOT NULL,
    "brand" VARCHAR(255),
    "created_by" BIGINT,
    "date_created" TIMESTAMP(6),
    "date_updated" TIMESTAMP(6),
    "updated_by" BIGINT,

    CONSTRAINT "ep_trunk_liner_pkey" PRIMARY KEY ("trunk_liner_id")
);
