const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function createAdminUsers() {
  try {
    console.log('Creating admin users...');

    // Admin user 1 - Main Administrator
    const adminEmail1 = 'admin@hospital.com';
    const adminPassword1 = 'admin123';
    const hashedPassword1 = await hashPassword(adminPassword1);

    const adminUser1 = await prisma.user.upsert({
      where: { email: adminEmail1 },
      update: {},
      create: {
        email: adminEmail1,
        password: hashedPassword1,
        role: 'ADMIN',
        firstName: 'System',
        lastName: 'Administrator',
        phone: '+1-555-0001',
        dateOfBirth: new Date('1980-01-01'),
        address: '123 Hospital Admin St, Medical City, MC 12345',
        isActive: true,
      },
    });

    await prisma.admin.upsert({
      where: { userId: adminUser1.id },
      update: {},
      create: {
        userId: adminUser1.id,
        permissions: [
          'MANAGE_USERS',
          'MANAGE_DOCTORS',
          'MANAGE_NURSES',
          'MANAGE_PATIENTS',
          'VIEW_ANALYTICS',
          'MANAGE_SYSTEM',
          'MANAGE_PAYMENTS',
          'MANAGE_APPOINTMENTS',
        ],
        department: 'Administration',
      },
    });

    // Admin user 2 - Medical Administrator
    const adminEmail2 = 'medical.admin@hospital.com';
    const adminPassword2 = 'medadmin123';
    const hashedPassword2 = await hashPassword(adminPassword2);

    const adminUser2 = await prisma.user.upsert({
      where: { email: adminEmail2 },
      update: {},
      create: {
        email: adminEmail2,
        password: hashedPassword2,
        role: 'ADMIN',
        firstName: 'Medical',
        lastName: 'Administrator',
        phone: '+1-555-0002',
        dateOfBirth: new Date('1975-06-15'),
        address: '456 Medical Admin Ave, Health City, HC 67890',
        isActive: true,
      },
    });

    await prisma.admin.upsert({
      where: { userId: adminUser2.id },
      update: {},
      create: {
        userId: adminUser2.id,
        permissions: [
          'MANAGE_DOCTORS',
          'MANAGE_NURSES',
          'VIEW_ANALYTICS',
          'MANAGE_APPOINTMENTS',
          'MANAGE_MEDICAL_RECORDS',
        ],
        department: 'Medical Administration',
      },
    });

    // Create a sample doctor
    const doctorEmail = 'dr.smith@hospital.com';
    const doctorPassword = 'doctor123';
    const hashedDoctorPassword = await hashPassword(doctorPassword);

    const doctorUser = await prisma.user.upsert({
      where: { email: doctorEmail },
      update: {},
      create: {
        email: doctorEmail,
        password: hashedDoctorPassword,
        role: 'DOCTOR',
        firstName: 'John',
        lastName: 'Smith',
        phone: '+1-555-1001',
        dateOfBirth: new Date('1975-03-20'),
        address: '789 Doctor Lane, Medical District, MD 11111',
        isActive: true,
      },
    });

    await prisma.doctor.upsert({
      where: { userId: doctorUser.id },
      update: {},
      create: {
        userId: doctorUser.id,
        licenseNumber: 'MD-001-2025',
        specialties: ['Cardiology', 'Internal Medicine'],
        qualification: 'MD, PhD in Cardiology',
        experience: 15,
        consultationFee: 200.00,
        biography: 'Dr. John Smith is a leading cardiologist with over 15 years of experience in treating heart conditions.',
        languages: ['English', 'Spanish'],
        isAvailable: true,
        rating: 4.8,
        totalReviews: 156,
      },
    });

    // Create a sample nurse
    const nurseEmail = 'nurse.johnson@hospital.com';
    const nursePassword = 'nurse123';
    const hashedNursePassword = await hashPassword(nursePassword);

    const nurseUser = await prisma.user.upsert({
      where: { email: nurseEmail },
      update: {},
      create: {
        email: nurseEmail,
        password: hashedNursePassword,
        role: 'NURSE',
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '+1-555-2001',
        dateOfBirth: new Date('1985-08-10'),
        address: '321 Nurse Street, Care City, CC 22222',
        isActive: true,
      },
    });

    await prisma.nurse.upsert({
      where: { userId: nurseUser.id },
      update: {},
      create: {
        userId: nurseUser.id,
        licenseNumber: 'RN-001-2025',
        department: 'Cardiology',
        shift: 'morning',
      },
    });

    // Create a sample patient
    const patientEmail = 'patient.doe@email.com';
    const patientPassword = 'patient123';
    const hashedPatientPassword = await hashPassword(patientPassword);

    const patientUser = await prisma.user.upsert({
      where: { email: patientEmail },
      update: {},
      create: {
        email: patientEmail,
        password: hashedPatientPassword,
        role: 'PATIENT',
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '+1-555-3001',
        dateOfBirth: new Date('1990-12-05'),
        address: '987 Patient Road, Health Town, HT 33333',
        isActive: true,
      },
    });

    await prisma.patient.upsert({
      where: { userId: patientUser.id },
      update: {},
      create: {
        userId: patientUser.id,
        emergencyContact: 'John Doe (Husband) - +1-555-3002',
        bloodType: 'O+',
        allergies: ['Penicillin', 'Shellfish'],
        medicalHistory: 'Hypertension, managed with medication. No major surgeries.',
        insurance: 'Blue Cross Blue Shield',
        insuranceNumber: 'BCBS-123456789',
      },
    });

    console.log('✅ Admin users created successfully!');
    console.log('\n🔐 LOGIN CREDENTIALS:');
    console.log('\n👑 SYSTEM ADMINISTRATOR:');
    console.log(`   Email: ${adminEmail1}`);
    console.log(`   Password: ${adminPassword1}`);
    console.log(`   Role: Admin (Full Access)`);
    
    console.log('\n🏥 MEDICAL ADMINISTRATOR:');
    console.log(`   Email: ${adminEmail2}`);
    console.log(`   Password: ${adminPassword2}`);
    console.log(`   Role: Admin (Medical Focus)`);

    console.log('\n👨‍⚕️ SAMPLE DOCTOR:');
    console.log(`   Email: ${doctorEmail}`);
    console.log(`   Password: ${doctorPassword}`);
    console.log(`   Role: Doctor`);

    console.log('\n👩‍⚕️ SAMPLE NURSE:');
    console.log(`   Email: ${nurseEmail}`);
    console.log(`   Password: ${nursePassword}`);
    console.log(`   Role: Nurse`);

    console.log('\n🧑‍🦱 SAMPLE PATIENT:');
    console.log(`   Email: ${patientEmail}`);
    console.log(`   Password: ${patientPassword}`);
    console.log(`   Role: Patient`);

    console.log('\n🌐 Access the application at: http://localhost:3000');
    console.log('📝 Use any of the above credentials to sign in and test different role dashboards.');

  } catch (error) {
    console.error('❌ Error creating admin users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUsers().catch(console.error);
