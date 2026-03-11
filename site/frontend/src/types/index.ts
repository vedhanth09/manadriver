// ─── User & Auth ───

export interface User {
  _id: string
  fullName: string
  email: string
  phone: string
  role: "driver" | "customer" | "admin"
  isProfileComplete: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  fullName: string
  email: string
  phone: string
  password: string
  role: "driver" | "customer"
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// ─── Profiles ───

export interface DocumentUpload {
  url: string
  cloudinaryId: string
  uploadedAt: string
}

export interface DriverProfile {
  _id: string
  userId: string
  age: number
  address: string
  city: string
  areas: string[]
  transmissionTypes: TransmissionType[]
  vehicleCategories: VehicleCategory[]
  documents: {
    aadhaar?: DocumentUpload
    pan?: DocumentUpload
    license?: DocumentUpload
  }
  isVerified: boolean
  averageRating: number
  totalJobsCompleted: number
  createdAt: string
  updatedAt: string
}

export interface CustomerProfile {
  _id: string
  userId: string
  city: string
  carDetails?: {
    make: string
    model: string
  }
  preferences?: {
    transmissionType: string
    vehicleCategory: string
  }
  averageRating: number
  createdAt: string
  updatedAt: string
}

// ─── Jobs ───

export type JobType = "hourly" | "temporary" | "permanent"
export type CarType = "hatchback" | "sedan" | "suv" | "luxury"
export type TransmissionType = "manual" | "automatic" | "semi-automatic"
export type VehicleCategory = "hatchback" | "sedan" | "suv" | "luxury"
export type JobStatus = "posted" | "applied" | "accepted" | "in_progress" | "completed" | "cancelled"

export interface Job {
  _id: string
  customerId: string
  jobType: JobType
  city: string
  areas: string[]
  startLocation: string
  endLocation?: string
  carType: CarType
  transmissionType: TransmissionType
  estimatedDuration?: number
  expectedPayout?: number
  durationDays?: number
  dailyPayment?: number
  workingHours?: "12hr" | "24x7"
  monthlySalary?: number
  status: JobStatus
  acceptedDriverId?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

// ─── Applications ───

export type ApplicationStatus = "pending" | "approved" | "rejected" | "withdrawn"
export type DriverResponse = "pending" | "accepted" | "declined"

export interface Application {
  _id: string
  jobId: string
  driverId: string
  appliedAt: string
  status: ApplicationStatus
  driverResponse?: DriverResponse
  createdAt: string
  updatedAt: string
}

// Populated application with job + customer info (for driver's My Applications)
export interface PopulatedApplication {
  _id: string
  jobId: Job & { customerId: { _id: string; fullName: string; email: string; phone: string } }
  driverId: string
  appliedAt: string
  status: ApplicationStatus
  driverResponse?: DriverResponse
  createdAt: string
  updatedAt: string
}

// Enriched applicant returned by getJobApplicants (for customer's applicant list)
export interface EnrichedApplicant {
  _id: string
  jobId: string
  driverId: { _id: string; fullName: string; email: string; phone: string }
  appliedAt: string
  status: ApplicationStatus
  driverResponse?: DriverResponse
  driverProfile: {
    age: number
    city: string
    areas: string[]
    transmissionTypes: TransmissionType[]
    vehicleCategories: VehicleCategory[]
    isVerified: boolean
    averageRating: number
    totalJobsCompleted: number
  } | null
}

// ─── Ratings ───

export interface Rating {
  _id: string
  jobId: string
  raterId: string
  rateeId: string
  rateeRole: "driver" | "customer"
  drivingSkill: number
  professionalBehavior: number
  punctuality: number
  overallRating: number
  review?: string
  createdAt: string
}

// ─── Notifications ───

export type NotificationType =
  | "new_job"
  | "application_approved"
  | "application_rejected"
  | "driver_applied"
  | "driver_accepted"
  | "driver_declined"
  | "job_completed"
  | "job_cancelled"

export interface Notification {
  _id: string
  userId: string
  type: NotificationType
  message: string
  relatedJobId?: string
  isRead: boolean
  createdAt: string
}

// ─── API Response ───

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message: string
}

export interface ApiError {
  success: false
  error: string
  code: number
}
