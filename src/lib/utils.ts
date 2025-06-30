import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import twilio from 'twilio'
import { format, addDays, isBefore, parseISO } from 'date-fns'

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12)
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

// JWT utilities
export const generateToken = (payload: Record<string, unknown>, expiresIn: string = '24h'): string => {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET!, { expiresIn })
}

export const verifyToken = (token: string): Record<string, unknown> | null => {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!) as Record<string, unknown>
  } catch {
    return null
  }
}

// Email utilities
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD
    }
  })
}

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<void> => {
  try {
    const transporter = createEmailTransporter()
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text
    })
  } catch (error) {
    console.error('Email sending failed:', error)
    throw new Error('Failed to send email')
  }
}

// SMS utilities
import { Twilio } from 'twilio';

let twilioClient: Twilio | null = null;

// Only initialize Twilio if credentials are properly configured
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

export const sendSMS = async (to: string, message: string): Promise<void> => {
  try {
    if (!twilioClient) {
      console.log('SMS not configured, skipping SMS sending');
      return;
    }
    
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    })
  } catch (error) {
    console.error('SMS sending failed:', error)
    throw new Error('Failed to send SMS')
  }
}

// Date and time utilities
export const formatDate = (date: Date, formatString: string = 'PPP'): string => {
  return format(date, formatString)
}

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':')
  const date = new Date()
  date.setHours(parseInt(hours), parseInt(minutes))
  return format(date, 'h:mm a')
}

export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  slotDuration: number = 30
): string[] => {
  const slots: string[] = []
  const start = parseISO(`2000-01-01T${startTime}:00`)
  const end = parseISO(`2000-01-01T${endTime}:00`)
  
  let current = start
  while (isBefore(current, end)) {
    slots.push(format(current, 'HH:mm'))
    current = addDays(current, slotDuration / (24 * 60))
  }
  
  return slots
}

export const isTimeSlotAvailable = (
  slot: string,
  bookedSlots: string[]
): boolean => {
  return !bookedSlots.includes(slot)
}

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]+$/
  return phoneRegex.test(phone)
}

export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// File upload utilities
export const generateUploadPath = (fileName: string, folder: string = 'uploads'): string => {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = fileName.split('.').pop()
  return `${folder}/${timestamp}_${randomString}.${extension}`
}

// Notification templates
interface EmailTemplateData {
  patientName?: string
  doctorName?: string
  date?: string
  time?: string
  type?: string
  message?: string
}

export const getEmailTemplate = (type: string, data: EmailTemplateData): { subject: string; html: string } => {
  switch (type) {
    case 'APPOINTMENT_CONFIRMATION':
      return {
        subject: 'Appointment Confirmation - Thysia Medical Center',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Appointment Confirmed</h2>
            <p>Dear ${data.patientName},</p>
            <p>Your appointment has been confirmed with the following details:</p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Doctor:</strong> Dr. ${data.doctorName}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Type:</strong> ${data.type}</p>
            </div>
            <p>Please arrive 15 minutes before your appointment time.</p>
            <p>Best regards,<br>Thysia Medical Center</p>
          </div>
        `
      }
    
    case 'APPOINTMENT_REMINDER':
      return {
        subject: 'Appointment Reminder - Tomorrow',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Appointment Reminder</h2>
            <p>Dear ${data.patientName},</p>
            <p>This is a reminder for your appointment tomorrow:</p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Doctor:</strong> Dr. ${data.doctorName}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
            </div>
            <p>Please arrive 15 minutes early.</p>
            <p>Best regards,<br>Thysia Medical Center</p>
          </div>
        `
      }
    
    default:
      return {
        subject: 'Notification from Thysia Medical Center',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Notification</h2>
            <p>${data.message}</p>
            <p>Best regards,<br>Thysia Medical Center</p>
          </div>
        `
      }
  }
}

// API response utilities
export const createSuccessResponse = (data: unknown, message: string = 'Success') => {
  return {
    success: true,
    message,
    data
  }
}

export const createErrorResponse = (message: string, statusCode: number = 400) => {
  return {
    success: false,
    message,
    statusCode
  }
}

// Random utilities
export const generateRandomString = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const generateAppointmentId = (): string => {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `APT-${timestamp}-${randomPart}`.toUpperCase()
}

// Export all utilities
export const utils = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  sendEmail,
  sendSMS,
  formatDate,
  formatTime,
  generateTimeSlots,
  isTimeSlotAvailable,
  validateEmail,
  validatePhone,
  validatePassword,
  generateUploadPath,
  getEmailTemplate,
  createSuccessResponse,
  createErrorResponse,
  generateRandomString,
  generateAppointmentId
}
