const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    
    const userCount = await prisma.user.count();
    const adminCount = await prisma.admin.count();
    const doctorCount = await prisma.doctor.count();
    const nurseCount = await prisma.nurse.count();
    const patientCount = await prisma.patient.count();
    
    console.log('✅ Database connection successful!');
    console.log(`📊 Database Summary:`);
    console.log(`   👥 Total Users: ${userCount}`);
    console.log(`   👑 Admins: ${adminCount}`);
    console.log(`   👨‍⚕️ Doctors: ${doctorCount}`);
    console.log(`   👩‍⚕️ Nurses: ${nurseCount}`);
    console.log(`   🧑‍🦱 Patients: ${patientCount}`);
    
    // List all users
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      }
    });
    
    console.log('\n👥 Created Users:');
    users.forEach(user => {
      console.log(`   ${user.role}: ${user.firstName} ${user.lastName} (${user.email})`);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
