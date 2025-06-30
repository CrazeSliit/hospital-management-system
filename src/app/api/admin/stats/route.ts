import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total patients count
    const totalPatients = await prisma.patient.count();

    // Get total doctors count
    const totalDoctors = await prisma.doctor.count();

    // Get total nurses count
    const totalNurses = await prisma.nurse.count();

    // Total staff (doctors + nurses + admins)
    const totalAdmins = await prisma.admin.count();
    const totalStaff = totalDoctors + totalNurses + totalAdmins;

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Get today's appointments count
    const todayAppointments = await prisma.appointment.count({
      where: {
        appointmentDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    // Get pending appointments count
    const pendingAppointments = await prisma.appointment.count({
      where: {
        status: 'SCHEDULED',
      },
    });

    // Calculate revenue from completed appointments this month
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const completedPayments = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        paidAt: {
          gte: thisMonthStart,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const monthlyRevenue = completedPayments._sum.amount || 0;

    // Calculate total revenue
    const totalPayments = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    const totalRevenue = totalPayments._sum.amount || 0;

    // Mock occupancy rate and available beds
    const totalBeds = 200; // Mock total beds
    const occupiedBeds = Math.floor(totalPatients * 0.6); // Assume 60% occupancy
    const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);
    const availableBeds = totalBeds - occupiedBeds;

    const stats = {
      totalPatients,
      totalDoctors,
      totalNurses,
      totalStaff,
      todayAppointments,
      pendingAppointments,
      totalRevenue,
      monthlyRevenue,
      occupancyRate,
      availableBeds,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
