import { useEffect, useState } from "react"
import { MapPin, Users, Play, CheckCircle, XCircle, X, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Modal, ModalHeader, ModalTitle } from "@/components/ui/modal"
import { ApplicantCard } from "@/components/shared/applicant-card"
import { JobCardSkeletonGrid } from "@/components/shared/skeleton-loaders"
import { ApplicantCardSkeletonList } from "@/components/shared/skeleton-loaders"
import { EmptyState } from "@/components/ui/empty-state"
import { ApiError } from "@/components/shared/api-error"
import { CancelJobModal } from "@/components/shared/cancel-job-modal"
import { useJobs } from "@/hooks/useJobs"
import { useApplications } from "@/hooks/useApplications"
import { useToast } from "@/components/ui/toast"
import { updateJobStatus } from "@/services/jobs"
import type { ApplicantFilters } from "@/services/applications"
import type { Job } from "@/types"
import { isAxiosError } from "axios"

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner (< 10 jobs)" },
  { value: "intermediate", label: "Intermediate (10–49 jobs)" },
  { value: "experienced", label: "Experienced (50+ jobs)" },
] as const

const RATING_OPTIONS = [
  { value: "1", label: "★ 1+" },
  { value: "2", label: "★★ 2+" },
  { value: "3", label: "★★★ 3+" },
  { value: "4", label: "★★★★ 4+" },
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

function MyJobsTab() {
  const { jobs, loading, error, fetchJobs } = useJobs()
  const {
    applicants,
    applicantsLoading,
    applicantsError,
    fetchJobApplicants,
    updateApplication,
    updating,
  } = useApplications()
  const { toast } = useToast()

  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)
  const [cancelJobId, setCancelJobId] = useState<string | null>(null)

  // Applicant filter state
  const [minRating, setMinRating] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const hasApplicantFilters = !!(minRating || experienceLevel)

  const buildApplicantFilters = (): ApplicantFilters => {
    const filters: ApplicantFilters = {}
    if (minRating) filters.minRating = Number(minRating)
    if (experienceLevel) filters.experienceLevel = experienceLevel
    return filters
  }

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleStatusChange = async (jobId: string, newStatus: string, cancellationReason?: string) => {
    setStatusUpdating(jobId)
    try {
      await updateJobStatus(jobId, newStatus, cancellationReason)
      toast(
        newStatus === "in_progress"
          ? "Job started!"
          : newStatus === "cancelled"
            ? "Job cancelled."
            : "Job marked as completed!",
        newStatus === "cancelled" ? "info" : "success"
      )
      fetchJobs()
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.error ?? "Failed to update status"
        : "Failed to update status"
      toast(message, "error")
    } finally {
      setStatusUpdating(null)
    }
  }

  const handleCancelConfirm = (reason: string) => {
    if (cancelJobId) {
      handleStatusChange(cancelJobId, "cancelled", reason || undefined)
      setCancelJobId(null)
    }
  }

  // Filter to only active jobs (not completed/cancelled)
  const activeJobs = jobs.filter(
    (j) => !["completed", "cancelled"].includes(j.status)
  )

  const handleViewApplicants = (job: Job) => {
    setSelectedJob(job)
    setMinRating("")
    setExperienceLevel("")
    fetchJobApplicants(job._id)
  }

  const handleCloseModal = () => {
    setSelectedJob(null)
    setMinRating("")
    setExperienceLevel("")
  }

  const handleApplyApplicantFilters = () => {
    if (selectedJob) {
      fetchJobApplicants(selectedJob._id, buildApplicantFilters())
    }
  }

  const handleClearApplicantFilters = () => {
    setMinRating("")
    setExperienceLevel("")
    if (selectedJob) {
      fetchJobApplicants(selectedJob._id)
    }
  }

  const handleHire = async (applicationId: string) => {
    try {
      await updateApplication(applicationId, "hire")
      toast("Driver hired successfully!", "success")
      // Refresh both applicants and jobs
      if (selectedJob) fetchJobApplicants(selectedJob._id, buildApplicantFilters())
      fetchJobs()
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to hire driver", "error")
    }
  }

  if (loading) return <JobCardSkeletonGrid />

  if (error) {
    return <ApiError message={error} onRetry={() => fetchJobs()} />
  }

  if (activeJobs.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase className="size-12" />}
        title="No active jobs"
        description="Post a job to start receiving applications from drivers."
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeJobs.map((job) => (
          <div
            key={job._id}
            className="rounded-card bg-white p-5 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <div className="mb-3 flex items-center justify-between">
              <Badge status={job.jobType}>
                {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
              </Badge>
              <Badge status={job.status === "in_progress" ? "in_progress" : job.status as "posted" | "applied" | "accepted" | "pending"}>
                {job.status === "in_progress"
                  ? "In Progress"
                  : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                <span>
                  {job.startLocation}
                  {job.endLocation ? ` → ${job.endLocation}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{getJobPayout(job)}</span>
              </div>
            </div>

            {(job.status === "posted" || job.status === "applied") && (
              <Button
                variant="primary"
                size="sm"
                className="mt-4 w-full"
                onClick={() => handleViewApplicants(job)}
              >
                <Users className="mr-1.5 size-4" />
                View Applicants
              </Button>
            )}

            {job.status === "accepted" && (
              <Button
                variant="primary"
                size="sm"
                className="mt-4 w-full"
                onClick={() => handleStatusChange(job._id, "in_progress")}
                disabled={statusUpdating === job._id}
              >
                <Play className="mr-1.5 size-4" />
                {statusUpdating === job._id ? "Starting..." : "Start Job"}
              </Button>
            )}

            {job.status === "in_progress" && (
              <Button
                variant="primary"
                size="sm"
                className="mt-4 w-full"
                onClick={() => handleStatusChange(job._id, "completed")}
                disabled={statusUpdating === job._id}
              >
                <CheckCircle className="mr-1.5 size-4" />
                {statusUpdating === job._id ? "Completing..." : "Mark as Completed"}
              </Button>
            )}

            {/* Cancel Job button for accepted/in_progress jobs */}
            {(job.status === "accepted" || job.status === "in_progress") && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setCancelJobId(job._id)}
                disabled={statusUpdating === job._id}
              >
                <XCircle className="mr-1.5 size-4" />
                Cancel Job
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Applicant List Modal */}
      <Modal open={!!selectedJob} onClose={handleCloseModal} className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>
            Applicants{" "}
            {selectedJob && (
              <span className="text-base font-normal text-muted-foreground">
                — {selectedJob.jobType.charAt(0).toUpperCase() + selectedJob.jobType.slice(1)} job in{" "}
                {selectedJob.city}
              </span>
            )}
          </ModalTitle>
        </ModalHeader>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto">
          {/* Applicant Filters */}
          <div className="rounded-lg border border-border bg-surface p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Filter Applicants</span>
              {hasApplicantFilters && (
                <button
                  onClick={handleClearApplicantFilters}
                  className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
                >
                  <X className="size-3" />
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                <option value="">Any Rating</option>
                {RATING_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </Select>
              <Select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                <option value="">Any Experience</option>
                {EXPERIENCE_LEVELS.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </Select>
              <Button variant="primary" size="sm" onClick={handleApplyApplicantFilters} className="h-10">
                Apply Filters
              </Button>
            </div>
          </div>

          {applicantsLoading && <ApplicantCardSkeletonList />}

          {applicantsError && (
            <ApiError
              message={applicantsError}
              onRetry={() => selectedJob && fetchJobApplicants(selectedJob._id, buildApplicantFilters())}
            />
          )}

          {!applicantsLoading && !applicantsError && applicants.length === 0 && (
            <EmptyState
              icon={<Users className="size-10" />}
              title="No applicants yet"
              description="Drivers will appear here once they apply."
            />
          )}

          {!applicantsLoading &&
            !applicantsError &&
            applicants.map((applicant) => (
              <ApplicantCard
                key={applicant._id}
                name={applicant.driverId?.fullName || "Driver"}
                age={applicant.driverProfile?.age || 0}
                rating={applicant.driverProfile?.averageRating || 0}
                experienceTags={[
                  ...(applicant.driverProfile?.vehicleCategories?.map(
                    (vc) => vc.charAt(0).toUpperCase() + vc.slice(1)
                  ) || []),
                  ...(applicant.driverProfile?.transmissionTypes?.map(
                    (tt) => tt.charAt(0).toUpperCase() + tt.slice(1)
                  ) || []),
                ]}
                isVerified={applicant.driverProfile?.isVerified}
                onHire={
                  applicant.status === "pending" && !updating
                    ? () => handleHire(applicant._id)
                    : undefined
                }
              />
            ))}
        </div>
      </Modal>

      <CancelJobModal
        open={!!cancelJobId}
        onClose={() => setCancelJobId(null)}
        onConfirm={handleCancelConfirm}
        loading={!!statusUpdating}
      />
    </>
  )
}

export { MyJobsTab }
