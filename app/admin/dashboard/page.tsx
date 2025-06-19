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
import { TeacherWorkloadCard } from "@/components/dashboard/teacher-workload-card";
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
  const { metrics, alerts, fetchDashboardMetrics, fetchSystemAlerts } =
    useStore();

  useEffect(() => {
    fetchSchedules();
    getCurrentSchedule();
    // Fetch dashboard metrics and alerts
    fetchDashboardMetrics();
    fetchSystemAlerts();
  }, [
    getCurrentSchedule,
    fetchSchedules,
    fetchDashboardMetrics,
    fetchSystemAlerts,
  ]);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <p className="text-gray-500">Academic Year 2025-2026</p>
          </div>
        </div>
        {/* Active Schedule Section */}
        {activeSchedule && (
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
        )}
        {alerts.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold">System Alerts</h3>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Key Metrics</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RoomUtilizationCard />
          <ScheduleQualityCard />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <TeacherWorkloadCard />
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Schedule Generation History
            </h3>
          </div>
          <div className="mx-auto">
            <ScheduleHistoryTable
              schedules={schedules.slice(0, 3)}
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
