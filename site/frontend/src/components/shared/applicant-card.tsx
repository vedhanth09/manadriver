import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/ui/rating-stars"
import { cn } from "@/lib/utils"

interface ApplicantCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  age: number
  avatarUrl?: string | null
  rating: number
  experienceTags: string[]
  isVerified?: boolean
  onHire?: () => void
}

function ApplicantCard({
  name,
  age,
  avatarUrl,
  rating,
  experienceTags,
  isVerified = false,
  onHire,
  className,
  ...props
}: ApplicantCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-card bg-white p-4 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-hover",
        className
      )}
      {...props}
    >
      <Avatar src={avatarUrl} name={name} size="lg" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate font-semibold text-foreground">{name}</h4>
          {isVerified && (
            <Badge status="approved">Verified</Badge>
          )}
        </div>
        <p className="text-caption text-muted-foreground">Age: {age}</p>
        <RatingStars rating={rating} size="sm" className="mt-1" />
        <div className="mt-2 flex flex-wrap gap-1">
          {experienceTags.map((tag) => (
            <span
              key={tag}
              className="rounded-badge bg-surface px-2 py-0.5 text-xs font-medium text-subheading"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {onHire && (
        <Button variant="primary" size="sm" onClick={onHire} className="shrink-0">
          Hire
        </Button>
      )}
    </div>
  )
}

export { ApplicantCard }
