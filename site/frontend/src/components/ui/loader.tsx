import { cn } from "@/lib/utils"

function Loader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-accent" />
    </div>
  )
}

export { Loader }
