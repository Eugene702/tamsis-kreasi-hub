-- DropForeignKey
ALTER TABLE "public"."StudentUser" DROP CONSTRAINT "StudentUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProject" DROP CONSTRAINT "UserProject_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProjectCategories" DROP CONSTRAINT "UserProjectCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProjectCategories" DROP CONSTRAINT "UserProjectCategories_userProjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProjectViews" DROP CONSTRAINT "UserProjectViews_userProjectId_fkey";

-- AddForeignKey
ALTER TABLE "StudentUser" ADD CONSTRAINT "StudentUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectCategories" ADD CONSTRAINT "UserProjectCategories_userProjectId_fkey" FOREIGN KEY ("userProjectId") REFERENCES "UserProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectCategories" ADD CONSTRAINT "UserProjectCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProjectViews" ADD CONSTRAINT "UserProjectViews_userProjectId_fkey" FOREIGN KEY ("userProjectId") REFERENCES "UserProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
