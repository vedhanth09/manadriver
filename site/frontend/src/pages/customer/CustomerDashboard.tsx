import { useState } from "react"
import { Navigate } from "react-router-dom"
import { Navbar } from "@/components/layout/navbar"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { Tabs } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"
import { PostJobTab } from "./PostJobTab"
import { MyJobsTab } from "./MyJobsTab"
import { CustomerCompletedJobsTab } from "./CompletedJobsTab"

const dashboardTabs = [
  { value: "post", label: "Post a Job" },
  { value: "my-jobs", label: "My Jobs" },
  { value: "completed", label: "Completed" },
]

function CustomerDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("post")

  if (!user?.isProfileComplete) {
    return <Navigate to="/customer/profile-setup" replace />
  }

  return (
    <>
      <Navbar activeTab={activeTab} />
      <PageWrapper className="pt-24">
        <div className="mb-1">
          <h1 className="text-[1.75rem] font-bold tracking-tight text-foreground leading-tight">
            Customer Dashboard
          </h1>
          <p className="mt-1 text-[0.9375rem] text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{user?.fullName}</span>. Manage your driver requests below.
          </p>
        </div>
        <div className="mt-6">
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={dashboardTabs} />
        </div>
        <div className="mt-8">
          {activeTab === "post" && <PostJobTab onJobCreated={() => setActiveTab("my-jobs")} />}
          {activeTab === "my-jobs" && <MyJobsTab />}
          {activeTab === "completed" && <CustomerCompletedJobsTab />}
        </div>
      </PageWrapper>
    </>
  )
}

export { CustomerDashboard }
