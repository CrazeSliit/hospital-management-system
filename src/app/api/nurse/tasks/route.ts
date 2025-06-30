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

    // For now, return mock tasks since we don't have a tasks table
    const mockTasks = [
      {
        id: '1',
        patientName: 'John Doe',
        task: 'Check vitals and update records',
        time: '09:00 AM',
        priority: 'high' as const,
        completed: false,
      },
      {
        id: '2',
        patientName: 'Jane Smith',
        task: 'Administer medication',
        time: '10:30 AM',
        priority: 'medium' as const,
        completed: false,
      },
      {
        id: '3',
        patientName: 'Bob Johnson',
        task: 'Wound dressing change',
        time: '11:15 AM',
        priority: 'high' as const,
        completed: true,
      },
      {
        id: '4',
        patientName: 'Alice Brown',
        task: 'Patient education session',
        time: '02:00 PM',
        priority: 'low' as const,
        completed: false,
      },
      {
        id: '5',
        patientName: 'Charlie Wilson',
        task: 'Pre-surgery preparation',
        time: '03:30 PM',
        priority: 'high' as const,
        completed: false,
      },
    ];

    return NextResponse.json(mockTasks);
  } catch (error) {
    console.error('Error fetching nurse tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
