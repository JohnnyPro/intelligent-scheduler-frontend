"use client";

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartProps {
  option: echarts.EChartsOption;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function EChart({ option, loading = false, className = "", style }: EChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart instance
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chartInstance = chartInstanceRef.current;

    // Set loading state
    if (loading) {
      chartInstance.showLoading();
    } else {
      chartInstance.hideLoading();
      chartInstance.setOption(option, true);
    }

    // Handle window resize
    const handleResize = () => {
      chartInstance.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [option, loading]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={chartRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight: '200px', ...style }}
    />
  );
} 