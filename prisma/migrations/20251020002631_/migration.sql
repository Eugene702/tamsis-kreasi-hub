/*
  Warnings:

  - The primary key for the `StudentUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StudentUser` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."StudentUserSkills" DROP CONSTRAINT "StudentUserSkills_studentUserId_fkey";

-- DropIndex
DROP INDEX "public"."StudentUser_userId_key";

-- AlterTable
ALTER TABLE "StudentUser" DROP CONSTRAINT "StudentUser_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "StudentUser_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "StudentUserSkills" ADD CONSTRAINT "StudentUserSkills_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "StudentUser"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
