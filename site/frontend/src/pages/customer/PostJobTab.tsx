import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Briefcase, Clock, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { createJob, type CreateJobData } from "@/services/jobs"
import { CAR_TYPES, TRANSMISSION_TYPES, CITIES, CITY_AREAS } from "@/constants"
import { isAxiosError } from "axios"
import type { JobType } from "@/types"

// ─── Schemas per job type ───

const baseFields = {
  city: z.string().min(1, "City is required"),
  areas: z.array(z.string()).optional(),
  startLocation: z.string().min(1, "Start location is required"),
  carType: z.string().min(1, "Car type is required"),
  transmissionType: z.string().min(1, "Transmission type is required"),
}

const hourlySchema = z.object({
  ...baseFields,
  endLocation: z.string().min(1, "End location is required"),
  estimatedDuration: z.coerce.number().min(1, "Duration must be at least 1 hour"),
  expectedPayout: z.coerce.number().min(1, "Payout is required"),
})

const temporarySchema = z.object({
  ...baseFields,
  endLocation: z.string().min(1, "End location is required"),
  durationDays: z.coerce.number().min(1, "Duration must be at least 1 day"),
  dailyPayment: z.coerce.number().min(1, "Daily payment is required"),
})

const permanentSchema = z.object({
  ...baseFields,
  workingHours: z.enum(["12hr", "24x7"], { message: "Working hours is required" }),
  monthlySalary: z.coerce.number().min(1, "Monthly salary is required"),
})

const schemaMap = {
  hourly: hourlySchema,
  temporary: temporarySchema,
  permanent: permanentSchema,
} as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormValues = Record<string, any>

const jobTypeCards: { value: JobType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: "hourly", label: "Hourly", icon: <Clock className="size-5" />, description: "Short trip or a few hours" },
  { value: "temporary", label: "Temporary", icon: <CalendarDays className="size-5" />, description: "Multi-day engagement" },
  { value: "permanent", label: "Permanent", icon: <Briefcase className="size-5" />, description: "Full-time monthly driver" },
]

function PostJobTab({ onJobCreated }: { onJobCreated?: () => void }) {
  const [jobType, setJobType] = useState<JobType>("hourly")
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schemaMap[jobType]) as any,
    defaultValues: {
      city: "",
      areas: [],
      startLocation: "",
      carType: "",
      transmissionType: "",
    },
  })

  const selectedCity = watch("city")
  const availableAreas = selectedCity ? CITY_AREAS[selectedCity] || [] : []

  const handleTypeChange = (type: JobType) => {
    setJobType(type)
    reset({
      city: "",
      areas: [],
      startLocation: "",
      carType: "",
      transmissionType: "",
    })
  }

  const onSubmit = async (data: FormValues) => {
    try {
      await createJob({ ...data, jobType } as CreateJobData)
      toast("Job posted successfully!", "success")
      reset()
      onJobCreated?.()
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? err.response?.data?.error || "Failed to post job"
        : "Failed to post job"
      toast(message, "error")
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Job type selector */}
      <div className="mb-8">
        <label className="mb-3 block text-sm font-medium text-foreground">Job Type</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {jobTypeCards.map((card) => (
            <button
              key={card.value}
              type="button"
              onClick={() => handleTypeChange(card.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-card border-2 p-4 text-center transition-all duration-150",
                jobType === card.value
                  ? "border-accent bg-mint-bg text-accent"
                  : "border-border bg-white text-muted-foreground hover:border-accent/40"
              )}
            >
              {card.icon}
              <span className="text-sm font-semibold">{card.label}</span>
              <span className="text-xs">{card.description}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Common fields */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">City</label>
            <Select {...register("city")}>
              <option value="">Select city</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message as string}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Areas (optional)</label>
            <Select {...register("areas")} multiple className="min-h-[80px]" disabled={!selectedCity}>
              {availableAreas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {jobType === "permanent" ? "Work Location" : "Start Location"}
          </label>
          <Input
            placeholder={jobType === "permanent" ? "e.g. Bandra West, Mumbai" : "e.g. Andheri Station"}
            {...register("startLocation")}
          />
          {errors.startLocation && <p className="mt-1 text-xs text-red-600">{errors.startLocation.message as string}</p>}
        </div>

        {/* End location — hourly & temporary only */}
        {jobType !== "permanent" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">End Location</label>
            <Input
              placeholder="e.g. Airport Terminal 2"
              {...register("endLocation")}
            />
            {errors.endLocation && (
              <p className="mt-1 text-xs text-red-600">
                {errors.endLocation.message as string}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Car Type</label>
            <Select {...register("carType")}>
              <option value="">Select car type</option>
              {CAR_TYPES.map((ct) => (
                <option key={ct.value} value={ct.value}>{ct.label}</option>
              ))}
            </Select>
            {errors.carType && <p className="mt-1 text-xs text-red-600">{errors.carType.message as string}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Transmission Type</label>
            <Select {...register("transmissionType")}>
              <option value="">Select transmission</option>
              {TRANSMISSION_TYPES.map((tt) => (
                <option key={tt.value} value={tt.value}>{tt.label}</option>
              ))}
            </Select>
            {errors.transmissionType && (
              <p className="mt-1 text-xs text-red-600">{errors.transmissionType.message as string}</p>
            )}
          </div>
        </div>

        {/* ─── Hourly-specific fields ─── */}
        {jobType === "hourly" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Estimated Duration (hours)</label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 3"
                {...register("estimatedDuration")}
              />
              {errors.estimatedDuration && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.estimatedDuration.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Expected Payout (₹)</label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 500"
                {...register("expectedPayout")}
              />
              {errors.expectedPayout && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.expectedPayout.message as string}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─── Temporary-specific fields ─── */}
        {jobType === "temporary" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Duration (days)</label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 5"
                {...register("durationDays")}
              />
              {errors.durationDays && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.durationDays.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Daily Payment (₹)</label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 800"
                {...register("dailyPayment")}
              />
              {errors.dailyPayment && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.dailyPayment.message as string}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─── Permanent-specific fields ─── */}
        {jobType === "permanent" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Working Hours</label>
              <Select {...register("workingHours")}>
                <option value="">Select working hours</option>
                <option value="12hr">12 Hours</option>
                <option value="24x7">24x7</option>
              </Select>
              {errors.workingHours && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.workingHours.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Monthly Salary (₹)</label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 25000"
                {...register("monthlySalary")}
              />
              {errors.monthlySalary && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.monthlySalary.message as string}
                </p>
              )}
            </div>
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Job"}
        </Button>
      </form>
    </div>
  )
}

export { PostJobTab }
