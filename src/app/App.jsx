import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { BillingPage } from '@/pages/billing/BillingPage';
import AdminSidebar from '@/components/layout/ParentSidebar';
import './App.css';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

export const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Elements stripe={stripePromise}>
      <div className="app-container">
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className="main-content"
          style={{ marginLeft: isCollapsed ? '90px' : '280px' }}
        >
          <BillingPage />
        </div>
      </div>
    </Elements>
  );
};