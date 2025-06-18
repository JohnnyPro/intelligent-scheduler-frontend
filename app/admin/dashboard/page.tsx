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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <p className="text-gray-500">Academic Year 2025-2026</p>
          </div>
        </div>

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

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Schedule Generation History
            </h3>
          </div>
          <div className="mx-auto">
            <ScheduleHistoryTable
              schedules={schedules}
              onActivate={activate}
              onDelete={deleteSchedule}
            />
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
  );
}
