// ─────────────────────────────────────────────────────────────────────────────
// ProgressPieChart.tsx
// Donut chart showing attendance rate (Present vs Absent)
// Used by: ParentProgressPage
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { AttendanceStats } from '../../types/progress.types';

interface Props {
  attendance: AttendanceStats;
}

const COLORS = {
  present: '#06B6D4',
  halfDay: '#FBBF24',
  absent:  '#F87171',
};

const ProgressPieChart: React.FC<Props> = ({ attendance }) => {
  const { presentDays, absentDays, halfDays, attendanceRate } = attendance;
  const totalDays = presentDays + (halfDays || 0) + absentDays;
  const pct = (n: number) => (totalDays === 0 ? '0.0' : ((n * 100) / totalDays).toFixed(1));

  const data = [
    { name: 'Present',  value: presentDays || 0, color: COLORS.present },
    { name: 'Half Day', value: halfDays    || 0, color: COLORS.halfDay },
    { name: 'Absent',   value: absentDays  || 0, color: COLORS.absent  },
  ];

  // If all three are 0 show a neutral ring
  const isEmpty = presentDays === 0 && absentDays === 0 && (halfDays || 0) === 0;
  const chartData = isEmpty
    ? [{ name: 'No Data', value: 1, color: '#e2e8f0' }]
    : data;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Donut */}
      <div className="relative">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            {!isEmpty && (
              <Tooltip
                formatter={(value: number, name: string) => [`${value} days`, name]}
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-slate-800">
            {attendanceRate.toFixed(0)}%
          </span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Attendance
          </span>
        </div>
      </div>

      {/* Legend — half-days count as half credit toward the score above, but
          are shown here as their own true share of logged days */}
      <div className="flex gap-6 flex-wrap justify-center">
        <LegendItem color={COLORS.present} label={`Present (${pct(presentDays)}%)`} />
        <LegendItem color={COLORS.halfDay} label={`Half Day (${pct(halfDays || 0)}%)`} />
        <LegendItem color={COLORS.absent}  label={`Absent (${pct(absentDays)}%)`} />
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
    <span className="text-xs text-slate-500 font-bold">{label}</span>
  </div>
);

export default ProgressPieChart;
