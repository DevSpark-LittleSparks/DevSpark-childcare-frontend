// ─────────────────────────────────────────────────────────────────────────────
// DailyProgressStackedBarChart.tsx
// Stacked bar chart showing Excellent / Good / VeryGood / Weak counts per day
// Used by: AdminProgressPage (Learning)
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { DailyProgressEntry } from '../../types/progress.types';

interface Props {
  data: DailyProgressEntry[];
}

const COLORS = {
  Excellent: '#10B981',  // green
  Good:      '#F59E0B',  // amber
  VeryGood:  '#3B82F6',  // blue
  Weak:      '#EF4444',  // red
};

const DailyProgressStackedBarChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-52 flex items-center justify-center text-slate-400 text-sm font-bold">
        No progress data for this date
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barSize={40}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            fontSize: 12,
            fontWeight: 700,
          }}
          cursor={{ fill: '#f8fafc' }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, fontWeight: 700, paddingTop: 12 }}
          iconType="circle"
          iconSize={10}
        />
        <Bar dataKey="Excellent" stackId="a" fill={COLORS.Excellent} radius={[0, 0, 0, 0]} />
        <Bar dataKey="Good"      stackId="a" fill={COLORS.Good}      />
        <Bar dataKey="VeryGood"  stackId="a" fill={COLORS.VeryGood}  name="Very Good" />
        <Bar dataKey="Weak"      stackId="a" fill={COLORS.Weak}      radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DailyProgressStackedBarChart;
