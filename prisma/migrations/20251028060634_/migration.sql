/*
  Warnings:

  - You are about to drop the column `description` on the `UserProject` table. All the data in the column will be lost.
  - Added the required column `domain` to the `UserProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserProject" DROP COLUMN "description",
ADD COLUMN     "domain" TEXT NOT NULL;
