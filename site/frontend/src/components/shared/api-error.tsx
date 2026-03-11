import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ApiErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
  onRetry?: () => void
}

function ApiError({
  message = "Failed to load data. Please try again.",
  onRetry,
  className,
  ...props
}: ApiErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
      {...props}
    >
      <AlertCircle className="mb-3 size-10 text-red-400" />
      <p className="text-sm font-medium text-red-600">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          <RefreshCw className="mr-1.5 size-4" />
          Retry
        </Button>
      )}
    </div>
  )
}

export { ApiError }
