/*
  Warnings:

  - The primary key for the `StudentUserSkills` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StudentUserSkills` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `StudentUserSkills` table. All the data in the column will be lost.
  - Added the required column `skillId` to the `StudentUserSkills` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."StudentUserSkills_name_key";

-- AlterTable
ALTER TABLE "StudentUserSkills" DROP CONSTRAINT "StudentUserSkills_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "skillId" TEXT NOT NULL,
ADD CONSTRAINT "StudentUserSkills_pkey" PRIMARY KEY ("studentUserId", "skillId");

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- AddForeignKey
ALTER TABLE "StudentUserSkills" ADD CONSTRAINT "StudentUserSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
