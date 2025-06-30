import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Find the patient record
    const patient = await prisma.patient.findFirst({
      where: { userId: userId }
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Get medical records for the current patient
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data for the frontend
    const formattedRecords = medicalRecords.map((record) => ({
      id: record.id,
      doctorName: `${record.doctor.user.firstName} ${record.doctor.user.lastName}`,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      symptoms: record.symptoms,
      notes: record.notes,
      date: record.createdAt.toLocaleDateString(),
      followUpDate: record.followUpDate ? record.followUpDate.toLocaleDateString() : null,
      attachments: record.attachments,
    }));

    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medical records' },
      { status: 500 }
    );
  }
}
