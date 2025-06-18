"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EChart } from "@/components/charts/EChart";
import { useEffect, useState } from "react";
import * as repository from "@/lib/repositories/repository";
import type { EChartsOption } from "echarts";

interface TeacherWorkloadData {
  teacherId: string;
  teacherName: string;
  totalSessions: number;
  preferenceSatisfactionRatio: number;
  dailySessions: number[];
}

export function TeacherWorkloadCard() {
  const [data, setData] = useState<TeacherWorkloadData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { success, data: workloadData } = await repository.getTeacherWorkload();
        if (success && workloadData) {
          setData(workloadData);
        }
      } catch (error) {
        console.error('Error fetching teacher workload:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOption: EChartsOption = {
    angleAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      axisLabel: {
        fontSize: 10
      }
    },
    radiusAxis: {
      max: Math.max(...data.flatMap(t => t.dailySessions), 5),
      axisLabel: {
        fontSize: 10
      }
    },
    polar: {
      radius: '60%'
    },
    series: data.slice(0, 5).map((teacher, index) => ({
      type: 'bar',
      data: teacher.dailySessions,
      coordinateSystem: 'polar',
      name: teacher.teacherName.split(' ').map(n => n[0]).join(''),
      stack: 'teacher',
      itemStyle: {
        color: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
        ][index % 5]
      }
    })),
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      itemGap: 10,
      textStyle: {
        fontSize: 10
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        return `${params.seriesName}<br/>${dayNames[params.dataIndex]}: ${params.value} sessions`;
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Teacher Workload Distribution</CardTitle>
        <p className="text-sm text-gray-500">Daily sessions per teacher (top 5)</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <EChart option={chartOption} loading={loading} />
        </div>
        {data.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Preference Satisfaction</h4>
            <div className="space-y-1">
              {data.slice(0, 3).map((teacher) => (
                <div key={teacher.teacherId} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {teacher.teacherName}
                  </span>
                  <span className="font-medium">
                    {(teacher.preferenceSatisfactionRatio * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 