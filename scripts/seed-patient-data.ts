import { PrismaClient, AppointmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPatientData() {
  try {
    console.log('🌱 Starting to seed patient data...');

    // Get existing users
    const patient = await prisma.user.findFirst({
      where: { email: 'patient.doe@email.com' }
    });
    
    const doctor = await prisma.user.findFirst({
      where: { email: 'dr.smith@hospital.com' }
    });

    const nurse = await prisma.user.findFirst({
      where: { email: 'nurse.johnson@hospital.com' }
    });

    if (!patient || !doctor || !nurse) {
      console.error('❌ Required users not found. Please run create-admin-users script first.');
      return;
    }

    console.log('👤 Found users:', {
      patient: patient.email,
      doctor: doctor.email,
      nurse: nurse.email
    });

    // Get patient and doctor records
    const patientRecord = await prisma.patient.findFirst({
      where: { userId: patient.id }
    });
    
    const doctorRecord = await prisma.doctor.findFirst({
      where: { userId: doctor.id }
    });

    if (!patientRecord || !doctorRecord) {
      console.error('❌ Patient or Doctor records not found.');
      return;
    }

    // Create appointments
    const appointments = [
      {
        patientId: patientRecord.id,
        doctorId: doctorRecord.id,
        appointmentDate: new Date('2025-07-05T10:00:00'),
        startTime: '10:00',
        endTime: '10:30',
        type: 'consultation',
        consultationFee: 150.0,
        reason: 'Regular checkup and blood pressure monitoring',
        status: 'SCHEDULED' as const,
        notes: 'Annual physical examination'
      },
      {
        patientId: patientRecord.id,
        doctorId: doctorRecord.id,
        appointmentDate: new Date('2025-06-25T14:30:00'),
        startTime: '14:30',
        endTime: '15:00',
        type: 'follow-up',
        consultationFee: 100.0,
        reason: 'Follow-up consultation for medication adjustment',
        status: 'COMPLETED' as const,
        notes: 'Patient responded well to treatment'
      },
      {
        patientId: patientRecord.id,
        doctorId: doctorRecord.id,
        appointmentDate: new Date('2025-07-12T09:15:00'),
        startTime: '09:15',
        endTime: '09:45',
        type: 'consultation',
        consultationFee: 200.0,
        reason: 'Cardiology consultation',
        status: 'SCHEDULED' as const,
        notes: 'Referred for heart palpitations'
      },
      {
        patientId: patientRecord.id,
        doctorId: doctorRecord.id,
        appointmentDate: new Date('2025-06-20T11:00:00'),
        startTime: '11:00',
        endTime: '11:30',
        type: 'emergency',
        consultationFee: 250.0,
        reason: 'Emergency consultation',
        status: 'COMPLETED' as const,
        notes: 'Treated for minor injury'
      }
    ];

    const createdAppointments = [];
    for (const appointmentData of appointments) {
      const appointment = await prisma.appointment.create({
        data: appointmentData
      });
      createdAppointments.push(appointment);
      console.log(`📅 Created appointment: ${appointment.reason}`);
    }

    // Create prescriptions
    const prescriptions = [
      {
        patientId: patientRecord.id,
        doctorId: doctorRecord.id,
        medications: [
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning' },
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', instructions: 'Take with meals' }
        ],
        instructions: 'Take Lisinopril in the morning. Take Metformin with breakfast and dinner.',
        issuedDate: new Date('2025-06-25'),
        validUntil: new Date('2025-07-25')
      },
      {
        patientId: patientRecord.id,
        doctorId: doctorRecord.id,
        medications: [
          { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', duration: '7 days', instructions: 'Maximum 3 times daily with food' }
        ],
        instructions: 'Take with food to prevent stomach upset. Do not exceed 3 doses per day.',
        issuedDate: new Date('2025-06-20'),
        validUntil: new Date('2025-06-27')
      },
      {
        patientId: patientRecord.id,
        doctorId: doctorRecord.id,
        medications: [
          { name: 'Vitamin D3', dosage: '1000IU', frequency: 'Once daily', duration: '180 days', instructions: 'Take with meals' },
          { name: 'Omega-3 Fish Oil', dosage: '1000mg', frequency: 'Twice daily', duration: '180 days', instructions: 'Take with meals' }
        ],
        instructions: 'Take both supplements with meals for better absorption.',
        issuedDate: new Date('2025-06-01'),
        validUntil: new Date('2025-12-01')
      }
    ];

    for (const prescriptionData of prescriptions) {
      const prescription = await prisma.prescription.create({
        data: prescriptionData
      });
      console.log(`💊 Created prescription: ${prescription.medications.join(', ')}`);
    }

    // Create medical records
    const medicalRecords = [
      {
        patientId: patientRecord.id,
        doctorId: doctorRecord.id,
        diagnosis: 'Hypertension (Stage 1)',
        treatment: 'Lifestyle modifications and medication',
        symptoms: ['elevated blood pressure', 'mild headaches'],
        notes: 'Patient in good overall health. Blood pressure slightly elevated. Recommended lifestyle changes and monitoring.',
        attachments: []
      },
      {
        patientId: patientRecord.id,
        doctorId: doctorRecord.id,
        diagnosis: 'Dyslipidemia',
        treatment: 'Dietary changes and cholesterol monitoring',
        symptoms: ['elevated cholesterol levels'],
        notes: 'Complete Blood Count: Normal. Cholesterol levels: LDL 145 mg/dL (slightly elevated), HDL 55 mg/dL (normal). Recommended dietary changes.',
        attachments: []
      },
      {
        patientId: patientRecord.id,
        doctorId: doctorRecord.id,
        diagnosis: 'Minor laceration - left forearm',
        treatment: 'Wound cleaning, suturing, and tetanus prophylaxis',
        symptoms: ['2cm laceration', 'minor bleeding'],
        notes: 'Patient presented with 2cm laceration on left forearm. Wound cleaned and sutured. Tetanus shot administered. Follow-up in 1 week for suture removal.',
        attachments: []
      },
      {
        patientId: patientRecord.id,
        doctorId: doctorRecord.id,
        diagnosis: 'Palpitations - investigation required',
        treatment: 'Cardiology referral and Holter monitoring',
        symptoms: ['heart palpitations', 'occasional chest discomfort'],
        notes: 'Patient reports occasional heart palpitations. ECG normal. Referred to cardiology for further evaluation. Holter monitor recommended.',
        followUpDate: new Date('2025-07-12'),
        attachments: []
      }
    ];

    for (const recordData of medicalRecords) {
      const record = await prisma.medicalRecord.create({
        data: recordData
      });
      console.log(`📋 Created medical record: ${record.diagnosis}`);
    }

    // Get nurse record
    const nurseRecord = await prisma.nurse.findFirst({
      where: { userId: nurse.id }
    });

    if (!nurseRecord) {
      console.error('❌ Nurse record not found.');
      return;
    }

    // Create nurse assignments with vitals
    const completedAppointments = createdAppointments.filter(apt => apt.status === 'COMPLETED');
    let assignmentCount = 0;
    
    for (const appointment of completedAppointments) {
      await prisma.nurseAssignment.create({
        data: {
          nurseId: nurseRecord.id,
          appointmentId: appointment.id,
          patientArrived: true,
          arrivalTime: new Date(appointment.appointmentDate.getTime() - 15 * 60000), // 15 minutes before appointment
          vitals: {
            bloodPressure: (appointment.reason && appointment.reason.includes('blood pressure')) ? '138/88' : '125/82',
            heartRate: '75 bpm',
            temperature: '98.6°F',
            weight: '72 kg',
            height: '170 cm',
            oxygenSaturation: '98%'
          },
          notes: 'Patient stable. Vital signs recorded and documented.'
        }
      });
      assignmentCount++;
      console.log(`👩‍⚕️ Created nurse assignment for appointment: ${appointment.reason || 'appointment'}`);
    }

    console.log('\n✅ Patient data seeding completed successfully!');
    console.log('📊 Created:');
    console.log(`   📅 ${appointments.length} appointments`);
    console.log(`   💊 ${prescriptions.length} prescriptions`);
    console.log(`   📋 ${medicalRecords.length} medical records`);
    console.log(`   👩‍⚕️ ${assignmentCount} nurse assignments with vitals`);

  } catch (error) {
    console.error('❌ Error seeding patient data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPatientData();
