/**
 * Daily Progress Stacked Bar Chart Component (Dumb Component)
 * Displays daily progress data as a stacked bar chart using Recharts
 * Props only - no state, no Redux calls
 */

import type { FC } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChartData } from '@/types/progress.types';

interface DailyProgressStackedBarChartProps {
  data: ChartData[];
}

export const DailyProgressStackedBarChart: FC<DailyProgressStackedBarChartProps> = ({
  data,
}) => (
  <div className="relative h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `${value}`} />
        <Legend />
        <Bar dataKey="Excellent" fill="#20c997" maxBarSize={40} />
        <Bar dataKey="VeryGood" fill="#3b82f6" maxBarSize={40} />
        <Bar dataKey="Good" fill="#f59e0b" maxBarSize={40} />
        <Bar dataKey="Weak" fill="#ef4444" maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
