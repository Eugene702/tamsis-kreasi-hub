/*
  Warnings:

  - The primary key for the `StudentUserSkills` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `skillId` on the `StudentUserSkills` table. All the data in the column will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `StudentUserSkills` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `StudentUserSkills` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `StudentUserSkills` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `StudentUserSkills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `StudentUserSkills` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."StudentUserSkills" DROP CONSTRAINT "StudentUserSkills_skillId_fkey";

-- AlterTable
ALTER TABLE "StudentUserSkills" DROP CONSTRAINT "StudentUserSkills_pkey",
DROP COLUMN "skillId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD CONSTRAINT "StudentUserSkills_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."Skill";

-- CreateIndex
CREATE UNIQUE INDEX "StudentUserSkills_name_key" ON "StudentUserSkills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StudentUserSkills_slug_key" ON "StudentUserSkills"("slug");
