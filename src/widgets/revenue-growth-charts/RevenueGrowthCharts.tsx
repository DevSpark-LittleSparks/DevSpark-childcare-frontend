import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipContentProps,
} from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import type { MonthlyRevenueEntry, YearlyRevenueEntry } from '@/types/billing.types';
import './RevenueGrowthCharts.css';

const CHART_COLOR = '#06b6d4';
const GRID_COLOR = '#e5e7eb';
const AXIS_COLOR = '#6b7280';

const RevenueTooltip = ({ active, payload, label }: Partial<TooltipContentProps<number, string>>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="revenue-tooltip">
      <p className="revenue-tooltip-label">{label}</p>
      <p className="revenue-tooltip-value">{formatCurrency(Number(payload[0].value))}</p>
    </div>
  );
};

interface RevenueGrowthChartsProps {
  monthlyRevenue: MonthlyRevenueEntry[];
  yearlyRevenue: YearlyRevenueEntry[];
  isLoading: boolean;
  error: string | null;
  onViewAnalysis?: () => void;
  chartHeight?: number;
}

export const RevenueGrowthCharts = ({
  monthlyRevenue,
  yearlyRevenue,
  isLoading,
  error,
  onViewAnalysis,
  chartHeight = 320,
}: RevenueGrowthChartsProps) => {
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');
  // Recharts infers one concrete row shape per chart from its `data` prop -
  // merge both shapes so the same chart can render either series depending
  // on `view`, instead of the row type flip-flopping under it.
  const data: Array<{ month?: string; year?: number; revenue: number }> =
    view === 'monthly' ? monthlyRevenue : yearlyRevenue;
  const dataKey = view === 'monthly' ? 'month' : 'year';

  return (
    <div className="section-container revenue-charts">
      <div className="section-header">
        <h2 className="section-title">Revenue Growth</h2>
        <div className="revenue-header-actions">
          <div className="revenue-toggle" role="tablist" aria-label="Revenue chart range">
            <button
              role="tab"
              aria-selected={view === 'monthly'}
              className={`revenue-toggle-btn ${view === 'monthly' ? 'active' : ''}`}
              onClick={() => setView('monthly')}
            >
              Monthly
            </button>
            <button
              role="tab"
              aria-selected={view === 'yearly'}
              className={`revenue-toggle-btn ${view === 'yearly' ? 'active' : ''}`}
              onClick={() => setView('yearly')}
            >
              Yearly
            </button>
          </div>
          {onViewAnalysis && (
            <button className="revenue-analysis-btn" onClick={onViewAnalysis}>
              View Revenue Analysis <ArrowUpRight size={16} />
            </button>
          )}
        </div>
      </div>

      {isLoading && <p className="revenue-status">Loading revenue data...</p>}
      {!isLoading && error && <p className="revenue-status revenue-status-error">{error}</p>}
      {!isLoading && !error && data.length === 0 && (
        <p className="revenue-status">No revenue recorded yet.</p>
      )}

      {!isLoading && !error && data.length > 0 && (
        <div className="revenue-chart-wrapper">
          <ResponsiveContainer width="100%" height={chartHeight}>
            {view === 'monthly' ? (
              <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid stroke={GRID_COLOR} vertical={false} />
                <XAxis
                  dataKey={dataKey}
                  stroke={AXIS_COLOR}
                  tick={{ fontSize: 12, fill: AXIS_COLOR }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <YAxis
                  stroke={AXIS_COLOR}
                  tick={{ fontSize: 12, fill: AXIS_COLOR }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, '')}
                  width={90}
                />
                <Tooltip content={<RevenueTooltip />} cursor={{ stroke: GRID_COLOR, strokeWidth: 1 }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={CHART_COLOR}
                  strokeWidth={2}
                  strokeLinecap="round"
                  dot={{ r: 4, fill: CHART_COLOR, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid stroke={GRID_COLOR} vertical={false} />
                <XAxis
                  dataKey={dataKey}
                  stroke={AXIS_COLOR}
                  tick={{ fontSize: 12, fill: AXIS_COLOR }}
                  tickLine={false}
                  axisLine={{ stroke: GRID_COLOR }}
                />
                <YAxis
                  stroke={AXIS_COLOR}
                  tick={{ fontSize: 12, fill: AXIS_COLOR }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value).replace(/\.00$/, '')}
                  width={90}
                />
                <Tooltip content={<RevenueTooltip />} cursor={{ fill: 'rgba(6, 182, 212, 0.08)' }} />
                <Bar dataKey="revenue" fill={CHART_COLOR} radius={[4, 4, 0, 0]} maxBarSize={56} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
