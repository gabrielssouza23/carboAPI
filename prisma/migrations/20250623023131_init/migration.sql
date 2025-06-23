-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ImageOrigin" AS ENUM ('SYSTEM', 'CONTRIBUTION');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "species" (
    "id" VARCHAR(256) NOT NULL,
    "commonName" VARCHAR(255) NOT NULL,
    "scientificName" VARCHAR(255) NOT NULL,
    "kingdom" VARCHAR(100) NOT NULL,
    "phylum" VARCHAR(100) NOT NULL,
    "class" VARCHAR(100) NOT NULL,
    "order" VARCHAR(100) NOT NULL,
    "family" VARCHAR(100) NOT NULL,
    "genus" VARCHAR(100) NOT NULL,
    "specie" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specie_references" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "specieId" TEXT,

    CONSTRAINT "specie_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specie_contributions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "specieId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "location" VARCHAR(255),
    "phone" VARCHAR(255),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "specie_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specie_images" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "origin" "ImageOrigin" NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "specieId" TEXT,
    "contributionId" INTEGER,

    CONSTRAINT "specie_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participations" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "location" VARCHAR(100) NOT NULL,
    "message" TEXT,
    "contact" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "specie_references" ADD CONSTRAINT "specie_references_specieId_fkey" FOREIGN KEY ("specieId") REFERENCES "species"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specie_contributions" ADD CONSTRAINT "specie_contributions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specie_contributions" ADD CONSTRAINT "specie_contributions_specieId_fkey" FOREIGN KEY ("specieId") REFERENCES "species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specie_images" ADD CONSTRAINT "specie_images_specieId_fkey" FOREIGN KEY ("specieId") REFERENCES "species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specie_images" ADD CONSTRAINT "specie_images_contributionId_fkey" FOREIGN KEY ("contributionId") REFERENCES "specie_contributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
