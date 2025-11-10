const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('Available Tugas relations:', Object.keys(prisma.tugas.fields));
console.log('\nTesting if hasilTugasMahasiswa exists...');

// Test query
prisma.tugas.findFirst({
  include: {
    hasilTugasMahasiswa: true
  }
}).then(() => {
  console.log('✅ hasilTugasMahasiswa field exists!');
}).catch((error) => {
  console.log('❌ Error:', error.message);
}).finally(() => {
  prisma.$disconnect();
});
