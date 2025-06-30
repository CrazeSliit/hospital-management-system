import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPatientData() {
  try {
    console.log('🔍 Testing patient data...');

    // Find the patient
    const patient = await prisma.patient.findFirst({
      where: { 
        user: { 
          email: 'patient.doe@email.com' 
        } 
      },
      include: {
        user: true
      }
    });

    if (!patient) {
      console.error('❌ Patient not found');
      return;
    }

    console.log(`✅ Found patient: ${patient.user.firstName} ${patient.user.lastName}`);

    // Test appointments
    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          include: {
            user: true
          }
        }
      }
    });

    console.log(`📅 Appointments: ${appointments.length}`);
    appointments.forEach(apt => {
      console.log(`  - ${apt.reason} with ${apt.doctor.user.firstName} ${apt.doctor.user.lastName} on ${apt.appointmentDate.toLocaleDateString()}`);
    });

    // Test prescriptions
    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          include: {
            user: true
          }
        }
      }
    });

    console.log(`💊 Prescriptions: ${prescriptions.length}`);
    prescriptions.forEach(pres => {
      console.log(`  - ${pres.medications.length} medications from ${pres.doctor.user.firstName} ${pres.doctor.user.lastName}`);
    });

    // Test medical records
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          include: {
            user: true
          }
        }
      }
    });

    console.log(`📋 Medical Records: ${medicalRecords.length}`);
    medicalRecords.forEach(record => {
      console.log(`  - ${record.diagnosis} by ${record.doctor.user.firstName} ${record.doctor.user.lastName}`);
    });

    // Test vitals
    const nurseAssignments = await prisma.nurseAssignment.findMany({
      where: {
        appointment: {
          patientId: patient.id
        },
        vitals: {
          not: null
        }
      }
    });

    console.log(`🩺 Vitals Records: ${nurseAssignments.length}`);
    nurseAssignments.forEach(assignment => {
      const vitals = assignment.vitals as any;
      console.log(`  - BP: ${vitals.bloodPressure}, HR: ${vitals.heartRate}, Temp: ${vitals.temperature}`);
    });

    console.log('\n✅ All patient data is successfully stored and accessible!');

  } catch (error) {
    console.error('❌ Error testing patient data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPatientData();
