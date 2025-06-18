"use client";

import { useStore } from "@/lib/stores/store";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AlertCard } from "@/components/dashboard/alert-card";
import { ScheduleHistoryTable } from "@/components/dashboard/schedule-history-table";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { CurrentScheduleCard } from "@/components/dashboard/current-schedule-card";
import {
  RoomUtilizationCard,
  ScheduleQualityCard,
} from "@/components/dashboard/analytics-card";
import { useEffect } from "react";
import { useScheduleStore } from "@/lib/stores/schedule.store";

// Quick actions data
const quickActions = [
  {
    id: "1",
    title: "Upload CSV Data",
    icon: "upload",
    link: "/admin/data/csv-upload",
  },
  {
    id: "2",
    title: "Generate Schedule",
    icon: "file-spreadsheet",
    link: "/admin/schedule/generate",
  },
  {
    id: "3",
    title: "View Schedule",
    icon: "calendar",
    link: "/admin/schedule/view",
  },
  {
    id: "4",
    title: "Manage Teachers",
    icon: "users",
    link: "/admin/data/teachers",
  },
];

export default function DashboardPage() {
  const {
    activeSchedule,
    fetchCurrentSchedule: getCurrentSchedule,
    schedules,
    fetchSchedules,
    activate,
    deleteSchedule,
  } = useScheduleStore();
  const { metrics, alerts } = useStore();

  useEffect(() => {
    fetchSchedules();
    getCurrentSchedule();
  }, [getCurrentSchedule, fetchSchedules]);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Academic Year 2025-2026</p>
          </div>
        </div>

        {/* Active Schedule Section */}
        {activeSchedule && (
          <div className="space-y-4">
            <CurrentScheduleCard
              name={activeSchedule.scheduleName}
              lastUpdated={new Date(activeSchedule.createdAt).toLocaleDateString(
                "en-GB",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            />
          </div>
        )}

        {/* Key Metrics Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Key Metrics</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RoomUtilizationCard />
            <ScheduleQualityCard />
          </div>
        </div>

        {/* Schedule History Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Schedule History</h2>
          <div className="mx-auto">
            <ScheduleHistoryTable
              schedules={schedules
                .filter((s) => !s.isActive)
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 3)}
              onActivate={activate}
            />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
