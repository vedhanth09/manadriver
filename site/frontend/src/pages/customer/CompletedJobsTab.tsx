import { useEffect, useState } from "react"
import { MapPin, DollarSign, Star, ClipboardCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal"
import { RatingStars } from "@/components/ui/rating-stars"
import { Textarea } from "@/components/ui/textarea"
import { JobCardSkeletonGrid } from "@/components/shared/skeleton-loaders"
import { EmptyState } from "@/components/ui/empty-state"
import { ApiError } from "@/components/shared/api-error"
import { useJobs } from "@/hooks/useJobs"
import { useToast } from "@/components/ui/toast"
import { createRating, getMySubmittedRatings } from "@/services/ratings"
import { useAuth } from "@/hooks/useAuth"
import type { Job } from "@/types"

function getJobPayout(job: Job): string {
  if (job.jobType === "hourly" && job.expectedPayout)
    return `₹${job.expectedPayout.toLocaleString("en-IN")}`
  if (job.jobType === "temporary" && job.dailyPayment)
    return `₹${job.dailyPayment.toLocaleString("en-IN")}/day`
  if (job.jobType === "permanent" && job.monthlySalary)
    return `₹${job.monthlySalary.toLocaleString("en-IN")}/mo`
  return "—"
}

function CustomerCompletedJobsTab() {
  const { jobs, loading, error, fetchJobs } = useJobs()
  const { toast } = useToast()
  const { user } = useAuth()

  // Rating modal state
  const [ratingJob, setRatingJob] = useState<Job | null>(null)
  const [drivingSkill, setDrivingSkill] = useState(0)
  const [professionalBehavior, setProfessionalBehavior] = useState(0)
  const [punctuality, setPunctuality] = useState(0)
  const [review, setReview] = useState("")
  const [submittingRating, setSubmittingRating] = useState(false)
  // Track which jobs have been rated (persisted from server + local additions)
  const [ratedJobs, setRatedJobs] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchJobs()
    // Fetch already-rated job IDs from server
    getMySubmittedRatings()
      .then((res) => {
        setRatedJobs(new Set(res.data.data.ratedJobIds))
      })
      .catch(() => {
        // Silently fail — worst case user sees "Rate" buttons for already-rated jobs
      })
  }, [fetchJobs])

  // Filter to completed or cancelled jobs
  const completedJobs = jobs.filter((j) => j.status === "completed" || j.status === "cancelled")

  const openRatingModal = (job: Job) => {
    setRatingJob(job)
    setDrivingSkill(0)
    setProfessionalBehavior(0)
    setPunctuality(0)
    setReview("")
  }

  const closeRatingModal = () => {
    setRatingJob(null)
  }

  const handleSubmitRating = async () => {
    if (!ratingJob || !user) return
    if (drivingSkill === 0 || professionalBehavior === 0 || punctuality === 0) {
      toast("Please rate all categories", "error")
      return
    }

    if (!ratingJob.acceptedDriverId) {
      toast("No driver assigned to this job", "error")
      return
    }

    // Extract driver ID — acceptedDriverId may be populated object or plain string
    const driverIdRaw = ratingJob.acceptedDriverId
    const rateeId = typeof driverIdRaw === "object" && driverIdRaw !== null
      ? (driverIdRaw as { _id: string })._id
      : driverIdRaw

    setSubmittingRating(true)
    try {
      await createRating({
        jobId: ratingJob._id,
        rateeId,
        rateeRole: "driver",
        drivingSkill,
        professionalBehavior,
        punctuality,
        review: review.trim() || undefined,
      })
      toast("Rating submitted successfully!", "success")
      setRatedJobs((prev) => new Set(prev).add(ratingJob._id))
      closeRatingModal()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Failed to submit rating"
      toast(message, "error")
    } finally {
      setSubmittingRating(false)
    }
  }

  if (loading) return <JobCardSkeletonGrid />

  if (error) {
    return <ApiError message={error} onRetry={() => fetchJobs()} />
  }

  if (completedJobs.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardCheck className="size-12" />}
        title="No completed jobs"
        description="Jobs that are completed or cancelled will appear here."
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {completedJobs.map((job) => {
          const hasBeenRated = ratedJobs.has(job._id)

          return (
            <div
              key={job._id}
              className="rounded-card bg-white p-5 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="mb-3 flex items-center justify-between">
                <Badge status={job.jobType}>
                  {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                </Badge>
                <Badge status={job.status === "cancelled" ? "cancelled" : "completed"}>
                  {job.status === "cancelled" ? "Cancelled" : "Completed"}
                </Badge>
              </div>

              {/* Job details */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" />
                  <span>
                    {job.startLocation}
                    {job.endLocation ? ` → ${job.endLocation}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 shrink-0" />
                  <span className="font-semibold text-foreground">{getJobPayout(job)}</span>
                </div>
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

              {/* Rate Driver button (only for completed jobs) */}
              {job.status === "completed" && (hasBeenRated ? (
                <div className="mt-4 flex items-center gap-2 text-sm text-accent">
                  <Star className="size-4" />
                  <span className="font-medium">Rated</span>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => openRatingModal(job)}
                >
                  <Star className="mr-1.5 size-4" />
                  Rate Driver
                </Button>
              ))}
            </div>
          )
        })}
      </div>

      {/* Rating Modal */}
      <Modal open={!!ratingJob} onClose={closeRatingModal} className="max-w-md">
        <ModalHeader>
          <ModalTitle>Rate Driver</ModalTitle>
        </ModalHeader>

        <div className="space-y-5 py-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Driving Skill
            </label>
            <RatingStars
              rating={drivingSkill}
              interactive
              onRate={setDrivingSkill}
              size="lg"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Professional Behavior
            </label>
            <RatingStars
              rating={professionalBehavior}
              interactive
              onRate={setProfessionalBehavior}
              size="lg"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Punctuality
            </label>
            <RatingStars
              rating={punctuality}
              interactive
              onRate={setPunctuality}
              size="lg"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Review (optional)
            </label>
            <Textarea
              placeholder="Share your experience with this driver..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <ModalFooter>
          <Button variant="ghost" onClick={closeRatingModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitRating}
            disabled={submittingRating}
          >
            {submittingRating ? "Submitting..." : "Submit Rating"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export { CustomerCompletedJobsTab }
