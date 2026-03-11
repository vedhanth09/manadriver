import { cn } from "@/lib/utils"

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  value: string | number
  label: string
}

function StatCard({ icon, value, label, className, ...props }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-card bg-mint-bg p-6 text-center",
        className
      )}
      {...props}
    >
      <div className="text-accent">{icon}</div>
      <span className="text-h2 font-bold text-foreground">{value}</span>
      <span className="text-caption font-medium text-muted-foreground">{label}</span>
    </div>
  )
}

export { StatCard }
