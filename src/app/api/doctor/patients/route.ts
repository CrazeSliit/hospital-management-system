import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get doctor record
    const doctor = await prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Get recent patients (from recent appointments)
    const recentAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: 'COMPLETED',
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        medicalRecord: {
          select: {
            diagnosis: true,
          },
        },
      },
      orderBy: {
        appointmentDate: 'desc',
      },
      take: 10,
    });

    // Transform the data for the frontend
    const patients = recentAppointments.map((appointment) => ({
      id: appointment.patient.id,
      name: `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`,
      condition: appointment.medicalRecord?.diagnosis || 'General consultation',
      lastVisit: appointment.appointmentDate.toLocaleDateString(),
      status: 'stable' as const,
    }));

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}
