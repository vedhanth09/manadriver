import { useEffect } from "react"
import { MapPin, Car, Clock, DollarSign, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "@/components/ui/rating-stars"
import { JobCardSkeletonGrid } from "@/components/shared/skeleton-loaders"
import { EmptyState } from "@/components/ui/empty-state"
import { ApiError } from "@/components/shared/api-error"
import { useApplications } from "@/hooks/useApplications"
import type { PopulatedApplication } from "@/types"

import emptyCompletedImg from "@/assets/empty-completed.png"

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

function DriverCompletedJobsTab() {
  const {
    applications,
    applicationsLoading,
    applicationsError,
    fetchDriverApplications,
  } = useApplications()

  useEffect(() => {
    fetchDriverApplications()
  }, [fetchDriverApplications])

  // Filter to completed or cancelled jobs where driver was accepted
  const completedApplications = applications.filter(
    (app) =>
      app.driverResponse === "accepted" &&
      app.jobId &&
      (app.jobId.status === "completed" || app.jobId.status === "cancelled")
  )

  if (applicationsLoading) return <JobCardSkeletonGrid />

  if (applicationsError) {
    return <ApiError message={applicationsError} onRetry={fetchDriverApplications} />
  }

  if (completedApplications.length === 0) {
    return (
      <EmptyState
        icon={<img src={emptyCompletedImg} alt="No completed jobs" className="w-48 h-auto opacity-80" />}
        title="No completed jobs"
        description="Jobs you've completed or cancelled will appear here."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {completedApplications.map((app) => {
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
              <Badge status={job.status === "cancelled" ? "cancelled" : "completed"}>
                {job.status === "cancelled" ? "Cancelled" : "Completed"}
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

            {/* Customer name */}
            {customer && (
              <p className="mt-3 text-sm text-muted-foreground">
                Customer: <span className="font-medium text-foreground">{customer.fullName}</span>
              </p>
            )}

            {/* Rating received placeholder */}
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="size-4 shrink-0" />
              <span>Rating:</span>
              <RatingStars rating={0} size="sm" />
              <span className="text-xs">(Not yet rated)</span>
            </div>

            {/* Date + cancellation reason */}
            <p className="mt-3 text-xs text-muted-foreground">
              {job.status === "cancelled" ? "Cancelled" : "Completed"}{" "}
              {new Date(job.updatedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>

            {job.status === "cancelled" && job.cancellationReason && (
              <p className="mt-1 text-xs italic text-muted-foreground">
                Reason: {job.cancellationReason}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { DriverCompletedJobsTab }
