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

    // Get prescriptions for the current patient
    const prescriptions = await prisma.prescription.findMany({
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
    const formattedPrescriptions = prescriptions.map((prescription) => ({
      id: prescription.id,
      doctorName: `${prescription.doctor.user.firstName} ${prescription.doctor.user.lastName}`,
      medications: prescription.medications,
      instructions: prescription.instructions,
      date: prescription.issuedDate.toLocaleDateString(),
      validUntil: prescription.validUntil ? prescription.validUntil.toLocaleDateString() : null,
      status: prescription.validUntil && prescription.validUntil > new Date() ? 'active' : 'expired',
    }));

    return NextResponse.json(formattedPrescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions' },
      { status: 500 }
    );
  }
}
