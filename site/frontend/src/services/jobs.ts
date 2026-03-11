import api from "./api"
import type { ApiResponse, Job } from "@/types"

export interface CreateJobData {
  jobType: "hourly" | "temporary" | "permanent"
  city: string
  areas?: string[]
  startLocation: string
  endLocation?: string
  carType: string
  transmissionType: string
  // Hourly
  estimatedDuration?: number
  expectedPayout?: number
  // Temporary
  durationDays?: number
  dailyPayment?: number
  // Permanent
  workingHours?: "12hr" | "24x7"
  monthlySalary?: number
}

export interface JobFilters {
  city?: string
  areas?: string
  jobType?: string
  carType?: string
  transmissionType?: string
  minPay?: number
  maxPay?: number
  workingHours?: string
}

export const createJob = (data: CreateJobData) =>
  api.post<ApiResponse<{ job: Job }>>("/api/jobs", data)

export const getJobs = (filters?: JobFilters) =>
  api.get<ApiResponse<{ jobs: Job[]; appliedJobIds?: string[] }>>("/api/jobs", { params: filters })

export const getJobById = (id: string) =>
  api.get<ApiResponse<{ job: Job }>>(`/api/jobs/${id}`)

export const updateJobStatus = (id: string, status: string, cancellationReason?: string) =>
  api.patch<ApiResponse<{ job: Job }>>(`/api/jobs/${id}/status`, { status, cancellationReason })
