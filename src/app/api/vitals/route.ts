import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface VitalsData {
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  weight?: string;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get latest vitals for the current user from nurse assignments
    const latestAssignment = await prisma.nurseAssignment.findFirst({
      where: {
        appointment: {
          patientId: userId,
        },
        vitals: {
          not: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Return default values if no vitals found
    const vitalsData = latestAssignment?.vitals as VitalsData;
    const vitals = vitalsData ? {
      bloodPressure: vitalsData.bloodPressure || '120/80',
      heartRate: vitalsData.heartRate || '72 bpm',
      temperature: vitalsData.temperature || '98.6°F',
      weight: vitalsData.weight || '70 kg',
    } : {
      bloodPressure: '120/80',
      heartRate: '72 bpm',
      temperature: '98.6°F',
      weight: '70 kg',
    };

    return NextResponse.json(vitals);
  } catch (error) {
    console.error('Error fetching vitals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vitals' },
      { status: 500 }
    );
  }
}
