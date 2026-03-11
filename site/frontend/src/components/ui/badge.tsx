import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-badge px-3 py-1 text-caption font-medium",
  {
    variants: {
      status: {
        pending: "bg-amber-100 text-amber-800",
        approved: "bg-emerald-100 text-emerald-800",
        rejected: "bg-red-100 text-red-800",
        active: "bg-blue-100 text-blue-800",
        completed: "bg-gray-100 text-gray-800",
        posted: "bg-indigo-100 text-indigo-800",
        applied: "bg-cyan-100 text-cyan-800",
        accepted: "bg-emerald-100 text-emerald-800",
        in_progress: "bg-blue-100 text-blue-800",
        cancelled: "bg-red-100 text-red-800",
        withdrawn: "bg-gray-100 text-gray-800",
        hourly: "bg-violet-100 text-violet-800",
        temporary: "bg-orange-100 text-orange-800",
        permanent: "bg-teal-100 text-teal-800",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, status, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ status }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
