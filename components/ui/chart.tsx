'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  AreaChart as RechartsAreaChart,
  RadarChart as RechartsRadarChart,
  RadialBarChart as RechartsRadialBarChart,
} from 'recharts';

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ResponsiveContainer>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('relative w-full h-80', className)}>
    <ResponsiveContainer {...props} />
  </div>
));
ChartContainer.displayName = 'ChartContainer';

const Chart = ChartContainer; // Alias for consistency

const BarChart = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsBarChart>
>((props, ref) => <RechartsBarChart ref={ref as any} {...props} />);
BarChart.displayName = 'BarChart';

const LineChart = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsLineChart>
>((props, ref) => <RechartsLineChart ref={ref as any} {...props} />);
LineChart.displayName = 'LineChart';

const PieChart = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPieChart>
>((props, ref) => <RechartsPieChart ref={ref as any} {...props} />);
PieChart.displayName = 'PieChart';

const AreaChart = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsAreaChart>
>((props, ref) => <RechartsAreaChart ref={ref as any} {...props} />);
AreaChart.displayName = 'AreaChart';

const RadarChart = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsRadarChart>
>((props, ref) => <RechartsRadarChart ref={ref as any} {...props} />);
RadarChart.displayName = 'RadarChart';

const RadialBarChart = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsRadialBarChart>
>((props, ref) => <RechartsRadialBarChart ref={ref as any} {...props} />);
RadialBarChart.displayName = 'RadialBarChart';

export {
  ChartContainer,
  Chart,
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  RadarChart,
  RadialBarChart,
}; 