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

    // Get all available doctors
    const doctors = await prisma.doctor.findMany({
      where: {
        isAvailable: true
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        user: {
          firstName: 'asc'
        }
      }
    });

    // Transform the data for the frontend
    const formattedDoctors = doctors.map((doctor) => ({
      id: doctor.id,
      name: `${doctor.user.firstName} ${doctor.user.lastName}`,
      specialties: doctor.specialties,
      consultationFee: doctor.consultationFee,
      rating: doctor.rating,
      experience: doctor.experience,
    }));

    return NextResponse.json(formattedDoctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
