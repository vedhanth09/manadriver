import { useState, useRef, useEffect } from "react"
import { Bell, X, CheckCheck, BriefcaseBusiness, UserCheck, UserX, ThumbsUp, ThumbsDown, ClipboardCheck, Ban } from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"
import { cn } from "@/lib/utils"
import type { NotificationType } from "@/types"

const typeIcons: Record<NotificationType, React.ReactNode> = {
  new_job: <BriefcaseBusiness className="size-4 text-accent" />,
  driver_applied: <UserCheck className="size-4 text-blue-500" />,
  application_approved: <ThumbsUp className="size-4 text-emerald-600" />,
  application_rejected: <UserX className="size-4 text-red-500" />,
  driver_accepted: <ThumbsUp className="size-4 text-emerald-600" />,
  driver_declined: <ThumbsDown className="size-4 text-orange-500" />,
  job_completed: <ClipboardCheck className="size-4 text-primary" />,
  job_cancelled: <Ban className="size-4 text-red-500" />,
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        type="button"
        className="relative rounded-full p-2 text-muted-foreground hover:bg-surface hover:text-foreground transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Slide-in panel */}
      <div
        className={cn(
          "fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-80 bg-white border-l border-border shadow-modal transition-transform duration-300 ease-in-out sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:h-auto sm:max-h-[28rem] sm:w-96 sm:rounded-card sm:border sm:shadow-card-hover",
          open ? "translate-x-0" : "translate-x-full sm:pointer-events-none sm:scale-95 sm:opacity-0 sm:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-accent hover:bg-mint-bg transition-colors"
                onClick={markAllRead}
              >
                <CheckCheck className="size-3.5" />
                Mark all read
              </button>
            )}
            <button
              type="button"
              className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="overflow-y-auto sm:max-h-[24rem]" style={{ maxHeight: "calc(100vh - 7rem)" }}>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="size-10 text-border mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No new notifications</p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                You're all caught up!
              </p>
            </div>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={cn(
                    "flex items-start gap-3 border-b border-border/50 px-4 py-3 transition-colors",
                    !n.isRead && "bg-mint-bg/40"
                  )}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {typeIcons[n.type] ?? <Bell className="size-4 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground leading-snug">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatTimeAgo(n.createdAt)}</p>
                  </div>
                  {!n.isRead && (
                    <span className="mt-1.5 size-2 flex-shrink-0 rounded-full bg-accent" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export { NotificationBell }
