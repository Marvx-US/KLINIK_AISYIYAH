const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing raw SQL update on Service table...');
    const result = await prisma.$executeRawUnsafe(
      `UPDATE Service SET gallery = ? WHERE id = ?`,
      JSON.stringify(['/uploads/test.jpg']),
      1
    );
    console.log('SQL update success! Affected rows:', result);
  } catch (err) {
    console.error('SQL update failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
