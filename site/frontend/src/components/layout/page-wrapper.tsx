import { cn } from "@/lib/utils"

function PageWrapper({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 py-8 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { PageWrapper }
