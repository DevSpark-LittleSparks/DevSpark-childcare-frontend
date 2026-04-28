/**
 * Progress Bar Chart Component (Dumb Component)
 * Displays engagement data as a bar chart using Recharts
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
  ResponsiveContainer,
} from 'recharts';
import type { ChartData } from '@/types/progress.types';

interface ProgressBarChartProps {
  data: ChartData[];
}

export const ProgressBarChart: FC<ProgressBarChartProps> = ({ data }) => (
  <div className="relative h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" interval={0} fontSize={10} tick={{ fontSize: 10 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#20c997" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
