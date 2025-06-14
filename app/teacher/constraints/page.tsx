"use client";

import { useState, useEffect } from "react";
import { TeacherLayout } from "@/components/layout/teacher-layout";
import { TimePreferenceGrid } from "@/components/teacher/time-preference-grid";
import { RoomPreferences } from "@/components/teacher/room-preferences";
import { ScheduleDistribution } from "@/components/teacher/schedule-distribution";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, RotateCcw, Loader2, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClassroomStore } from "@/lib/stores/classroom.store";
import {
  TimePreference,
  RoomPreference,
  ScheduleDistributionType,
} from "@/lib/types/constraints.types";
import { useTeacherConstraintsStore } from "@/lib/stores/teacher-constraints.store";

export default function TeacherConstraintsPage() {
  const { classrooms, fetchClassrooms } = useClassroomStore();
  const {
    isLoading,
    startLoading,
    stopLoading,
    hasUnsavedChanges,
    timeslots,
    fetchTimeslots,
    timePreferences,
    roomPreferences,
    scheduleDistributionPreferences,
    setTimePreferences,
    setRoomPreferences,
    setScheduleDistributionPreferences,
    setHasUnsavedChanges,
    fetchTeacherPreferences,
    saveTeacherPreferences,
    resetToDefaults,
  } = useTeacherConstraintsStore();

  const [activeTab, setActiveTab] = useState("time");

  // Simulate loading data from API
  useEffect(() => {
    const loadData = async () => {
      startLoading();
      try {
        await Promise.all([
          fetchTimeslots(),
          fetchClassrooms(),
          fetchTeacherPreferences(),
        ]);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        stopLoading();
      }
    };
    loadData();
  }, [
    fetchTimeslots,
    fetchClassrooms,
    fetchTeacherPreferences,
    startLoading,
    stopLoading,
  ]);

  console.table({
    timeslots,
    classrooms,
    timePreferences,
    roomPreferences,
    scheduleDistributionPreferences,
  });

  const handleTimePreferencesChange = (preferences: TimePreference[]) => {
    setTimePreferences(preferences);
    setHasUnsavedChanges(true);
  };

  const handleRoomPreferencesChange = (preferences: RoomPreference[]) => {
    setRoomPreferences(preferences);
    setHasUnsavedChanges(true);
  };

  const handleScheduleDistributionChange = (
    distribution: ScheduleDistributionType
  ) => {
    setScheduleDistributionPreferences(distribution);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    // Here you would save to your API
    console.log("Saving constraints:", {
      timePreferences,
      roomPreferences,
      scheduleDistributionPreferences,
    });
    await saveTeacherPreferences();
    setHasUnsavedChanges(false);
    // Show success message
  };

  const handleReset = () => {
    resetToDefaults();
  };

  if (isLoading) {
    return (
      <TeacherLayout title="Set Constraints">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading constraints...</span>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout title="Teaching Constraints & Preferences">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600 max-w-2xl">
            Set your teaching preferences to help optimize your schedule. These
            preferences will be considered during the scheduling process, but
            may not always be fully accommodated due to other constraints.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset All
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!hasUnsavedChanges}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Constraints
            </Button>
          </div>
        </div>

        {hasUnsavedChanges && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="py-3">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  You have unsaved changes
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs
          defaultValue="time"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex flex-wrap justify-between items-center mb-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger className="px-5" value="time">
                Time Preferences
              </TabsTrigger>
              <TabsTrigger className="px-5" value="rooms">
                Room Preferences
              </TabsTrigger>
              <TabsTrigger className="px-5" value="distribution">
                Schedule Distribution
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded"></div>
                <span>Preferred</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span>Avoided</span>
              </div>
            </div>
          </div>

          <TabsContent value="time" className="mt-0">
            <TimePreferenceGrid
              timeslots={timeslots}
              preferences={timePreferences}
              onPreferencesChange={handleTimePreferencesChange}
            />
          </TabsContent>

          <TabsContent value="rooms" className="mt-0">
            <RoomPreferences
              rooms={classrooms}
              preferences={roomPreferences}
              onPreferencesChange={handleRoomPreferencesChange}
            />
          </TabsContent>

          <TabsContent value="distribution" className="mt-0">
            <ScheduleDistribution
              distribution={scheduleDistributionPreferences}
              onDistributionChange={handleScheduleDistributionChange}
            />
          </TabsContent>
        </Tabs>

        {/* Summary Card */}
        <Card>
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  Time Preferences
                </h4>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Preferred slots:</span>
                    <span className="font-medium">
                      {
                        timePreferences.filter((p) => p.preference === "prefer")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avoided slots:</span>
                    <span className="font-medium">
                      {
                        timePreferences.filter((p) => p.preference === "avoid")
                          .length
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  Room Preferences
                </h4>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Preferred rooms:</span>
                    <span className="font-medium">
                      {
                        roomPreferences.filter((p) => p.preference === "prefer")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avoided rooms:</span>
                    <span className="font-medium">
                      {
                        roomPreferences.filter((p) => p.preference === "avoid")
                          .length
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2 flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  Schedule Distribution
                </h4>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Max days per week:</span>
                    <span className="font-medium">
                      {scheduleDistributionPreferences.maxDaysPerWeek}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Max consecutive sessions:</span>
                    <span className="font-medium">
                      {scheduleDistributionPreferences.maxConsecutiveSessions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compact schedule:</span>
                    <span className="font-medium">
                      {scheduleDistributionPreferences.preferCompactSchedule
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
}
