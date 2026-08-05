const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up roomImage for ID 1 and ID 2...');
  await prisma.service.update({
    where: { id: 1 },
    data: { roomImage: null }
  });
  await prisma.service.update({
    where: { id: 2 },
    data: { roomImage: null }
  });
  console.log('Successfully cleaned roomImage!');
  await prisma.$disconnect();
}

main();
