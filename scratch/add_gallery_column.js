const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Adding gallery column to Service table...');
    await prisma.$executeRawUnsafe(`ALTER TABLE \`Service\` ADD COLUMN \`gallery\` LONGTEXT NULL;`);
    console.log('Sukses menambahkan kolom gallery ke tabel Service!');
  } catch (err) {
    if (err.message && (err.message.includes('Duplicate column name') || err.message.includes('1060'))) {
      console.log('Kolom gallery sudah ada di tabel Service.');
    } else {
      console.error('Error saat alter table:', err.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
