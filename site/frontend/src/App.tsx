import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { NotificationProvider } from "@/context/NotificationContext"
import { ToastProvider } from "@/components/ui/toast"
import { LandingPage } from "@/pages/public/LandingPage"
import { LoginPage } from "@/pages/auth/LoginPage"
import { SignupPage } from "@/pages/auth/SignupPage"
import { OnboardingPage } from "@/pages/driver/OnboardingPage"
import { DriverDashboard } from "@/pages/driver/DriverDashboard"
import { ProfileSetupPage } from "@/pages/customer/ProfileSetupPage"
import { CustomerDashboard } from "@/pages/customer/CustomerDashboard"
import { ProtectedRoute } from "@/components/shared/protected-route"
import { RoleRoute } from "@/components/shared/role-route"
import { ErrorBoundary } from "@/components/shared/error-boundary"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
        <ToastProvider>
          <ErrorBoundary>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Driver routes (protected + role-guarded) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<RoleRoute role="driver" />}>
                <Route path="/driver" element={<DriverDashboard />} />
                <Route path="/driver/onboarding" element={<OnboardingPage />} />
              </Route>
            </Route>

            {/* Customer routes (protected + role-guarded) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<RoleRoute role="customer" />}>
                <Route path="/customer" element={<CustomerDashboard />} />
                <Route path="/customer/profile-setup" element={<ProfileSetupPage />} />
              </Route>
            </Route>
          </Routes>
          </ErrorBoundary>
        </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
