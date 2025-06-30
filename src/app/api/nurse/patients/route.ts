import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface VitalsData {
  temperature?: string;
  bloodPressure?: string;
  heartRate?: string;
  oxygenSaturation?: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'NURSE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get nurse record
    const nurse = await prisma.nurse.findUnique({
      where: { userId },
    });

    if (!nurse) {
      return NextResponse.json({ error: 'Nurse not found' }, { status: 404 });
    }

    // Get assigned patients from nurse assignments
    const assignments = await prisma.nurseAssignment.findMany({
      where: {
        nurseId: nurse.id,
      },
      include: {
        appointment: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data for the frontend
    const patients = assignments.map((assignment) => {
      const vitalsData = assignment.vitals as VitalsData;
      return {
        id: assignment.appointment.patient.id,
        name: `${assignment.appointment.patient.user.firstName} ${assignment.appointment.patient.user.lastName}`,
        roomNumber: `${Math.floor(Math.random() * 400) + 100}`, // Mock room number
        condition: assignment.appointment.medicalRecord?.diagnosis || 'General care',
        priority: Math.random() > 0.8 ? 'critical' : Math.random() > 0.6 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        vitals: {
          temperature: vitalsData?.temperature || '98.6°F',
          bloodPressure: vitalsData?.bloodPressure || '120/80',
          heartRate: vitalsData?.heartRate || '72 bpm',
          oxygenSaturation: vitalsData?.oxygenSaturation || '98%',
        },
        lastCheckup: assignment.updatedAt.toLocaleDateString(),
        medications: ['Medication A', 'Medication B'], // Mock medications
      };
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching nurse patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}
