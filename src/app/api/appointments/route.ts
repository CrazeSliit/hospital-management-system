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

    // Get appointments for the current patient
    const appointments = await prisma.appointment.findMany({
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
        appointmentDate: 'asc',
      },
    });

    // Transform the data for the frontend
    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment.id,
      doctorName: `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
      department: appointment.doctor.specialties[0] || 'General Medicine',
      date: appointment.appointmentDate.toLocaleDateString(),
      time: `${appointment.startTime} - ${appointment.endTime}`,
      status: appointment.status.toLowerCase(),
      reason: appointment.reason,
      type: appointment.type,
      fee: appointment.consultationFee,
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { doctorId, appointmentDate, startTime, endTime, reason, type = 'consultation' } = body;

    // Validate required fields
    if (!doctorId || !appointmentDate || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = session.user.id;

    // Find the patient record
    const patient = await prisma.patient.findFirst({
      where: { userId: userId }
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Find the doctor record
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctorId,
        appointmentDate: new Date(appointmentDate),
        startTime,
        endTime,
        type,
        reason,
        status: 'SCHEDULED',
        consultationFee: doctor.consultationFee,
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
    });

    // Format the response
    const formattedAppointment = {
      id: appointment.id,
      doctorName: `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
      department: appointment.doctor.specialties[0] || 'General Medicine',
      date: appointment.appointmentDate.toLocaleDateString(),
      time: `${appointment.startTime} - ${appointment.endTime}`,
      status: appointment.status.toLowerCase(),
      reason: appointment.reason,
      type: appointment.type,
      fee: appointment.consultationFee,
    };

    return NextResponse.json(formattedAppointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
