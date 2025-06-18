"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EChart } from "@/components/charts/EChart";
import { useEffect, useState } from "react";
import * as repository from "@/lib/repositories/repository";
import type { EChartsOption } from "echarts";

interface RoomUtilizationData {
  overall: number;
  byBuilding: Array<{
    buildingId: string;
    buildingName: string;
    utilization: number;
    totalMinutesScheduled: number;
    totalMinutesAvailable: number;
  }>;
}

export function RoomUtilizationCard() {
  const [data, setData] = useState<RoomUtilizationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { success, data: utilData } =
          await repository.getRoomUtilization();
        if (success && utilData) {
          setData(utilData);
        }
      } catch (error) {
        console.error("Error fetching room utilization:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOption: EChartsOption = {
    title: {
      text: data ? `${data.overall.toFixed(1)}%` : "0%",
      left: "center",
      top: "center",
      textStyle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#374151",
      },
      subtext: "Overall Utilization",
      subtextStyle: {
        fontSize: 12,
        color: "#6B7280",
      },
    },
    series: [
      {
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 0,
            borderColor: "#464646",
            color: "#3B82F6",
          },
        },
        axisLine: {
          lineStyle: {
            width: 8,
            color: [[1, "#E5E7EB"]],
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        data: [
          {
            value: data?.overall || 0,
            itemStyle: {
              color:
                data && data.overall > 80
                  ? "#EF4444"
                  : data && data.overall > 60
                  ? "#F59E0B"
                  : "#10B981",
            },
          },
        ],
        detail: {
          show: false,
        },
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Room Utilization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <EChart option={chartOption} loading={loading} />
        </div>
        {data && data.byBuilding.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">By Building</h4>
            {data.byBuilding.slice(0, 3).map((building) => (
              <div
                key={building.buildingId}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{building.buildingName}</span>
                <span className="font-medium">
                  {building.utilization.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ScheduleQualityData {
  roomUtilization: number;
  teacherPreferenceSatisfaction: number;
  teacherWorkloadBalance: number;
  studentGroupConflictRate: number;
  scheduleCompactness: number;
  overallScore: number;
}

export function ScheduleQualityCard() {
  const [data, setData] = useState<ScheduleQualityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { success, data: qualityData } =
          await repository.getScheduleQuality();
        if (success && qualityData) {
          setData(qualityData);
        }
      } catch (error) {
        console.error("Error fetching schedule quality:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOption: EChartsOption = {
    radar: {
      indicator: [
        { name: "Room\nUtilization", max: 100 },
        { name: "Teacher\nPreferences", max: 100 },
        { name: "Workload\nBalance", max: 100 },
        { name: "Conflict\nRate", max: 100 },
        { name: "Schedule\nCompactness", max: 100 },
      ],
      radius: "60%",
      center: ["50%", "50%"],
      name: {
        textStyle: {
          fontSize: 10,
          color: "#6B7280",
        },
      },
      splitArea: {
        areaStyle: {
          color: ["rgba(59, 130, 246, 0.05)", "rgba(59, 130, 246, 0.1)"],
        },
      },
      axisLine: {
        lineStyle: {
          color: "#E5E7EB",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#E5E7EB",
        },
      },
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: data
              ? [
                  data.roomUtilization,
                  data.teacherPreferenceSatisfaction,
                  data.teacherWorkloadBalance,
                  data.studentGroupConflictRate,
                  data.scheduleCompactness,
                ]
              : [0, 0, 0, 0, 0],
            name: "Current Schedule",
            itemStyle: {
              color: "#3B82F6",
            },
            areaStyle: {
              color: "rgba(59, 130, 246, 0.2)",
            },
          },
        ],
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Schedule Quality Metrics
        </CardTitle>
        {data && (
          <p className="text-sm text-gray-500">
            Overall Score:{" "}
            <span className="font-semibold">
              {data.overallScore.toFixed(1)}%
            </span>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <EChart option={chartOption} loading={loading} />
        </div>
      </CardContent>
    </Card>
  );
}
