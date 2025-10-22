import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findFirst();
  if (existingAdmin) {
    console.log('✅ Admin already exists, skipping seed');
    console.log(`   Existing admin: ${existingAdmin.nama} (${existingAdmin.email})`);
    return;
  }

  // Create super admin
  console.log('🔐 Creating super admin...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const superAdmin = await prisma.admin.create({
    data: {
      nama: 'Super Admin',
      email: 'admin@scholarlink.com',
      password: hashedPassword,
      role: 'super_admin'
    }
  });

  console.log('✅ Super admin created successfully!');
  console.log('📧 Email:', superAdmin.email);
  console.log('🔑 Password: admin123');
  console.log('👑 Role:', superAdmin.role);
  console.log('');
  console.log('🚀 You can now login to the admin dashboard!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  });
