-- CreateIndex
CREATE INDEX "UserProjectViews_userProjectId_address_createdAt_idx" ON "UserProjectViews"("userProjectId", "address", "createdAt");
