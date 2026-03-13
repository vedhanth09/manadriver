import { cn } from "@/lib/utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab: string
  onTabChange: (value: string) => void
  tabs: { value: string; label: string }[]
}

function Tabs({ activeTab, onTabChange, tabs, className, ...props }: TabsProps) {
  return (
    <div
      data-slot="tabs"
      className={cn("border-b border-border", className)}
      {...props}
    >
      <nav className="-mb-px flex gap-4 overflow-x-auto scrollbar-none sm:gap-6" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "min-h-[48px] shrink-0 whitespace-nowrap border-b-2 px-2 py-4 text-base font-medium transition-colors",
              activeTab === tab.value
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:border-border/50 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export { Tabs }
