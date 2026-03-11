import { useEffect } from "react"
import { MapPin, Phone, Car, Clock, DollarSign, User, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { JobCardSkeletonGrid } from "@/components/shared/skeleton-loaders"
import { EmptyState } from "@/components/ui/empty-state"
import { ApiError } from "@/components/shared/api-error"
import { useApplications } from "@/hooks/useApplications"
import { useToast } from "@/components/ui/toast"
import type { PopulatedApplication } from "@/types"

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

function ApplicationCard({
  application,
  onAccept,
  onDecline,
  updating,
}: {
  application: PopulatedApplication
  onAccept: () => void
  onDecline: () => void
  updating: boolean
}) {
  const job = application.jobId
  const customer = job?.customerId
  const isApproved = application.status === "approved"
  const awaitingResponse = isApproved && application.driverResponse === "pending"

  return (
    <div className="rounded-card bg-white p-5 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-hover">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <Badge status={job?.jobType || "pending"}>
          {job?.jobType ? job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1) : "Job"}
        </Badge>
        <Badge
          status={
            application.status === "approved" && application.driverResponse === "accepted"
              ? "accepted"
              : application.status === "withdrawn"
                ? "withdrawn"
                : application.status
          }
        >
          {application.status === "approved" && application.driverResponse === "accepted"
            ? "Accepted"
            : application.status === "approved" && application.driverResponse === "declined"
              ? "Declined"
              : application.status.charAt(0).toUpperCase() + application.status.slice(1)}
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
              {job.transmissionType.charAt(0).toUpperCase() + job.transmissionType.slice(1)}
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

      {/* Customer details — shown only when approved */}
      {isApproved && customer && (
        <div className="mt-4 rounded-lg border border-border bg-surface p-3">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Customer Info</p>
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

      {/* Accept / Decline buttons for approved + pending response */}
      {awaitingResponse && (
        <div className="mt-4 flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={onAccept}
            disabled={updating}
          >
            Accept Job
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={onDecline}
            disabled={updating}
          >
            Decline
          </Button>
        </div>
      )}

      {/* Applied timestamp */}
      <p className="mt-3 text-xs text-muted-foreground">
        Applied {new Date(application.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
      </p>
    </div>
  )
}

function MyApplicationsTab() {
  const {
    applications,
    applicationsLoading,
    applicationsError,
    fetchDriverApplications,
    updateApplication,
    updating,
  } = useApplications()
  const { toast } = useToast()

  useEffect(() => {
    fetchDriverApplications()
  }, [fetchDriverApplications])

  const handleAccept = async (applicationId: string) => {
    try {
      await updateApplication(applicationId, "accept")
      toast("Job accepted!", "success")
      fetchDriverApplications()
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to accept", "error")
    }
  }

  const handleDecline = async (applicationId: string) => {
    try {
      await updateApplication(applicationId, "decline")
      toast("Job declined", "info")
      fetchDriverApplications()
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to decline", "error")
    }
  }

  if (applicationsLoading) return <JobCardSkeletonGrid />

  if (applicationsError) {
    return <ApiError message={applicationsError} onRetry={fetchDriverApplications} />
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="size-12" />}
        title="No applications yet"
        description="Browse jobs and apply to get started."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {applications.map((app) => (
        <ApplicationCard
          key={app._id}
          application={app}
          onAccept={() => handleAccept(app._id)}
          onDecline={() => handleDecline(app._id)}
          updating={updating}
        />
      ))}
    </div>
  )
}

export { MyApplicationsTab }
