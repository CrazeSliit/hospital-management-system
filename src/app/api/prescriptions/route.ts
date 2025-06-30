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

    // Get prescriptions for the current user
    const prescriptions = await prisma.prescription.findMany({
      where: {
        patientId: userId,
      },
      include: {
        doctor: {
          select: {
            name: true,
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
      doctorName: prescription.doctor.name,
      medications: prescription.medications,
      date: prescription.createdAt.toLocaleDateString(),
      status: prescription.status.toLowerCase(),
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
