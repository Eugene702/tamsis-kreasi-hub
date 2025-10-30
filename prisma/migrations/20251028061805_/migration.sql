/*
  Warnings:

  - The primary key for the `UserProject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserProject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserProjectCategories" DROP CONSTRAINT "UserProjectCategories_userProjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProjectViews" DROP CONSTRAINT "UserProjectViews_userProjectId_fkey";

-- AlterTable
ALTER TABLE "UserProject" DROP CONSTRAINT "UserProject_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UserProject_pkey" PRIMARY KEY ("domain");

-- AddForeignKey
ALTER TABLE "UserProjectCategories" ADD CONSTRAINT "UserProjectCategories_userProjectId_fkey" FOREIGN KEY ("userProjectId") REFERENCES "UserProject"("domain") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectViews" ADD CONSTRAINT "UserProjectViews_userProjectId_fkey" FOREIGN KEY ("userProjectId") REFERENCES "UserProject"("domain") ON DELETE CASCADE ON UPDATE CASCADE;
