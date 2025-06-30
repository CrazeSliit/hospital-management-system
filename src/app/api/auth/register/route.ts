import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, validateEmail, validatePassword } from '@/lib/utils';
import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      address,
      role,
      // Role-specific fields
      licenseNumber,
      specialties,
      qualification,
      experience,
      department,
      shift,
      emergencyContact,
      bloodType,
      allergies,
      insurance,
      insuranceNumber,
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { message: passwordValidation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check license number for medical professionals
    if ((role === 'DOCTOR' || role === 'NURSE') && licenseNumber) {
      const existingLicense = await prisma.user.findFirst({
        where: {
          OR: [
            { doctor: { licenseNumber } },
            { nurse: { licenseNumber } },
          ],
        },
      });

      if (existingLicense) {
        return NextResponse.json(
          { message: 'License number already in use' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with role-specific data
    const userData = {
      email,
      password: hashedPassword,
      role: role as UserRole,
      firstName,
      lastName,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      address,
    };

    const user = await prisma.user.create({
      data: userData,
    });

    // Create role-specific profile
    switch (role) {
      case 'PATIENT':
        await prisma.patient.create({
          data: {
            userId: user.id,
            emergencyContact,
            bloodType,
            allergies: allergies || [],
            insurance,
            insuranceNumber,
          },
        });
        break;

      case 'DOCTOR':
        if (!licenseNumber || !qualification || !experience) {
          // Clean up created user if required fields are missing
          await prisma.user.delete({ where: { id: user.id } });
          return NextResponse.json(
            { message: 'Missing required doctor fields' },
            { status: 400 }
          );
        }

        await prisma.doctor.create({
          data: {
            userId: user.id,
            licenseNumber,
            specialties: specialties || [],
            qualification,
            experience: parseInt(experience),
            consultationFee: 0, // Default, can be updated later
            languages: ['English'], // Default
          },
        });
        break;

      case 'NURSE':
        if (!licenseNumber || !department || !shift) {
          // Clean up created user if required fields are missing
          await prisma.user.delete({ where: { id: user.id } });
          return NextResponse.json(
            { message: 'Missing required nurse fields' },
            { status: 400 }
          );
        }

        await prisma.nurse.create({
          data: {
            userId: user.id,
            licenseNumber,
            department,
            shift,
          },
        });
        break;

      case 'ADMIN':
        await prisma.admin.create({
          data: {
            userId: user.id,
            permissions: ['read', 'write'], // Default permissions
          },
        });
        break;

      default:
        // Clean up created user if invalid role
        await prisma.user.delete({ where: { id: user.id } });
        return NextResponse.json(
          { message: 'Invalid role specified' },
          { status: 400 }
        );
    }

    // Create initial notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'APPOINTMENT_CONFIRMATION',
        title: 'Welcome to Thysia Medical Center!',
        message: `Welcome ${firstName}! Your account has been created successfully. You can now book appointments and access our services.`,
        isEmail: false,
        isSMS: false,
      },
    });

    // Return success response (without password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
