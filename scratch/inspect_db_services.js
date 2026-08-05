const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany();
  console.log('--- ALL DB SERVICES ---');
  for (const s of services) {
    console.log(`ID: ${s.id} | Name: ${s.name} | Slug: ${s.slug}`);
    console.log(`  roomImage: ${s.roomImage}`);
    console.log(`  gallery: ${s.gallery}`);
    console.log('---');
  }
  await prisma.$disconnect();
}

main();
