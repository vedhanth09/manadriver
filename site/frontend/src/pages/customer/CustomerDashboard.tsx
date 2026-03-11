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
      <Navbar />
      <PageWrapper className="pt-24">
        <h1 className="text-h2 font-bold text-foreground">Customer Dashboard</h1>
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
