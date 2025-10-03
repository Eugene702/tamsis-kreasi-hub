import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash('password', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created/updated:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });