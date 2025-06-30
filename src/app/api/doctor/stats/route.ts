import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Skip during build time
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Build time skip' }, { status: 503 });
    }

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

    // Get today's appointments count
    const todayAppointments = await prisma.appointment.count({
      where: {
        doctorId: doctor.id,
        appointmentDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    // Get total patients count (unique patients from appointments)
    const totalPatients = await prisma.appointment.groupBy({
      by: ['patientId'],
      where: {
        doctorId: doctor.id,
      },
      _count: {
        patientId: true,
      },
    });

    // Get pending reports count (prescriptions without follow-up)
    const pendingReports = await prisma.prescription.count({
      where: {
        doctorId: doctor.id,
        validUntil: {
          gte: new Date(),
        },
      },
    });

    // Calculate consultation hours (estimate based on appointments)
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthAppointments = await prisma.appointment.count({
      where: {
        doctorId: doctor.id,
        appointmentDate: {
          gte: thisMonthStart,
        },
        status: 'COMPLETED',
      },
    });

    const stats = {
      todayAppointments,
      totalPatients: totalPatients.length,
      pendingReports,
      consultationHours: thisMonthAppointments * 0.5, // Assuming 30 minutes per appointment
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching doctor stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
