import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      firstName: string
      lastName: string
      phone: string | null
      profileImage: string | null
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: UserRole
    firstName: string
    lastName: string
    phone: string | null
    profileImage: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    firstName: string
    lastName: string
    phone: string | null
    profileImage: string | null
  }
}

export interface CreateUserData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: Date
  address?: string
  role: UserRole
}

export interface DoctorRegistrationData extends CreateUserData {
  licenseNumber: string
  specialties: string[]
  qualification: string
  experience: number
  consultationFee: number
  biography?: string
  languages: string[]
}

export interface NurseRegistrationData extends CreateUserData {
  licenseNumber: string
  department: string
  shift: string
}

export interface PatientRegistrationData extends CreateUserData {
  emergencyContact?: string
  bloodType?: string
  allergies?: string[]
  medicalHistory?: string
  insurance?: string
  insuranceNumber?: string
}

export interface AppointmentBookingData {
  doctorId: string
  appointmentDate: Date
  startTime: string
  endTime: string
  reason?: string
  symptoms?: string[]
  type: string
}

export interface DoctorScheduleData {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

export interface MedicalRecordData {
  patientId: string
  doctorId: string
  appointmentId?: string
  diagnosis: string
  symptoms: string[]
  treatment: string
  notes?: string
  attachments?: string[]
  followUpDate?: Date
}

export interface PrescriptionData {
  patientId: string
  doctorId: string
  appointmentId?: string
  medications: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }[]
  instructions?: string
  validUntil?: Date
}

export interface NotificationData {
  userId: string
  type: string
  title: string
  message: string
  isEmail?: boolean
  isSMS?: boolean
  metadata?: any
}

export interface PaymentData {
  patientId: string
  appointmentId: string
  amount: number
  currency?: string
  paymentMethod: string
  stripePaymentIntentId?: string
  transactionId?: string
}

export interface ReviewData {
  patientId: string
  doctorId: string
  rating: number
  comment?: string
}

export interface VitalsData {
  bloodPressure?: string
  temperature?: number
  weight?: number
  height?: number
  heartRate?: number
  oxygenSaturation?: number
  notes?: string
}

export interface SystemSettingData {
  key: string
  value: string
  description?: string
}

export interface AuditLogData {
  userId?: string
  action: string
  resource: string
  details?: any
  ipAddress?: string
  userAgent?: string
}
