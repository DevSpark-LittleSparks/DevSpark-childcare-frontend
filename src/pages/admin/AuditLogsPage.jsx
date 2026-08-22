import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

import { useRevenueGrowth } from '@/entities/revenue/model/useRevenueGrowth';
import { usePaymentStatusOverview } from '@/entities/revenue/model/usePaymentStatusOverview';
import { RevenueGrowthCharts } from '@/widgets/revenue-growth-charts/RevenueGrowthCharts';
import { PaymentStatusOverview } from '@/widgets/payment-status-overview/PaymentStatusOverview';
import { formatCurrency } from '@/shared/lib/formatCurrency';

import '@/pages/billing/BillingPage.css';
import '@/pages/billing/RevenueAnalysisPage.css';

const percentChange = (current, previous) => {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
};

const GrowthBadge = ({ value }) => {
  if (value === null) return <p className="card-subtitle">No prior period to compare</p>;
  const isPositive = value >= 0;
  return (
    <p className={`growth-badge ${isPositive ? 'positive' : 'negative'}`}>
      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      {Math.abs(value).toFixed(1)}% vs previous period
    </p>
  );
};

export const AuditLogsPage = () => {
  const { monthlyRevenue, yearlyRevenue, isLoading: revenueLoading, error: revenueError } = useRevenueGrowth();
  const { statusOverview, isLoading: statusLoading, error: statusError } = usePaymentStatusOverview();

  const totalRevenue = monthlyRevenue.reduce((sum, entry) => sum + entry.revenue, 0);
  const averageMonthlyRevenue = monthlyRevenue.length ? totalRevenue / monthlyRevenue.length : 0;

  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const previousMonth = monthlyRevenue[monthlyRevenue.length - 2];
  const momGrowth = currentMonth && previousMonth
    ? percentChange(currentMonth.revenue, previousMonth.revenue)
    : null;

  const currentYear = yearlyRevenue[yearlyRevenue.length - 1];
  const previousYear = yearlyRevenue[yearlyRevenue.length - 2];
  const yoyGrowth = currentYear && previousYear
    ? percentChange(currentYear.revenue, previousYear.revenue)
    : null;

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-description">Review financial activity and payment health for the center.</p>
        </div>
      </div>

      {!revenueLoading && !revenueError && (
        <div className="summary-cards">
          <div className="card">
            <h3 className="card-title">Total Revenue</h3>
            <div className="card-amount last-payment">{formatCurrency(totalRevenue)}</div>
            <p className="card-subtitle">All-time collected payments</p>
          </div>
          <div className="card">
            <h3 className="card-title">This Month</h3>
            <div className="card-amount last-payment">{formatCurrency(currentMonth?.revenue ?? 0)}</div>
            <GrowthBadge value={momGrowth} />
          </div>
          <div className="card">
            <h3 className="card-title">This Year</h3>
            <div className="card-amount last-payment">{formatCurrency(currentYear?.revenue ?? 0)}</div>
            <GrowthBadge value={yoyGrowth} />
          </div>
          <div className="card">
            <h3 className="card-title">Average Monthly Revenue</h3>
            <div className="card-amount last-payment">{formatCurrency(averageMonthlyRevenue)}</div>
            <p className="card-subtitle">Across {monthlyRevenue.length} recorded month{monthlyRevenue.length === 1 ? '' : 's'}</p>
          </div>
        </div>
      )}

      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Revenue Analysis</h2>
        </div>
        <RevenueGrowthCharts
          monthlyRevenue={monthlyRevenue}
          yearlyRevenue={yearlyRevenue}
          isLoading={revenueLoading}
          error={revenueError}
          chartHeight={320}
        />
      </div>

      <PaymentStatusOverview statusOverview={statusOverview} isLoading={statusLoading} error={statusError} />
    </main>
  );
};
