import api from "./api"
import type { ApiResponse, Notification } from "@/types"

export async function fetchNotifications() {
  const res = await api.get<ApiResponse<{ notifications: Notification[]; unreadCount: number }>>(
    "/api/notifications"
  )
  return res.data.data
}

export async function markAllNotificationsRead() {
  const res = await api.patch<ApiResponse>("/api/notifications/read")
  return res.data
}
