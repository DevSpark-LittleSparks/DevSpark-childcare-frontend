import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

import { selectUser } from '@/features/auth/model/authSlice';
import { usePaymentStatusOverview } from '@/entities/revenue/model/usePaymentStatusOverview';
import { PaymentStatusOverview } from '@/widgets/payment-status-overview/PaymentStatusOverview';

import './BillingPage.css';
import './RevenueAnalysisPage.css';

export const PaymentStatusPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  // /admin/* has no route guard yet, so an unauthenticated visit has no user
  // at all here - only hide admin UI when we know the logged-in user is NOT
  // an admin (e.g. a parent/teacher account), not just because nobody is logged in.
  const isAdmin = !user?.role || user.role.toLowerCase() === 'admin';
  const { statusOverview, isLoading, error } = usePaymentStatusOverview();

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <button className="back-link" onClick={() => navigate('/admin/logs')}>
            <ArrowLeft size={16} /> Back to Audit Logs
          </button>
          <h1 className="page-title">Payment Status Overview</h1>
          <p className="page-description">Paid vs pending fees at a glance, to spot overdue payments.</p>
        </div>
      </div>

      {!isAdmin ? (
        <div className="section-container revenue-access-denied">
          <ShieldAlert size={32} />
          <h2 className="section-title">Admins Only</h2>
          <p className="card-subtitle">You don't have permission to view payment status data.</p>
        </div>
      ) : (
        <PaymentStatusOverview statusOverview={statusOverview} isLoading={isLoading} error={error} />
      )}
    </main>
  );
};
