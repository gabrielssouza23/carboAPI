/*
  Warnings:

  - You are about to drop the column `userId` on the `participations` table. All the data in the column will be lost.
  - Added the required column `name` to the `participations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_userId_fkey";

-- AlterTable
ALTER TABLE "participations" DROP COLUMN "userId",
ADD COLUMN     "name" VARCHAR(100) NOT NULL;
