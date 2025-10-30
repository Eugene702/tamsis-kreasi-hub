import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { SkillGroups, Skills } from './skill';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash('password', 10);
  await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@gmail.com' },
      update: {},
      create: {
        email: 'admin@gmail.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    }),

    prisma.skill.createMany({ data: Skills, skipDuplicates: true })
  ])
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });