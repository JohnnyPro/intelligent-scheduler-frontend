"use client";

import { StudentLayout } from "@/components/layout/student-layout";
import { ScheduleCalendar } from "@/components/schedule-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthStore from "@/lib/stores/auth-store";
import { useScheduleStore } from "@/lib/stores/schedule.store";
import { useEffect, useMemo } from "react";

export default function StudentSchedulePage() {
  const { user } = useAuthStore();
  const { sessions, fetchCurrentSchedule, isLoading } = useScheduleStore();

  useEffect(() => {
    if (user?.userId) {
      fetchCurrentSchedule();
    }
  }, [user?.userId, fetchCurrentSchedule]);

  const summaryStats = useMemo(() => {
    const uniqueDays = new Set(sessions.map((session) => session.day));
    const courseStats = sessions.reduce((acc, session) => {
      acc[session.courseName] = (acc[session.courseName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const roomStats = sessions.reduce((acc, session) => {
      acc[session.classroomName] = (acc[session.classroomName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalClasses: sessions.length,
      classDays: uniqueDays.size,
      totalHours: sessions.length * 1.5, // Assuming 1.5 hours per session
      courses: courseStats,
      rooms: roomStats,
    };
  }, [sessions]);

  return (
    <StudentLayout title="My Schedule">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome, {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-muted-foreground">View your class schedule</p>
          </div>
        </div>
        <ScheduleCalendar />

        {/* Schedule Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Schedule Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Classes:</span>
                  <span className="font-medium">
                    {summaryStats.totalClasses}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Learning Days:</span>
                  <span className="font-medium">{summaryStats.classDays}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Hours:</span>
                  <span className="font-medium">{summaryStats.totalHours}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(summaryStats.courses)
                  .slice(0, 3)
                  .map(([course, count]) => (
                    <div key={course} className="flex justify-between text-sm">
                      <span>{course}:</span>
                      <span className="font-medium">{count} sessions</span>
                    </div>
                  ))}
                {Object.keys(summaryStats.courses).length === 0 && (
                  <div className="text-sm text-gray-500">
                    No courses assigned
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(summaryStats.rooms)
                  .slice(0, 3)
                  .map(([room, count]) => (
                    <div key={room} className="flex justify-between text-sm">
                      <span>{room}:</span>
                      <span className="font-medium">{count} sessions</span>
                    </div>
                  ))}
                {Object.keys(summaryStats.rooms).length === 0 && (
                  <div className="text-sm text-gray-500">No rooms assigned</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
