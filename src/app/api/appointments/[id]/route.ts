import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentDate, startTime, endTime, reason, status } = body;
    const appointmentId = params.id;

    const userId = session.user.id;

    // Find the patient record
    const patient = await prisma.patient.findFirst({
      where: { userId: userId }
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Check if the appointment belongs to the patient
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: patient.id
      }
    });

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...(appointmentDate && { appointmentDate: new Date(appointmentDate) }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(reason && { reason }),
        ...(status && { status: status.toUpperCase() }),
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
      id: updatedAppointment.id,
      doctorName: `${updatedAppointment.doctor.user.firstName} ${updatedAppointment.doctor.user.lastName}`,
      department: updatedAppointment.doctor.specialties[0] || 'General Medicine',
      date: updatedAppointment.appointmentDate.toLocaleDateString(),
      time: `${updatedAppointment.startTime} - ${updatedAppointment.endTime}`,
      status: updatedAppointment.status.toLowerCase(),
      reason: updatedAppointment.reason,
      type: updatedAppointment.type,
      fee: updatedAppointment.consultationFee,
    };

    return NextResponse.json(formattedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointmentId = params.id;
    const userId = session.user.id;

    // Find the patient record
    const patient = await prisma.patient.findFirst({
      where: { userId: userId }
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Check if the appointment belongs to the patient
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: patient.id
      }
    });

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Update appointment status to cancelled instead of deleting
    const cancelledAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CANCELLED' },
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
      id: cancelledAppointment.id,
      doctorName: `${cancelledAppointment.doctor.user.firstName} ${cancelledAppointment.doctor.user.lastName}`,
      department: cancelledAppointment.doctor.specialties[0] || 'General Medicine',
      date: cancelledAppointment.appointmentDate.toLocaleDateString(),
      time: `${cancelledAppointment.startTime} - ${cancelledAppointment.endTime}`,
      status: cancelledAppointment.status.toLowerCase(),
      reason: cancelledAppointment.reason,
      type: cancelledAppointment.type,
      fee: cancelledAppointment.consultationFee,
    };

    return NextResponse.json(formattedAppointment);
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
}
