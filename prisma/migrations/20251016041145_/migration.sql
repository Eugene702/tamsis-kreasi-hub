/*
  Warnings:

  - You are about to drop the column `slug` on the `Skill` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Skill_slug_key";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "slug";
