import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  maxRating?: number
  interactive?: boolean
  onRate?: (rating: number) => void
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
}

function RatingStars({
  rating,
  maxRating = 5,
  interactive = false,
  onRate,
  size = "md",
  className,
}: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starIndex = i + 1
        const filled = starIndex <= Math.round(rating)
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(starIndex)}
            className={cn(
              "disabled:cursor-default",
              interactive && "cursor-pointer hover:scale-110 transition-transform"
            )}
            aria-label={`${starIndex} star${starIndex > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-none text-gray-300"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export { RatingStars }
