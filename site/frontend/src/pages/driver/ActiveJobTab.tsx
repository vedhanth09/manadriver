import { useEffect, useState } from "react"
import { MapPin, Phone, Car, Clock, DollarSign, User, CheckCircle, Play, XCircle, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { JobCardSkeletonGrid } from "@/components/shared/skeleton-loaders"
import { EmptyState } from "@/components/ui/empty-state"
import { ApiError } from "@/components/shared/api-error"
import { CancelJobModal } from "@/components/shared/cancel-job-modal"
import { useApplications } from "@/hooks/useApplications"
import { useToast } from "@/components/ui/toast"
import { updateJobStatus } from "@/services/jobs"
import type { PopulatedApplication } from "@/types"
import { isAxiosError } from "axios"

function getJobPayout(job: PopulatedApplication["jobId"]): string {
  if (job.jobType === "hourly" && job.expectedPayout)
    return `₹${job.expectedPayout.toLocaleString("en-IN")}`
  if (job.jobType === "temporary" && job.dailyPayment)
    return `₹${job.dailyPayment.toLocaleString("en-IN")}/day`
  if (job.jobType === "permanent" && job.monthlySalary)
    return `₹${job.monthlySalary.toLocaleString("en-IN")}/mo`
  return "—"
}

function getJobDuration(job: PopulatedApplication["jobId"]): string {
  if (job.jobType === "hourly" && job.estimatedDuration)
    return `${job.estimatedDuration} hr${job.estimatedDuration > 1 ? "s" : ""}`
  if (job.jobType === "temporary" && job.durationDays)
    return `${job.durationDays} day${job.durationDays > 1 ? "s" : ""}`
  if (job.jobType === "permanent" && job.workingHours)
    return job.workingHours === "24x7" ? "24×7" : "12 hr shift"
  return "—"
}

function ActiveJobTab() {
  const {
    applications,
    applicationsLoading,
    applicationsError,
    fetchDriverApplications,
  } = useApplications()
  const { toast } = useToast()
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)
  const [cancelJobId, setCancelJobId] = useState<string | null>(null)

  useEffect(() => {
    fetchDriverApplications()
  }, [fetchDriverApplications])

  // Filter to only active (in_progress) jobs where driver accepted
  const activeApplications = applications.filter(
    (app) =>
      app.status === "approved" &&
      app.driverResponse === "accepted" &&
      app.jobId &&
      (app.jobId.status === "in_progress" || app.jobId.status === "accepted")
  )

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
      fetchDriverApplications()
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

  if (applicationsLoading) return <JobCardSkeletonGrid count={3} />

  if (applicationsError) {
    return <ApiError message={applicationsError} onRetry={fetchDriverApplications} />
  }

  if (activeApplications.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase className="size-12" />}
        title="No active jobs"
        description="Once you accept a job, it will appear here."
      />
    )
  }

  return (
    <>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {activeApplications.map((app) => {
        const job = app.jobId
        const customer = job?.customerId

        return (
          <div
            key={app._id}
            className="rounded-card bg-white p-5 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <Badge status={job?.jobType || "pending"}>
                {job?.jobType
                  ? job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)
                  : "Job"}
              </Badge>
              <Badge status={job.status === "in_progress" ? "in_progress" : "accepted"}>
                {job.status === "in_progress" ? "In Progress" : "Accepted"}
              </Badge>
            </div>

            {/* Job details */}
            {job && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" />
                  <span>
                    {job.startLocation}
                    {job.endLocation ? ` → ${job.endLocation}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="size-4 shrink-0" />
                  <span>
                    {job.carType.charAt(0).toUpperCase() + job.carType.slice(1)} &middot;{" "}
                    {job.transmissionType.charAt(0).toUpperCase() +
                      job.transmissionType.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0" />
                  <span>{getJobDuration(job)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 shrink-0" />
                  <span className="font-semibold text-foreground">{getJobPayout(job)}</span>
                </div>
              </div>
            )}

            {/* Customer info */}
            {customer && (
              <div className="mt-4 rounded-lg border border-border bg-surface p-3">
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Customer Info
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="size-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium text-foreground">{customer.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Start Job button for accepted status */}
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

            {/* Mark as Completed button */}
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

            {/* Cancel Job button for accepted/in_progress */}
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
        )
      })}
    </div>

    <CancelJobModal
      open={!!cancelJobId}
      onClose={() => setCancelJobId(null)}
      onConfirm={handleCancelConfirm}
      loading={!!statusUpdating}
    />
  </>
  )
}

export { ActiveJobTab }
