"use client"
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Download, Filter, Grid, List } from "lucide-react";
import { ScheduleCalendar } from "@/components/schedule-calendar"; // Import the new component
import { useStore } from "@/lib/stores/store"
import { useEffect } from "react";


export default function ViewSchedulePage() {
  const { currentSchedule, fetchCurrentSchedule } = useStore()
  useEffect(() => {
    fetchCurrentSchedule();
  }, [fetchCurrentSchedule]);

  let scheduleData = currentSchedule;
  if (scheduleData == null)
    scheduleData = {
      "scheduleId": "null",
      "sessions": []
    }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="View Schedule" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-full space-y-6"> {/* Use max-w-full for wider calendar */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Fall 2025 - Initial Draft</h2>
                <p className="text-gray-500">Generated on May 15, 2025</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="rounded-lg border bg-white">
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">May 15 - May 21, 2025</span>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    Today
                  </Button>
                  <div className="flex rounded-md border">
                    {/* These buttons can be used to toggle different views in the future */}
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none rounded-l-md border-r bg-gray-100">
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-r">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none rounded-r-md">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* === Replace the old static grid with our new dynamic component === */}
              <ScheduleCalendar sessions={scheduleData?.sessions ?? []} />

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}