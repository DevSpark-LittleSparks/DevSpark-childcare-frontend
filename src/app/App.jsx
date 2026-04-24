import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Sidebar } from '@/widgets/sidebar/Sidebar';
import { BillingPage } from '@/pages/billing/BillingPage';
import './App.css'; // Global styles

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

export const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="app-container">
        <Sidebar />
        <BillingPage />
      </div>
    </Elements>
  );
};
