import { useEffect, useState } from "react"
import { Search, X, Briefcase } from "lucide-react"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/shared/job-card"
import { JobCardSkeletonGrid } from "@/components/shared/skeleton-loaders"
import { EmptyState } from "@/components/ui/empty-state"
import { ApiError } from "@/components/shared/api-error"
import { useJobs } from "@/hooks/useJobs"
import { useApplications } from "@/hooks/useApplications"
import { useToast } from "@/components/ui/toast"
import type { JobFilters } from "@/services/jobs"
import type { Job } from "@/types"
import { JOB_TYPES, CAR_TYPES, TRANSMISSION_TYPES, CITIES } from "@/constants"

const WORKING_HOURS_OPTIONS = [
  { value: "12hr", label: "12 Hour Shift" },
  { value: "24x7", label: "24×7" },
] as const

function getJobPayout(job: Job): string {
  if (job.jobType === "hourly" && job.expectedPayout)
    return `₹${job.expectedPayout.toLocaleString("en-IN")}`
  if (job.jobType === "temporary" && job.dailyPayment)
    return `₹${job.dailyPayment.toLocaleString("en-IN")}/day`
  if (job.jobType === "permanent" && job.monthlySalary)
    return `₹${job.monthlySalary.toLocaleString("en-IN")}/mo`
  return "—"
}

function getJobDuration(job: Job): string {
  if (job.jobType === "hourly" && job.estimatedDuration)
    return `${job.estimatedDuration} hr${job.estimatedDuration > 1 ? "s" : ""}`
  if (job.jobType === "temporary" && job.durationDays)
    return `${job.durationDays} day${job.durationDays > 1 ? "s" : ""}`
  if (job.jobType === "permanent" && job.workingHours)
    return job.workingHours === "24x7" ? "24×7" : "12 hr shift"
  return "—"
}

function BrowseJobsTab() {
  const { jobs, appliedJobIds, loading, error, fetchJobs } = useJobs()
  const { applyToJob } = useApplications()
  const { toast } = useToast()

  // Filter state
  const [city, setCity] = useState("")
  const [jobType, setJobType] = useState("")
  const [carType, setCarType] = useState("")
  const [transmissionType, setTransmissionType] = useState("")
  const [minPay, setMinPay] = useState("")
  const [maxPay, setMaxPay] = useState("")
  const [workingHours, setWorkingHours] = useState("")

  const hasActiveFilters = !!(city || jobType || carType || transmissionType || minPay || maxPay || workingHours)

  // Build filters object
  const buildFilters = (): JobFilters => {
    const filters: JobFilters = {}
    if (city) filters.city = city
    if (jobType) filters.jobType = jobType
    if (carType) filters.carType = carType
    if (transmissionType) filters.transmissionType = transmissionType
    if (minPay) filters.minPay = Number(minPay)
    if (maxPay) filters.maxPay = Number(maxPay)
    if (workingHours) filters.workingHours = workingHours
    return filters
  }

  // Fetch on mount
  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleSearch = () => {
    fetchJobs(buildFilters())
  }

  const handleReset = () => {
    setCity("")
    setJobType("")
    setCarType("")
    setTransmissionType("")
    setMinPay("")
    setMaxPay("")
    setWorkingHours("")
    fetchJobs()
  }

  return (
    <div>
      {/* Filter Bar */}
      <div className="mb-8 rounded-card bg-surface p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Filter Jobs</h3>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
            >
              <X className="size-3.5" />
              Clear all filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>

          <Select value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="">All Job Types</option>
            {JOB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>

          <Select value={carType} onChange={(e) => setCarType(e.target.value)}>
            <option value="">All Car Types</option>
            {CAR_TYPES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>

          <Select value={transmissionType} onChange={(e) => setTransmissionType(e.target.value)}>
            <option value="">All Transmission</option>
            {TRANSMISSION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>

          <Select value={workingHours} onChange={(e) => setWorkingHours(e.target.value)}>
            <option value="">All Working Hours</option>
            {WORKING_HOURS_OPTIONS.map((wh) => (
              <option key={wh.value} value={wh.value}>{wh.label}</option>
            ))}
          </Select>

          <Input
            type="number"
            placeholder="Min Pay (₹)"
            value={minPay}
            onChange={(e) => setMinPay(e.target.value)}
            min={0}
          />

          <Input
            type="number"
            placeholder="Max Pay (₹)"
            value={maxPay}
            onChange={(e) => setMaxPay(e.target.value)}
            min={0}
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleSearch}>
            <Search className="mr-1.5 size-4" />
            Search Jobs
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading && <JobCardSkeletonGrid />}

      {error && (
        <ApiError message={error} onRetry={() => fetchJobs(buildFilters())} />
      )}

      {!loading && !error && jobs.length === 0 && (
        <EmptyState
          icon={<Briefcase className="size-12" />}
          title="No jobs found"
          description="Try adjusting your filters or check back later for new postings."
        />
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              jobType={job.jobType}
              location={job.startLocation + (job.endLocation ? ` → ${job.endLocation}` : "")}
              carType={job.carType.charAt(0).toUpperCase() + job.carType.slice(1)}
              transmissionType={job.transmissionType.charAt(0).toUpperCase() + job.transmissionType.slice(1)}
              duration={getJobDuration(job)}
              payout={getJobPayout(job)}
              customerRating={0}
              applied={appliedJobIds.has(job._id)}
              onApply={async () => {
                try {
                  await applyToJob(job._id)
                  toast("Application submitted!", "success")
                  fetchJobs(buildFilters())
                } catch (err) {
                  toast(err instanceof Error ? err.message : "Failed to apply", "error")
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { BrowseJobsTab }
