import { z } from 'zod'

const currentYear = new Date().getFullYear()

export const step1Schema = z.object({
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  model: z.string().min(1, 'Model is required'),
  year: z
    .number({ invalid_type_error: 'Year must be a number' })
    .int()
    .min(1886, 'Year must be at least 1886')
    .max(currentYear + 1, `Year cannot exceed ${currentYear + 1}`),
  vehicleType: z.enum(['ELECTRIC', 'SUV', 'TRUCK', 'MOTORCYCLE', 'BUS', 'VAN', 'PICKUP', 'OTHER'],
    { errorMap: () => ({ message: 'Select a valid vehicle type' }) }),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'GAS', 'OTHER'],
    { errorMap: () => ({ message: 'Select a valid fuel type' }) }),
  bodyType: z.string().min(1, 'Body type is required'),
  color: z.string().min(1, 'Color is required'),
  engineCapacity: z
    .number({ invalid_type_error: 'Engine capacity must be a number' })
    .int()
    .min(1, 'Engine capacity must be greater than 0'),
  seatingCapacity: z
    .number({ invalid_type_error: 'Seating capacity must be a number' })
    .int()
    .min(1, 'Seating capacity must be at least 1'),
  odometerReading: z
    .number({ invalid_type_error: 'Odometer reading must be a number' })
    .int()
    .min(0, 'Odometer reading must be 0 or greater'),
  purpose: z.enum(['PERSONAL', 'COMMERCIAL', 'TAXI', 'GOVERNMENT'],
    { errorMap: () => ({ message: 'Select a valid purpose' }) }),
  status: z.enum(['NEW', 'USED', 'REBUILT'],
    { errorMap: () => ({ message: 'Select a valid status' }) }),
})

export const step2Schema = z.object({
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerType: z.enum(['INDIVIDUAL', 'COMPANY', 'NGO', 'GOVERNMENT'],
    { errorMap: () => ({ message: 'Select a valid owner type' }) }),
  nationalId: z.string().regex(/^\d{16}$/, 'National ID must be exactly 16 digits'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  email: z.string().email('Must be a valid email address'),
  address: z.string().min(1, 'Address is required'),
  companyRegNumber: z.string().optional(),
  passportNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.ownerType === 'COMPANY' && !data.companyRegNumber) {
    ctx.addIssue({
      path: ['companyRegNumber'],
      code: z.ZodIssueCode.custom,
      message: 'Company registration number is required for companies',
    })
  }
})

export const step3Schema = z.object({
  plateNumber: z
    .string()
    .regex(/^(R[A-Z]{2}|GR|CD)\s?\d{3}\s?[A-Z]?$/i, 'Invalid Rwandan plate number'),
  plateType: z.enum(['PRIVATE', 'COMMERCIAL', 'GOVERNMENT', 'DIPLOMATIC', 'PERSONALIZED'],
    { errorMap: () => ({ message: 'Select a valid plate type' }) }),
  registrationDate: z.string().min(1, 'Registration date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  registrationStatus: z.enum(['ACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING'],
    { errorMap: () => ({ message: 'Select a valid registration status' }) }),
  customsRef: z.string().min(1, 'Customs reference is required'),
  proofOfOwnership: z.string().min(1, 'Proof of ownership is required'),
  roadworthyCert: z.string().min(1, 'Roadworthy certificate is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  insuranceCompany: z.string().min(1, 'Insurance company is required'),
  insuranceType: z.string().min(1, 'Insurance type is required'),
  insuranceExpiryDate: z.string().min(1, 'Insurance expiry date is required'),
  insuranceStatus: z.enum(['ACTIVE', 'SUSPENDED', 'EXPIRED'],
    { errorMap: () => ({ message: 'Select a valid insurance status' }) }),
}).superRefine((data, ctx) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (data.expiryDate) {
    const expiry = new Date(data.expiryDate)
    if (expiry < today) {
      ctx.addIssue({
        path: ['expiryDate'],
        code: z.ZodIssueCode.custom,
        message: 'Expiry date cannot be in the past',
      })
    }
  }

  if (data.insuranceExpiryDate) {
    const insExpiry = new Date(data.insuranceExpiryDate)
    if (insExpiry < today) {
      ctx.addIssue({
        path: ['insuranceExpiryDate'],
        code: z.ZodIssueCode.custom,
        message: 'Insurance expiry date cannot be in the past',
      })
    }
  }
})