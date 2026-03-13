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
        "flex items-center gap-5 rounded-card bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover border border-transparent hover:border-border/50",
        className
      )}
      {...props}
    >
      <Avatar src={avatarUrl} name={name} size="lg" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate font-semibold text-foreground text-base">{name}</h4>
          {isVerified && (
            <Badge status="approved">Verified</Badge>
          )}
        </div>
        <p className="text-caption text-muted-foreground mt-0.5">Age: {age}</p>
        <RatingStars rating={rating} size="sm" className="mt-1.5" />
        <div className="mt-3 flex flex-wrap gap-2">
          {experienceTags.map((tag) => (
            <span
              key={tag}
              className="rounded-badge bg-surface border border-border/50 px-2.5 py-1 text-xs font-medium text-subheading"
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
