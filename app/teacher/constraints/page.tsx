"use client";

import { useState, useEffect } from "react";
import { TeacherLayout } from "@/components/layout/teacher-layout";
import { TimePreferenceGrid } from "@/components/teacher/time-preference-grid";
import { RoomPreferences } from "@/components/teacher/room-preferences";
import { ScheduleDistribution } from "@/components/teacher/schedule-distribution";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/stores/store";
import { Save, RotateCcw, Loader2, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClassroomStore } from "@/lib/stores/classroom.store";

type TimePreference = {
  day: string;
  timeslotId: string;
  preference: "prefer" | "avoid" | "neutral";
};

type RoomPreference = {
  classroomId: string;
  preference: "prefer" | "avoid";
};

type ScheduleDistributionType = {
  maxDaysPerWeek: number;
  maxConsecutiveSessions: number;
  preferCompactSchedule: boolean;
};

export default function TeacherConstraintsPage() {
  const {
    timeslots,
    fetchTimeslots,
  } = useStore();

  const { classrooms, fetchClassrooms } = useClassroomStore();
  const [loading, setLoading] = useState(true);

  const [timePreferences, setTimePreferences] = useState<TimePreference[]>([]);
  const [roomPreferences, setRoomPreferences] = useState<RoomPreference[]>([]);
  const [scheduleDistribution, setScheduleDistribution] =
    useState<ScheduleDistributionType>({
      maxDaysPerWeek: 5,
      maxConsecutiveSessions: 3,
      preferCompactSchedule: false,
    });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("time");

  // Simulate loading data from API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchTimeslots(), fetchClassrooms()]);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchTimeslots, fetchClassrooms]);

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
    setScheduleDistribution(distribution);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Here you would save to your API
    console.log("Saving constraints:", {
      timePreferences,
      roomPreferences,
      scheduleDistribution,
    });
    setHasUnsavedChanges(false);
    // Show success message
  };

  const handleReset = () => {
    setTimePreferences([]);
    setRoomPreferences([]);
    setScheduleDistribution({
      maxDaysPerWeek: 5,
      maxConsecutiveSessions: 3,
      preferCompactSchedule: false,
    });
    setHasUnsavedChanges(false);
  };

  if (loading) {
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
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="time">Time Preferences</TabsTrigger>
              <TabsTrigger value="rooms">Room Preferences</TabsTrigger>
              <TabsTrigger value="distribution">
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
              distribution={scheduleDistribution}
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
                      {scheduleDistribution.maxDaysPerWeek}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Max consecutive sessions:</span>
                    <span className="font-medium">
                      {scheduleDistribution.maxConsecutiveSessions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compact schedule:</span>
                    <span className="font-medium">
                      {scheduleDistribution.preferCompactSchedule
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
