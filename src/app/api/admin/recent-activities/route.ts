import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock recent activities
    const recentActivities = [
      {
        description: 'New patient registered: John Doe',
        timestamp: '2 hours ago',
        type: 'info',
      },
      {
        description: 'Emergency room capacity reached 95%',
        timestamp: '4 hours ago',
        type: 'warning',
      },
      {
        description: 'System backup completed successfully',
        timestamp: '6 hours ago',
        type: 'info',
      },
      {
        description: 'Critical patient admitted to ICU',
        timestamp: '8 hours ago',
        type: 'critical',
      },
      {
        description: 'Monthly revenue target achieved',
        timestamp: '1 day ago',
        type: 'info',
      },
    ];

    return NextResponse.json(recentActivities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activities' },
      { status: 500 }
    );
  }
}
