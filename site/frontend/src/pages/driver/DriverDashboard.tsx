import { useState } from "react"
import { Navigate } from "react-router-dom"
import { Navbar } from "@/components/layout/navbar"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { Tabs } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"
import { BrowseJobsTab } from "./BrowseJobsTab"
import { MyApplicationsTab } from "./MyApplicationsTab"
import { ActiveJobTab } from "./ActiveJobTab"
import { DriverCompletedJobsTab } from "./CompletedJobsTab"

const dashboardTabs = [
  { value: "browse", label: "Browse Jobs" },
  { value: "applications", label: "My Applications" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
]

function DriverDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("browse")

  if (!user?.isProfileComplete) {
    return <Navigate to="/driver/onboarding" replace />
  }

  return (
    <>
      <Navbar activeTab={activeTab} />
      <PageWrapper className="pt-24">
        <div className="mb-1">
          <h1 className="text-[1.75rem] font-bold tracking-tight text-foreground leading-tight">
            Driver Dashboard
          </h1>
          <p className="mt-1 text-[0.9375rem] text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{user?.fullName}</span>. Find and manage your jobs below.
          </p>
        </div>
        <div className="mt-6">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={dashboardTabs} />
        </div>
        <div className="mt-8">
          {activeTab === "browse" && <BrowseJobsTab />}
          {activeTab === "applications" && <MyApplicationsTab />}
          {activeTab === "active" && <ActiveJobTab />}
          {activeTab === "completed" && <DriverCompletedJobsTab />}
        </div>
      </PageWrapper>
    </>
  )
}

export { DriverDashboard }
