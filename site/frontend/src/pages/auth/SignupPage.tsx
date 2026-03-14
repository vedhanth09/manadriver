import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Car, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { isAxiosError } from "axios"

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignupFormData = z.infer<typeof signupSchema>

function SignupPage() {
  const [role, setRole] = useState<"driver" | "customer">("driver")
  const { signup } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      const userData = await signup({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role,
      })
      toast("Account created successfully!", "success")
      navigate(userData.role === "driver" ? "/driver" : "/customer")
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? err.response?.data?.error || "Signup failed. Please try again."
        : "Signup failed. Please try again."
      toast(message, "error")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            ManaDriver
          </Link>
          <h1 className="mt-4 text-h2 font-bold text-foreground">
            Create an Account
          </h1>
          <p className="mt-2 text-body text-muted-foreground">
            {role === "driver" ? "Join as a Driver" : "Join as a Customer"}
          </p>
        </div>

        {/* Role Toggle Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole("driver")}
            className={cn(
              "flex flex-col items-center gap-3 rounded-card border-2 p-6 transition-all",
              role === "driver"
                ? "border-accent bg-mint-bg shadow-card"
                : "border-border bg-white hover:border-accent/50",
            )}
          >
            <Car
              className={cn(
                "size-8",
                role === "driver" ? "text-accent" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-sm font-semibold",
                role === "driver" ? "text-accent" : "text-muted-foreground",
              )}
            >
              Driver
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={cn(
              "flex flex-col items-center gap-3 rounded-card border-2 p-6 transition-all",
              role === "customer"
                ? "border-accent bg-mint-bg shadow-card"
                : "border-border bg-white hover:border-accent/50",
            )}
          >
            <Users
              className={cn(
                "size-8",
                role === "customer" ? "text-accent" : "text-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-sm font-semibold",
                role === "customer" ? "text-accent" : "text-muted-foreground",
              )}
            >
              Customer
            </span>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-card bg-white p-6 shadow-card"
        >
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Full Name
            </label>
            <Input id="fullName" placeholder="John Doe" {...register("fullName")} />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="9876543210"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-accent hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export { SignupPage }
