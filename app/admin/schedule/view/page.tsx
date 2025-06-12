"use client";
import { AdminSidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ScheduleCalendar } from "@/components/schedule-calendar"; // Import the new component
import { useEffect, useState } from "react";
import { useScheduleStore } from "@/lib/stores/schedule.store";
import { SearchSessionsRequest } from "@/lib/types/schedule.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ViewSchedulePage() {
  const {
    schedules,
    activeSchedule,
    fetchSchedules,
    fetchCurrentSchedule,
    setActive,
    filterSessionsInSchedule,
  } = useScheduleStore();

  useEffect(() => {
    fetchSchedules();
    fetchCurrentSchedule();
  }, [fetchSchedules, fetchCurrentSchedule]);


  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="View Schedule" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-full space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Select onValueChange={(val) => setActive(val)} value={activeSchedule?.scheduleId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Schedules" />
                  </SelectTrigger>
                  <SelectContent>
                    {schedules.map((schedule) => (
                      <SelectItem
                        key={schedule.scheduleId}
                        value={schedule.scheduleId}
                      >
                        {schedule.scheduleName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {activeSchedule && (
                  <p className="text-gray-500">
                    {activeSchedule.isActive ? "Active" : "Inactive"}
                  </p>
                )}
              </div>
            </div>
            <ScheduleCalendar />
          </div>
        </main>
      </div>
    </div>
  );
}
