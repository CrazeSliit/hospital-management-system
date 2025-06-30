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

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Get today's appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        appointmentDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                dateOfBirth: true,
              },
            },
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
      patientName: `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`,
      patientAge: appointment.patient.user.dateOfBirth 
        ? Math.floor((Date.now() - new Date(appointment.patient.user.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : 0,
      time: `${appointment.startTime} - ${appointment.endTime}`,
      type: appointment.type,
      status: appointment.status.toLowerCase(),
    }));

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}
