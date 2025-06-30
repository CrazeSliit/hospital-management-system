import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Get total assigned patients count
    const totalPatients = await prisma.nurseAssignment.count({
      where: {
        nurseId: nurse.id,
      },
    });

    // Mock critical patients count (in real scenario, this would be based on patient conditions)
    const criticalPatients = Math.floor(totalPatients * 0.2); // Assume 20% are critical

    // Mock tasks stats
    const pendingTasks = 4; // From mock tasks
    const completedTasks = 1; // From mock tasks

    const stats = {
      totalPatients,
      criticalPatients,
      pendingTasks,
      completedTasks,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching nurse stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
