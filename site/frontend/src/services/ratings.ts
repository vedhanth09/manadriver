import api from "./api"
import type { ApiResponse, Rating } from "@/types"

export interface CreateRatingData {
  jobId: string
  rateeId: string
  rateeRole: "driver" | "customer"
  drivingSkill: number
  professionalBehavior: number
  punctuality: number
  review?: string
}

export const createRating = (data: CreateRatingData) =>
  api.post<ApiResponse<{ rating: Rating }>>("/api/ratings", data)

export const getDriverRatings = (driverId: string) =>
  api.get<ApiResponse<{ ratings: Rating[] }>>(`/api/ratings/driver/${driverId}`)

export const getMySubmittedRatings = () =>
  api.get<ApiResponse<{ ratedJobIds: string[] }>>("/api/ratings/mine")
