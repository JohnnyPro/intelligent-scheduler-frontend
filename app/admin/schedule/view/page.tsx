"use client";
import { AdminSidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { ScheduleCalendar } from "@/components/schedule-calendar"; // Import the new component
import { useStore } from "@/lib/stores/store";
import { useEffect } from "react";
import { useScheduleStore } from "@/lib/stores/schedule.store";

export default function ViewSchedulePage() {
  const { activeSchedule, fetchCurrentSchedule } = useScheduleStore();
  useEffect(() => {
    fetchCurrentSchedule();
  }, [fetchCurrentSchedule]);

  let scheduleData = activeSchedule;
  if (scheduleData == null)
    scheduleData = {
      scheduleId: "null",
      sessions: [],
    };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="View Schedule" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-full space-y-6">
            {" "}
            {/* Use max-w-full for wider calendar */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Fall 2025 - Initial Draft
                </h2>
                <p className="text-gray-500">Generated on May 15, 2025</p>
              </div>
            </div>
            <ScheduleCalendar sessions={scheduleData?.sessions ?? []} />
          </div>
        </main>
      </div>
    </div>
  );
}
