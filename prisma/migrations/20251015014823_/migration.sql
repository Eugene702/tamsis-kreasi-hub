/*
  Warnings:

  - You are about to drop the column `slug` on the `StudentUserSkills` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."StudentUserSkills_slug_key";

-- AlterTable
ALTER TABLE "StudentUserSkills" DROP COLUMN "slug";
