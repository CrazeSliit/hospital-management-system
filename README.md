# Hospital Management System

A comprehensive hospital management system built with Next.js, Prisma, and MongoDB.

## Features

- **Patient Dashboard**: Complete CRUD operations for appointments, medical records, prescriptions
- **Doctor Dashboard**: Patient management, appointment scheduling
- **Nurse Dashboard**: Patient vitals, task management
- **Admin Dashboard**: System overview and management
- **Authentication**: Role-based access control
- **Database**: MongoDB with Prisma ORM

## Deployment Instructions

### For Netlify/Vercel Deployment

The application is configured to handle Prisma client generation automatically during deployment. The build process includes:

1. **Automatic Prisma Generation**: The build script includes `prisma generate` 
2. **Binary Targets**: Configured for both local development and production environments
3. **Environment Variables**: Ensure all required environment variables are set

### Required Environment Variables

```env
DATABASE_URL="your-mongodb-connection-string"
NEXTAUTH_URL="your-deployment-url"
NEXTAUTH_SECRET="your-secret-key"
```

### Build Commands

- **Local Development**: `npm run dev`
- **Production Build**: `npm run build`
- **Netlify Build**: Uses automatic `netlify.toml` configuration

### Database Setup

1. Ensure MongoDB database is accessible
2. Prisma client will be generated automatically during build
3. Database connection is tested on startup

### Troubleshooting

#### Prisma Client Issues on Windows
If you encounter permission errors with Prisma generation on Windows:
1. This is a known Windows-specific issue
2. The application will still deploy successfully on cloud platforms
3. Use WSL2 or deploy directly to avoid local Windows permission issues

#### Build Failures
1. Ensure all environment variables are properly set
2. Check MongoDB connection string format
3. Verify Node.js version compatibility (v18 recommended)

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start development server: `npm run dev`

## Production Deployment

The application is optimized for deployment on:
- Netlify
- Vercel  
- Any Node.js hosting platform

The build process automatically handles:
- Prisma client generation
- Next.js optimization
- Static asset compilation

## API Endpoints

- `/api/appointments` - Appointment CRUD operations
- `/api/medical-records` - Medical records management
- `/api/prescriptions` - Prescription management
- `/api/vitals` - Patient vitals tracking

## Database Schema

The application uses a comprehensive Prisma schema with:
- User management (Patients, Doctors, Nurses, Admins)
- Appointment scheduling
- Medical records
- Prescription tracking
- Payment processing
- Notification system

## Security Features

- NextAuth.js authentication
- Role-based access control
- Secure API routes
- Environment variable protection
