"use client";
import { AdminSidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ScheduleCalendar } from "@/components/schedule-calendar"; // Import the new component
import { useEffect } from "react";
import { useScheduleStore } from "@/lib/stores/schedule.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, Play, Trash2, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function ViewSchedulePage() {
  const {
    schedules,
    activeSchedule,
    activate,
    fetchSchedules,
    deleteSchedule,
    fetchCurrentSchedule,
    setActive,
  } = useScheduleStore();

  useEffect(() => {
    fetchSchedules();
    fetchCurrentSchedule();
  }, [fetchSchedules, fetchCurrentSchedule]);

  return (
    <DashboardLayout title="View Schedule">
      <div className="mx-auto max-w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">View Schedules</h1>
          <p className="text-muted-foreground text-sm">
            Manage schedule information and sessions
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1">
            <div className="flex flex-row gap-5 items-center">
              <label className="text-l">Pick a schedule</label>
              <Select
                onValueChange={(val) => setActive(val)}
                value={activeSchedule?.scheduleId}
              >
                <SelectTrigger className="w-[500px] h-[45px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {schedules.map((schedule) => (
                    <SelectItem
                      key={schedule.scheduleId}
                      value={schedule.scheduleId}
                    >
                      <div className="flex items-center flex-row gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-3 w-3 rounded-full ${
                              schedule.isActive ? "bg-green-600" : "bg-gray-300"
                            }`}
                          ></span>

                          {schedule.scheduleName}
                        </div>
                        {schedule.isActive && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Active
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={!activeSchedule || activeSchedule?.isActive}
              variant="outline"
              className="bg-green-600 hover:bg-green-500 text-white  hover:text-white font-semibold shadow-sm"
              onClick={() => {
                activeSchedule?.scheduleId
                  ? activate(activeSchedule?.scheduleId)
                  : null;
              }}
            >
              <Play className="mr-2 h-4 w-4" />
              Activate
            </Button>
            <Button
              disabled={!activeSchedule || activeSchedule?.isActive}
              variant="outline"
              className="bg-red-600 hover:bg-red-500 text-white  hover:text-white font-semibold shadow-sm"
              onClick={() => {
                activeSchedule?.scheduleId
                  ? deleteSchedule(activeSchedule?.scheduleId)
                  : null;
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        <ScheduleCalendar />
      </div>
    </DashboardLayout>
  );
}
