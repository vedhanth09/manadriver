import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/toast"
import { Navbar } from "@/components/layout/navbar"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { CITIES, TRANSMISSION_TYPES, VEHICLE_CATEGORIES } from "@/constants"
import { createCustomerProfile, updateCustomerProfile } from "@/services/customer"

interface ProfileFormData {
  city: string
  carMake: string
  carModel: string
  transmissionType: string
  vehicleCategory: string
}

function ProfileSetupPage() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState<ProfileFormData>({
    city: "",
    carMake: "",
    carModel: "",
    transmissionType: "",
    vehicleCategory: "",
  })

  // Redirect if profile already complete
  if (user?.isProfileComplete) {
    return <Navigate to="/customer" replace />
  }

  const updateField = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const canSubmit = formData.city.trim().length > 0

  const handleSubmit = async () => {
    if (submitting || !canSubmit) return
    setSubmitting(true)

    try {
      const payload = {
        city: formData.city,
        carDetails:
          formData.carMake || formData.carModel
            ? { make: formData.carMake, model: formData.carModel }
            : undefined,
        preferences:
          formData.transmissionType || formData.vehicleCategory
            ? {
                transmissionType: formData.transmissionType,
                vehicleCategory: formData.vehicleCategory,
              }
            : undefined,
      }

      try {
        await createCustomerProfile(payload)
      } catch (err: unknown) {
        const axiosErr = err as { response?: { status?: number } }
        if (axiosErr.response?.status === 409) {
          await updateCustomerProfile(payload)
        } else {
          throw err
        }
      }

      await refreshUser()

      toast("Profile saved successfully!", "success")
      navigate("/customer", { replace: true })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      toast(axiosErr.response?.data?.error || "Failed to save profile", "error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24 pb-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-h2 font-bold text-foreground">Set Up Your Profile</h1>
            <p className="mt-2 text-muted-foreground">
              Tell us a bit about yourself so we can match you with the right drivers.
            </p>
          </div>

          <div className="rounded-card border border-border bg-white p-6 shadow-card sm:p-8">
            {/* Required Fields */}
            <div className="space-y-5">
              <div>
                <h2 className="text-h3 font-semibold text-foreground">Basic Information</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fields marked with <span className="text-destructive">*</span> are required.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input value={user?.fullName ?? ""} disabled className="bg-surface" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input value={user?.email ?? ""} disabled className="bg-surface" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <Input value={user?.phone ?? ""} disabled className="bg-surface" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    City <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  >
                    <option value="">Select a city</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-8 border-border" />

            {/* Optional Fields */}
            <div className="space-y-5">
              <div>
                <h2 className="text-h3 font-semibold text-foreground">Car Details</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Optional — helps us recommend the best drivers for your vehicle.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Car Make</label>
                  <Input
                    placeholder="e.g. Maruti Suzuki"
                    value={formData.carMake}
                    onChange={(e) => updateField("carMake", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Car Model</label>
                  <Input
                    placeholder="e.g. Swift Dzire"
                    value={formData.carModel}
                    onChange={(e) => updateField("carModel", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-8 border-border" />

            {/* Preferences */}
            <div className="space-y-5">
              <div>
                <h2 className="text-h3 font-semibold text-foreground">Driver Preferences</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Optional — your default preferences when posting jobs.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Preferred Transmission
                  </label>
                  <Select
                    value={formData.transmissionType}
                    onChange={(e) => updateField("transmissionType", e.target.value)}
                  >
                    <option value="">No preference</option>
                    {TRANSMISSION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Preferred Vehicle Category
                  </label>
                  <Select
                    value={formData.vehicleCategory}
                    onChange={(e) => updateField("vehicleCategory", e.target.value)}
                  >
                    <option value="">No preference</option>
                    {VEHICLE_CATEGORIES.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export { ProfileSetupPage }
