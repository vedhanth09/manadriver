import { useState, useCallback } from "react"
import {
  applyToJob as applyToJobApi,
  getDriverApplications as getDriverApplicationsApi,
  getJobApplicants as getJobApplicantsApi,
  updateApplication as updateApplicationApi,
  type ApplicantFilters,
} from "@/services/applications"
import type { PopulatedApplication, EnrichedApplicant } from "@/types"
import { isAxiosError } from "axios"

interface UseApplicationsReturn {
  // Driver applications
  applications: PopulatedApplication[]
  applicationsLoading: boolean
  applicationsError: string | null
  fetchDriverApplications: () => Promise<void>
  applyToJob: (jobId: string) => Promise<boolean>

  // Job applicants (customer view)
  applicants: EnrichedApplicant[]
  applicantsLoading: boolean
  applicantsError: string | null
  fetchJobApplicants: (jobId: string, filters?: ApplicantFilters) => Promise<void>

  // Update (hire / accept / decline)
  updateApplication: (id: string, action: "hire" | "accept" | "decline") => Promise<boolean>
  updating: boolean
}

export function useApplications(): UseApplicationsReturn {
  const [applications, setApplications] = useState<PopulatedApplication[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [applicationsError, setApplicationsError] = useState<string | null>(null)

  const [applicants, setApplicants] = useState<EnrichedApplicant[]>([])
  const [applicantsLoading, setApplicantsLoading] = useState(false)
  const [applicantsError, setApplicantsError] = useState<string | null>(null)

  const [updating, setUpdating] = useState(false)

  const fetchDriverApplications = useCallback(async () => {
    setApplicationsLoading(true)
    setApplicationsError(null)
    try {
      const res = await getDriverApplicationsApi()
      setApplications(res.data.data.applications)
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.error ?? "Failed to fetch applications"
        : "Failed to fetch applications"
      setApplicationsError(message)
    } finally {
      setApplicationsLoading(false)
    }
  }, [])

  const applyToJob = useCallback(async (jobId: string): Promise<boolean> => {
    try {
      await applyToJobApi(jobId)
      return true
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.error ?? "Failed to apply"
        : "Failed to apply"
      throw new Error(message)
    }
  }, [])

  const fetchJobApplicants = useCallback(async (jobId: string, filters?: ApplicantFilters) => {
    setApplicantsLoading(true)
    setApplicantsError(null)
    try {
      const res = await getJobApplicantsApi(jobId, filters)
      setApplicants(res.data.data.applicants)
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.error ?? "Failed to fetch applicants"
        : "Failed to fetch applicants"
      setApplicantsError(message)
    } finally {
      setApplicantsLoading(false)
    }
  }, [])

  const updateApplication = useCallback(async (id: string, action: "hire" | "accept" | "decline"): Promise<boolean> => {
    setUpdating(true)
    try {
      await updateApplicationApi(id, action)
      return true
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.error ?? "Failed to update application"
        : "Failed to update application"
      throw new Error(message)
    } finally {
      setUpdating(false)
    }
  }, [])

  return {
    applications,
    applicationsLoading,
    applicationsError,
    fetchDriverApplications,
    applyToJob,
    applicants,
    applicantsLoading,
    applicantsError,
    fetchJobApplicants,
    updateApplication,
    updating,
  }
}
