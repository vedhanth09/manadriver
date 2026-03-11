import api from "./api"
import type { ApiResponse, DriverProfile } from "@/types"

export interface CreateDriverProfileData {
  age: number
  address: string
  city: string
  areas: string[]
  transmissionTypes: string[]
  vehicleCategories: string[]
}

export const getDriverProfile = () =>
  api.get<ApiResponse<{ profile: DriverProfile }>>("/api/driver/profile")

export const createDriverProfile = (data: CreateDriverProfileData) =>
  api.post<ApiResponse<{ profile: DriverProfile }>>("/api/driver/profile", data)

export const updateDriverProfile = (data: Partial<CreateDriverProfileData>) =>
  api.patch<ApiResponse<{ profile: DriverProfile }>>("/api/driver/profile", data)

export const uploadDriverDocuments = (formData: FormData) =>
  api.post<ApiResponse<{ profile: DriverProfile }>>("/api/driver/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
