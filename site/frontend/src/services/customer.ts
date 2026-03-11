import api from "./api"
import type { ApiResponse, CustomerProfile } from "@/types"

export interface CreateCustomerProfileData {
  city: string
  carDetails?: {
    make: string
    model: string
  }
  preferences?: {
    transmissionType: string
    vehicleCategory: string
  }
}

export const getCustomerProfile = () =>
  api.get<ApiResponse<{ profile: CustomerProfile }>>("/api/customer/profile")

export const createCustomerProfile = (data: CreateCustomerProfileData) =>
  api.post<ApiResponse<{ profile: CustomerProfile }>>("/api/customer/profile", data)

export const updateCustomerProfile = (data: Partial<CreateCustomerProfileData>) =>
  api.patch<ApiResponse<{ profile: CustomerProfile }>>("/api/customer/profile", data)
