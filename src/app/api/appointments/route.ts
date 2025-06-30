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

    // Get appointments for the current user
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: userId,
      },
      include: {
        doctor: {
          select: {
            name: true,
            specialization: true,
          },
        },
      },
      orderBy: {
        appointmentDate: 'asc',
      },
    });

    // Transform the data for the frontend
    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment.id,
      doctorName: appointment.doctor.name,
      department: appointment.doctor.specialization,
      date: appointment.appointmentDate.toLocaleDateString(),
      time: appointment.appointmentDate.toLocaleTimeString(),
      status: appointment.status.toLowerCase(),
    }));

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}
