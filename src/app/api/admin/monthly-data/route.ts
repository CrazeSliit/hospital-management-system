import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock monthly data for the last 6 months
    const monthlyData = [
      { name: 'Jan', patients: 400, revenue: 50000 },
      { name: 'Feb', patients: 450, revenue: 55000 },
      { name: 'Mar', patients: 380, revenue: 48000 },
      { name: 'Apr', patients: 520, revenue: 62000 },
      { name: 'May', patients: 490, revenue: 58000 },
      { name: 'Jun', patients: 530, revenue: 65000 },
    ];

    return NextResponse.json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly data' },
      { status: 500 }
    );
  }
}
