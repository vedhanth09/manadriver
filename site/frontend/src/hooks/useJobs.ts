import { useState, useCallback } from "react"
import { getJobs, type JobFilters } from "@/services/jobs"
import type { Job } from "@/types"
import { isAxiosError } from "axios"

interface UseJobsReturn {
  jobs: Job[]
  appliedJobIds: Set<string>
  loading: boolean
  error: string | null
  fetchJobs: (filters?: JobFilters) => Promise<void>
}

export function useJobs(): UseJobsReturn {
  const [jobs, setJobs] = useState<Job[]>([])
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = useCallback(async (filters?: JobFilters) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getJobs(filters)
      setJobs(res.data.data.jobs)
      setAppliedJobIds(new Set(res.data.data.appliedJobIds ?? []))
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.error ?? "Failed to fetch jobs"
        : "Failed to fetch jobs"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { jobs, appliedJobIds, loading, error, fetchJobs }
}
