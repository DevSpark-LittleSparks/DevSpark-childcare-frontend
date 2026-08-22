import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, TrendingUp, TrendingDown, ShieldAlert } from 'lucide-react';

import { selectUser } from '@/features/auth/model/authSlice';
import { useRevenueGrowth } from '@/entities/revenue/model/useRevenueGrowth';
import { RevenueGrowthCharts } from '@/widgets/revenue-growth-charts/RevenueGrowthCharts';
import { formatCurrency } from '@/shared/lib/formatCurrency';

import './BillingPage.css';
import './RevenueAnalysisPage.css';

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

export const RevenueAnalysisPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  // /admin/* has no route guard yet, so an unauthenticated visit has no user
  // at all here - only hide admin UI when we know the logged-in user is NOT
  // an admin (e.g. a parent/teacher account), not just because nobody is logged in.
  const isAdmin = !user?.role || user.role.toLowerCase() === 'admin';
  const { monthlyRevenue, yearlyRevenue, isLoading, error } = useRevenueGrowth();

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

  const monthlyBreakdown = monthlyRevenue.map((entry, index) => ({
    ...entry,
    change: index > 0 ? percentChange(entry.revenue, monthlyRevenue[index - 1].revenue) : null,
  })).slice().reverse();

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <button className="back-link" onClick={() => navigate('/admin/logs')}>
            <ArrowLeft size={16} /> Back to Audit Logs
          </button>
          <h1 className="page-title">Revenue Analysis</h1>
          <p className="page-description">A closer look at income trends across months and years.</p>
        </div>
      </div>

      {!isAdmin ? (
        <div className="section-container revenue-access-denied">
          <ShieldAlert size={32} />
          <h2 className="section-title">Admins Only</h2>
          <p className="card-subtitle">You don't have permission to view revenue analysis.</p>
        </div>
      ) : (
        <>
          {!isLoading && !error && (
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

          <RevenueGrowthCharts
            monthlyRevenue={monthlyRevenue}
            yearlyRevenue={yearlyRevenue}
            isLoading={isLoading}
            error={error}
            chartHeight={380}
          />

          {!isLoading && !error && monthlyBreakdown.length > 0 && (
            <div className="section-container">
              <div className="section-header">
                <h2 className="section-title">Monthly Breakdown</h2>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Revenue</th>
                    <th>Change vs Previous Month</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyBreakdown.map((entry) => (
                    <tr key={entry.month}>
                      <td className="text-bold">{entry.month}</td>
                      <td>{formatCurrency(entry.revenue)}</td>
                      <td>
                        {entry.change === null ? (
                          <span className="card-subtitle">—</span>
                        ) : (
                          <span className={`growth-badge inline ${entry.change >= 0 ? 'positive' : 'negative'}`}>
                            {entry.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {Math.abs(entry.change).toFixed(1)}%
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
};
