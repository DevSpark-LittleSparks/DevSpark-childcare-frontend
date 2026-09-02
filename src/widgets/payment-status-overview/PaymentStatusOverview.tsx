import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import './PaymentStatusOverview.css';

const STATUS_COLORS = {
  Paid: '#059669',
  Pending: '#d97706',
};

const StatusTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { status, count, amount } = payload[0].payload;
  return (
    <div className="status-tooltip">
      <p className="status-tooltip-label">{status}</p>
      <p className="status-tooltip-value">{formatCurrency(amount)}</p>
      <p className="status-tooltip-count">{count} payment{count === 1 ? '' : 's'}</p>
    </div>
  );
};

export const PaymentStatusOverview = ({ statusOverview, isLoading, error }) => {
  const totalCount = statusOverview.reduce((sum, entry) => sum + entry.count, 0);
  const pending = statusOverview.find((entry) => entry.status === 'Pending');

  return (
    <div className="section-container payment-status-overview">
      <div className="section-header">
        <h2 className="section-title">Payment Status Overview</h2>
      </div>

      {isLoading && <p className="status-overview-status">Loading payment status...</p>}
      {!isLoading && error && <p className="status-overview-status status-overview-status-error">{error}</p>}
      {!isLoading && !error && totalCount === 0 && (
        <p className="status-overview-status">No payment records yet.</p>
      )}

      {!isLoading && !error && totalCount > 0 && (
        <div className="status-overview-body">
          <div className="status-pie-wrapper">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusOverview}
                  dataKey="amount"
                  nameKey="status"
                  innerRadius={64}
                  outerRadius={96}
                  paddingAngle={2}
                  cornerRadius={4}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {statusOverview.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#9ca3af'} />
                  ))}
                </Pie>
                <Tooltip content={<StatusTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="status-legend">
            {statusOverview.map((entry) => {
              const percentage = totalCount ? ((entry.count / totalCount) * 100).toFixed(1) : 0;
              return (
                <div key={entry.status} className="status-legend-item">
                  <div className="status-legend-header">
                    <span
                      className="status-legend-dot"
                      style={{ backgroundColor: STATUS_COLORS[entry.status] ?? '#9ca3af' }}
                    />
                    <span className="status-legend-label">{entry.status}</span>
                    <span className="status-legend-percentage">{percentage}%</span>
                  </div>
                  <div className="status-legend-amount">{formatCurrency(entry.amount)}</div>
                  <div className="status-legend-count">{entry.count} payment{entry.count === 1 ? '' : 's'}</div>
                </div>
              );
            })}

            {pending && pending.count > 0 && (
              <div className="status-overdue-callout">
                <AlertTriangle size={16} />
                {pending.count} payment{pending.count === 1 ? '' : 's'} ({formatCurrency(pending.amount)}) still pending
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
