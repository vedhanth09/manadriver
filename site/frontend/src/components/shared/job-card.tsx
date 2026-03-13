import { MapPin, Clock, Car, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/ui/rating-stars"
import { cn } from "@/lib/utils"

interface JobCardProps extends React.HTMLAttributes<HTMLDivElement> {
  jobType: "hourly" | "temporary" | "permanent"
  location: string
  carType: string
  transmissionType: string
  duration: string
  payout: string
  customerRating: number
  applied?: boolean
  onApply?: () => void
  onSkip?: () => void
}

function JobCard({
  jobType,
  location,
  carType,
  transmissionType,
  duration,
  payout,
  customerRating,
  applied = false,
  onApply,
  onSkip,
  className,
  ...props
}: JobCardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover border border-transparent hover:border-border/50",
        className
      )}
      {...props}
    >
      <div className="mb-3 flex items-center justify-between">
        <Badge status={jobType}>
          {jobType.charAt(0).toUpperCase() + jobType.slice(1)}
        </Badge>
        <RatingStars rating={customerRating} size="sm" />
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Car className="size-4 shrink-0" />
          <span>{carType} &middot; {transmissionType}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-4 shrink-0" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="size-4 shrink-0" />
          <span className="font-semibold text-foreground">{payout}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {applied ? (
          <Button variant="secondary" size="sm" disabled className="w-full">
            Applied ✓
          </Button>
        ) : (
          <>
            <Button variant="primary" size="sm" className="flex-1" onClick={onApply}>
              Apply
            </Button>
            {onSkip && (
              <Button variant="ghost" size="sm" onClick={onSkip}>
                Skip
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export { JobCard }
