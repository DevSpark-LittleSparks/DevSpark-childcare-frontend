/**
 * Progress Pie Chart Component (Dumb Component)
 * Displays attendance data as a pie chart using Recharts
 * Props only - no state, no Redux calls
 */

import type { FC } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChartData } from '@/types/progress.types';

interface ProgressPieChartProps {
  data: ChartData[];
}

export const ProgressPieChart: FC<ProgressPieChartProps> = ({ data }) => {
  const colors = ['#20c997', '#ef4444']; // Teal for Present, Red for Absent

  return (
    <div className="relative h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={2}
            fill="#8884d8"
            label={false}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index] || `hsl(${(index * 360) / data.length}, 70%, 50%)`}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
              const total = data.reduce((sum, item) => sum + (item.value ?? 0), 0);
              const percentage = total > 0 ? ((numericValue / total) * 100).toFixed(1) : '0.0';
              return [`${percentage}%`, ''];
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            formatter={(value, entry: any) => {
              const { payload } = entry;
              const total = data.reduce((sum, item) => sum + (item.value ?? 0), 0);
              const percentage = total > 0 ? ((payload.value / total) * 100).toFixed(1) : '0.0';
              return <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{value} ({percentage}%)</span>;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
