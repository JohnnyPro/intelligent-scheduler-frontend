"use client"

import { useStore } from "@/lib/stores/store"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MetricCard } from "@/components/metric-card"
import { AlertCard } from "@/components/alert-card"
import { ScheduleHistoryTable } from "@/components/schedule-history-table"
import { QuickActionCard } from "@/components/quick-action-card"
import { CurrentScheduleCard } from "@/components/current-schedule-card"
import { RoomUtilizationCard, ScheduleQualityCard } from "@/components/analytics-card"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Quick actions data
const quickActions = [
  {
    id: "1",
    title: "Upload CSV Data",
    icon: "upload",
    link: "#",
  },
  {
    id: "2",
    title: "Add New Teacher",
    icon: "user-plus",
    link: "/data/teachers",
  },
  {
    id: "3",
    title: "Export Schedule",
    icon: "download",
    link: "#",
  },
  {
    id: "4",
    title: "System Settings",
    icon: "settings",
    link: "/admin/settings",
  },
]

export default function DashboardPage() {
  const { isAuthenticated, metrics, alerts, schedules, currentSchedule } = useStore()

  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <p className="text-gray-500">Academic Year 2025-2026</p>
          </div>
        </div>
        "FIX THE BELOW CARD"
        {currentSchedule && <CurrentScheduleCard name={"New Name"} lastUpdated={"21/09/2002"} />}

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Alerts & Notifications</h3>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:underline">
              View All
            </a>
          </div>
          <div>
            {alerts.slice(0, 3).map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Key Metrics</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Schedule Generation History</h3>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:underline">
              View All History
            </a>
          </div>
          <ScheduleHistoryTable schedules={schedules.slice(0, 3)} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RoomUtilizationCard />
          <ScheduleQualityCard />
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
