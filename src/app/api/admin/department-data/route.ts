import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock department data
    const departmentData = [
      { name: 'Cardiology', value: 120 },
      { name: 'Orthopedics', value: 95 },
      { name: 'Pediatrics', value: 85 },
      { name: 'Emergency', value: 150 },
      { name: 'General', value: 110 },
    ];

    return NextResponse.json(departmentData);
  } catch (error) {
    console.error('Error fetching department data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch department data' },
      { status: 500 }
    );
  }
}
