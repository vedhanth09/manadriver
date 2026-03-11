import { useState, useCallback } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { useDropzone } from "react-dropzone"
import { Upload, CheckCircle, X, FileText, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/toast"
import { Navbar } from "@/components/layout/navbar"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CITIES, CITY_AREAS, TRANSMISSION_TYPES, VEHICLE_CATEGORIES } from "@/constants"
import {
  createDriverProfile,
  updateDriverProfile,
  uploadDriverDocuments,
} from "@/services/driver"

// ─── Types ───

type DocStatus = "idle" | "selected" | "uploading" | "uploaded"

interface ProfileData {
  age: string
  address: string
  city: string
  areas: string[]
  transmissionTypes: string[]
  vehicleCategories: string[]
}

interface DocState {
  file: File | null
  status: DocStatus
}

// ─── Sub-components ───

const STEP_LABELS = ["Personal Info", "Location", "Vehicle Skills", "Document Upload"]

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Step {step} of 4
        </span>
        <span className="text-sm text-muted-foreground">
          {STEP_LABELS[step - 1]}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-badge bg-gray-200">
        <div
          className="h-full rounded-badge bg-accent transition-all duration-300 ease-in-out"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
      {/* Step indicators */}
      <div className="mt-3 flex justify-between">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              i + 1 <= step ? "text-accent" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-bold",
                i + 1 < step
                  ? "bg-accent text-white"
                  : i + 1 === step
                    ? "border-2 border-accent text-accent"
                    : "border-2 border-gray-300 text-gray-400"
              )}
            >
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ToggleChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-badge border px-4 py-2 text-sm font-medium transition-colors duration-150",
        selected
          ? "border-accent bg-accent text-white"
          : "border-border bg-white text-foreground hover:border-accent hover:text-accent"
      )}
    >
      {label}
    </button>
  )
}

function DocumentDropzone({
  label,
  docState,
  onDrop,
  onRemove,
}: {
  label: string
  docState: DocState
  onDrop: (file: File) => void
  onRemove: () => void
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => {
      if (accepted[0]) onDrop(accepted[0])
    },
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: docState.status === "uploading" || docState.status === "uploaded",
  })

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {docState.status === "uploading" && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-accent/40 bg-mint-bg p-6">
          <Loader2 className="size-8 animate-spin text-accent" />
          <span className="text-sm text-muted-foreground">Uploading…</span>
        </div>
      )}

      {docState.status === "uploaded" && (
        <div className="flex items-center gap-3 rounded-card border-2 border-accent bg-mint-bg p-4">
          <CheckCircle className="size-5 shrink-0 text-accent" />
          <span className="truncate text-sm font-medium text-foreground">
            {docState.file?.name}
          </span>
          <span className="ml-auto text-xs font-semibold text-accent">
            Uploaded ✓
          </span>
        </div>
      )}

      {docState.status === "selected" && docState.file && (
        <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-4">
          <FileText className="size-5 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-medium text-foreground">
            {docState.file.name}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            {(docState.file.size / 1024).toFixed(0)} KB
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
            aria-label={`Remove ${label}`}
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {docState.status === "idle" && (
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed p-6 transition-colors",
            isDragActive
              ? "border-accent bg-mint-bg"
              : "border-border bg-white hover:border-accent/50 hover:bg-surface"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="size-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {isDragActive ? "Drop file here" : "Drag & drop or click to upload"}
          </span>
          <span className="text-xs text-muted-foreground/70">
            JPEG, PNG, WebP, or PDF — max 5 MB
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ───

function OnboardingPage() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const [profileData, setProfileData] = useState<ProfileData>({
    age: "",
    address: "",
    city: "",
    areas: [],
    transmissionTypes: [],
    vehicleCategories: [],
  })

  const [documents, setDocuments] = useState<Record<string, DocState>>({
    aadhaar: { file: null, status: "idle" },
    pan: { file: null, status: "idle" },
    license: { file: null, status: "idle" },
  })

  // Redirect if profile already complete
  if (user?.isProfileComplete) {
    return <Navigate to="/driver" replace />
  }

  // ─── Helpers ───

  const updateField = (field: keyof ProfileData, value: string | string[]) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: "areas" | "transmissionTypes" | "vehicleCategories", value: string) => {
    setProfileData((prev) => {
      const arr = prev[field] as string[]
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      }
    })
  }

  const handleDocDrop = (key: string, file: File) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: { file, status: "selected" as DocStatus },
    }))
  }

  const handleDocRemove = (key: string) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: { file: null, status: "idle" as DocStatus },
    }))
  }

  // ─── Validation ───

  const canProceed = () => {
    switch (step) {
      case 1: {
        const age = parseInt(profileData.age)
        return (
          !isNaN(age) &&
          age >= 18 &&
          age <= 70 &&
          profileData.address.trim().length > 0
        )
      }
      case 2:
        return profileData.city !== "" && profileData.areas.length > 0
      case 3:
        return (
          profileData.transmissionTypes.length > 0 &&
          profileData.vehicleCategories.length > 0
        )
      case 4:
        return (
          documents.aadhaar.file !== null &&
          documents.pan.file !== null &&
          documents.license.file !== null
        )
      default:
        return false
    }
  }

  // ─── Navigation ───

  const handleNext = () => {
    if (step < 4 && canProceed()) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  // ─── Submit ───

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)

    setDocuments((prev) => ({
      aadhaar: { ...prev.aadhaar, status: "uploading" },
      pan: { ...prev.pan, status: "uploading" },
      license: { ...prev.license, status: "uploading" },
    }))

    try {
      // 1. Create profile (or update if it already exists from a prior attempt)
      const payload = {
        age: parseInt(profileData.age),
        address: profileData.address,
        city: profileData.city,
        areas: profileData.areas,
        transmissionTypes: profileData.transmissionTypes,
        vehicleCategories: profileData.vehicleCategories,
      }

      try {
        await createDriverProfile(payload)
      } catch (err: unknown) {
        const axiosErr = err as { response?: { status?: number } }
        if (axiosErr.response?.status === 409) {
          await updateDriverProfile(payload)
        } else {
          throw err
        }
      }

      // 2. Upload documents
      const docFormData = new FormData()
      if (documents.aadhaar.file) docFormData.append("aadhaar", documents.aadhaar.file)
      if (documents.pan.file) docFormData.append("pan", documents.pan.file)
      if (documents.license.file) docFormData.append("license", documents.license.file)

      await uploadDriverDocuments(docFormData)

      // 3. Mark uploaded
      setDocuments((prev) => ({
        aadhaar: { ...prev.aadhaar, status: "uploaded" },
        pan: { ...prev.pan, status: "uploaded" },
        license: { ...prev.license, status: "uploaded" },
      }))

      // 4. Refresh user context (isProfileComplete → true)
      await refreshUser()

      toast("Profile submitted successfully!", "success")
      navigate("/driver", { replace: true })
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      toast(axiosErr.response?.data?.error || "Failed to submit profile", "error")

      // Reset doc status back to selected
      setDocuments((prev) => ({
        aadhaar: { ...prev.aadhaar, status: prev.aadhaar.file ? "selected" : "idle" },
        pan: { ...prev.pan, status: prev.pan.file ? "selected" : "idle" },
        license: { ...prev.license, status: prev.license.file ? "selected" : "idle" },
      }))
    } finally {
      setSubmitting(false)
    }
  }, [submitting, profileData, documents, navigate, toast, refreshUser])

  // ─── Render steps ───

  const renderStep1 = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-h3 font-semibold text-foreground">Personal Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us about yourself to get started.
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
            Age <span className="text-destructive">*</span>
          </label>
          <Input
            type="number"
            min={18}
            max={70}
            placeholder="e.g. 28"
            value={profileData.age}
            onChange={(e) => updateField("age", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Address <span className="text-destructive">*</span>
        </label>
        <Input
          placeholder="Your full address"
          value={profileData.address}
          onChange={(e) => updateField("address", e.target.value)}
        />
      </div>
    </div>
  )

  const renderStep2 = () => {
    const availableAreas = profileData.city ? CITY_AREAS[profileData.city] ?? [] : []

    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-h3 font-semibold text-foreground">Location</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Where do you want to work?
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            City <span className="text-destructive">*</span>
          </label>
          <Select
            value={profileData.city}
            onChange={(e) => {
              updateField("city", e.target.value)
              updateField("areas", []) // clear areas when city changes
            }}
          >
            <option value="">Select a city</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </div>

        {profileData.city && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Areas <span className="text-destructive">*</span>
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({profileData.areas.length} selected)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {availableAreas.map((area) => (
                <ToggleChip
                  key={area}
                  label={area}
                  selected={profileData.areas.includes(area)}
                  onClick={() => toggleArrayItem("areas", area)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-h3 font-semibold text-foreground">Vehicle Skills</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What types of vehicles can you drive?
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Transmission Types <span className="text-destructive">*</span>
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ({profileData.transmissionTypes.length} selected)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TRANSMISSION_TYPES.map((t) => (
            <ToggleChip
              key={t.value}
              label={t.label}
              selected={profileData.transmissionTypes.includes(t.value)}
              onClick={() => toggleArrayItem("transmissionTypes", t.value)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Vehicle Categories <span className="text-destructive">*</span>
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            ({profileData.vehicleCategories.length} selected)
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          {VEHICLE_CATEGORIES.map((v) => (
            <ToggleChip
              key={v.value}
              label={v.label}
              selected={profileData.vehicleCategories.includes(v.value)}
              onClick={() => toggleArrayItem("vehicleCategories", v.value)}
            />
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-h3 font-semibold text-foreground">Document Upload</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload your documents for verification. All three documents are required.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-1">
        <DocumentDropzone
          label="Aadhaar Card"
          docState={documents.aadhaar}
          onDrop={(file) => handleDocDrop("aadhaar", file)}
          onRemove={() => handleDocRemove("aadhaar")}
        />
        <DocumentDropzone
          label="PAN Card"
          docState={documents.pan}
          onDrop={(file) => handleDocDrop("pan", file)}
          onRemove={() => handleDocRemove("pan")}
        />
        <DocumentDropzone
          label="Driving License"
          docState={documents.license}
          onDrop={(file) => handleDocDrop("license", file)}
          onRemove={() => handleDocRemove("license")}
        />
      </div>
    </div>
  )

  // ─── Page ───

  return (
    <>
      <Navbar />
      <PageWrapper className="pt-24 pb-16">
        <div className="mx-auto max-w-2xl">
          <ProgressBar step={step} />

          {/* Step content card */}
          <div className="rounded-card border border-border bg-white p-6 shadow-card sm:p-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="secondary" onClick={handleBack} disabled={submitting}>
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit for Verification"
                )}
              </Button>
            )}
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export { OnboardingPage }
