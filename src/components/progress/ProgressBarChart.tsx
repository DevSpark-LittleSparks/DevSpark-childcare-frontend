// ─────────────────────────────────────────────────────────────────────────────
// ProgressBarChart.tsx
// Paginated bar chart showing daily activity engagement hours,
// stacked per activity type (each segment = one activity's hours that day).
// Used by: ParentProgressPage, AdminProgressPage (child view)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DailyEngagement } from '../../types/progress.types';

interface Props {
  data: DailyEngagement[];
  pageSize?: number;
}

// Cycled across whichever activity names show up on the current page
const ACTIVITY_COLORS = ['#06B6D4', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#EC4899', '#84CC16'];

const ProgressBarChart: React.FC<Props> = ({ data, pageSize = 6 }) => {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const paged      = data.slice(page * pageSize, (page + 1) * pageSize);

  const from  = data.length === 0 ? 0 : page * pageSize + 1;
  const to    = Math.min((page + 1) * pageSize, data.length);
  const total = data.length;

  // Distinct activity names on this page — each gets its own stacked segment/color
  const activityNames = Array.from(
    new Set(paged.flatMap(day => day.activities.map(a => a.activityName)))
  );

  // Pivot into recharts-friendly rows: { day, date, "Story Time": 1.5, "Art & Craft": 0.75, ... }
  const chartData = paged.map(day => {
    const row: Record<string, string | number> = { day: day.day, date: day.date };
    day.activities.forEach(a => { row[a.activityName] = a.hours; });
    return row;
  });

  const hasData = paged.some(day => day.activities.length > 0);

  return (
    <div className="w-full">
      {/* Pagination header */}
      <div className="flex items-center justify-end gap-3 mb-3">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="w-8 h-8 rounded-full bg-[#06B6D4] text-white flex items-center justify-center disabled:opacity-30 hover:bg-[#0891B2] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-xs font-bold text-slate-400">
          {data.length === 0 ? 'No data' : `${from} – ${to} of ${total} Days`}
        </span>

        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="w-8 h-8 rounded-full bg-[#06B6D4] text-white flex items-center justify-center disabled:opacity-30 hover:bg-[#0891B2] transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Chart */}
      {!hasData ? (
        <div className="h-52 flex items-center justify-center text-slate-400 text-sm font-bold">
          No engagement data for this range
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" vertical={false} />
            <XAxis
              dataKey="day"
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
              cursor={{ fill: '#f0fdff' }}
              formatter={(value, name) => [`${value} hrs`, name]}
            />
            {activityNames.map((name, i) => (
              <Bar
                key={name}
                dataKey={name}
                name={name}
                stackId="engagement"
                fill={ACTIVITY_COLORS[i % ACTIVITY_COLORS.length]}
                radius={i === activityNames.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ProgressBarChart;
