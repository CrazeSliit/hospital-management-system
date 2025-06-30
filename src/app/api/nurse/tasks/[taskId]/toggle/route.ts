import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'NURSE') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = params.taskId;

    // In a real implementation, you would update the task in the database
    // For now, we'll just return success since we're using mock data
    
    return NextResponse.json({ success: true, taskId });
  } catch (error) {
    console.error('Error toggling task:', error);
    return NextResponse.json(
      { error: 'Failed to toggle task' },
      { status: 500 }
    );
  }
}
