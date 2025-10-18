-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentUserSkills" (
    "studentUserId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "StudentUserSkills_pkey" PRIMARY KEY ("studentUserId","skillId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- AddForeignKey
ALTER TABLE "StudentUserSkills" ADD CONSTRAINT "StudentUserSkills_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "StudentUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentUserSkills" ADD CONSTRAINT "StudentUserSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
