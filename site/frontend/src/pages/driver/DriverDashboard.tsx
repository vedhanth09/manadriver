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
      <Navbar />
      <PageWrapper className="pt-24">
        <h1 className="text-h2 font-bold text-foreground">Driver Dashboard</h1>
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
