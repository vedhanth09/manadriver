import api from "./api"
import type { ApiResponse, PopulatedApplication, EnrichedApplicant, Application } from "@/types"

export interface ApplicantFilters {
  minRating?: number
  experienceLevel?: string
}

export const applyToJob = (jobId: string) =>
  api.post<ApiResponse<{ application: Application }>>("/api/applications", { jobId })

export const getDriverApplications = () =>
  api.get<ApiResponse<{ applications: PopulatedApplication[] }>>("/api/applications/driver")

export const getJobApplicants = (jobId: string, filters?: ApplicantFilters) =>
  api.get<ApiResponse<{ applicants: EnrichedApplicant[] }>>(`/api/applications/job/${jobId}`, { params: filters })

export const updateApplication = (id: string, action: "hire" | "accept" | "decline") =>
  api.patch<ApiResponse<{ application: Application }>>(`/api/applications/${id}`, { action })
