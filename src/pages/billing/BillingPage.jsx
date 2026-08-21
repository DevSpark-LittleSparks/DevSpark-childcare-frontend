import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Download, MessageSquare, LineChart, PieChart, ReceiptText } from 'lucide-react';

import { selectUser } from '@/features/auth/model/authSlice';
import { useParentId } from '@/entities/parent/model/useParentId';
import { useInvoices } from '@/entities/invoice/model/useInvoices';
import { usePaymentMethods } from '@/entities/payment-method/model/usePaymentMethods';
import { apiClient } from '@/services/axiosInstance';
import { stripePromise } from '@/utils/stripeConfig';

import { BillingSummary } from '@/widgets/billing-summary/BillingSummary';
import { RecentInvoices } from '@/widgets/recent-invoices/RecentInvoices';
import { PaymentMethodsList } from '@/widgets/payment-methods-list/PaymentMethodsList';

import { AddMethodForm } from '@/features/add-payment-method/ui/AddMethodForm';
import { AddChargeForm } from '@/features/add-charge/ui/AddChargeForm';
import { ConfirmPaymentModal } from '@/features/process-payment/ui/ConfirmPaymentModal';
import { PaymentHistoryModal } from '@/features/view-payment-history/ui/PaymentHistoryModal';
import { StatementPreviewModal } from '@/features/download-statement/ui/StatementPreviewModal';

import { Toast } from '@/shared/ui/Toast/Toast';
import { Modal } from '@/shared/ui/Modal/Modal';

import './BillingPage.css';

export const BillingPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  // /admin/* has no route guard yet, so an unauthenticated visit has no user
  // at all here - only hide admin UI when we know the logged-in user is NOT
  // an admin (e.g. a parent/teacher account), not just because nobody is logged in.
  const isAdmin = !user?.role || user.role.toLowerCase() === 'admin';

  const { parentId } = useParentId();
  const { invoices, refetch: refetchInvoices, outstandingBalance, lastPayment } = useInvoices(parentId);
  const { paymentMethods, selectedMethodIndex, setSelectedMethodIndex, addMethod, removeMethod } = usePaymentMethods(parentId);

  const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const executePayment = async (invoice) => {
    const selectedMethod = selectedMethodIndex !== null ? paymentMethods[selectedMethodIndex] : null;
    if (!selectedMethod) {
      setInvoiceToPay(null);
      showToast('Transaction failed: No payment method selected or added.');
      return;
    }

    setIsPaying(true);
    try {
      const { data } = await apiClient.post('/api/v1/payments/process', {
        parentId,
        paymentId: invoice.paymentId,
        savedCardId: selectedMethod.cardDetailsId,
      });
      let result = data.data;

      if (result.requiresAction) {
        const stripe = await stripePromise;
        const { error, paymentIntent } = await stripe.confirmCardPayment(result.clientSecret);
        if (error) {
          showToast(`Payment failed: ${error.message}`);
          return;
        }
        const confirmRes = await apiClient.post('/api/v1/payments/confirm', {
          parentId,
          paymentId: invoice.paymentId,
          paymentIntentId: paymentIntent.id,
        });
        result = confirmRes.data.data;
      }

      await refetchInvoices();
      showToast(`Payment for ${invoice.id} successful!`);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsPaying(false);
      setInvoiceToPay(null);
    }
  };

  const handleAddCharge = async ({ chargeType, description, amount }) => {
    const { data } = await apiClient.post('/api/v1/payments/additional-charge', {
      parentId,
      chargeType,
      description,
      amount,
    });
    const charge = data.data;
    setIsChargeModalOpen(false);
    setInvoiceToPay({
      id: `#PAY-${charge.paymentId.slice(0, 8).toUpperCase()}`,
      paymentId: charge.paymentId,
      description: charge.description,
      amount: charge.amount,
      status: 'Pending',
    });
  };

  const handleAddMethodSuccess = async () => {
    await addMethod();
    setIsAddMethodModalOpen(false);
    showToast('Payment method securely added via Stripe!');
  };

  const handleRemoveMethod = async (indexToRemove) => {
    const method = paymentMethods[indexToRemove];
    if (!method) return;
    await removeMethod(method.cardDetailsId);
    showToast('Payment method removed');
  };

  const executeDownload = () => {
    setIsStatementModalOpen(false);
    showToast('Statement downloaded successfully!');
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments & Invoices</h1>
          <p className="page-description">Manage your billing methods and view transaction history.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsStatementModalOpen(true)}>
          <Download size={18} /> Statement
        </button>
      </div>

      <BillingSummary
        outstandingBalance={outstandingBalance}
        lastPayment={lastPayment}
      />

      {isAdmin && (
        <div className="analytics-links">
          <button className="revenue-analysis-link" onClick={() => navigate('/admin/revenue-analysis')}>
            <LineChart size={18} /> Review Revenue Analysis
          </button>
          <button className="revenue-analysis-link" onClick={() => navigate('/admin/payment-status')}>
            <PieChart size={18} /> Payment Status Overview
          </button>
        </div>
      )}

      {parentId && (
        <div className="analytics-links">
          <button className="revenue-analysis-link" onClick={() => setIsChargeModalOpen(true)}>
            <ReceiptText size={18} /> Add Additional Charge
          </button>
        </div>
      )}

      <PaymentMethodsList
        paymentMethods={paymentMethods}
        selectedMethodIndex={selectedMethodIndex}
        onSelectMethod={setSelectedMethodIndex}
        onRemoveMethod={handleRemoveMethod}
        onAddMethodClick={() => setIsAddMethodModalOpen(true)}
      />

      <RecentInvoices
        invoices={invoices.slice(0, 3)}
        onPayNow={setInvoiceToPay}
        onViewHistory={() => setIsHistoryModalOpen(true)}
      />

      <div className="fab" onClick={() => navigate(isAdmin ? '/admin/messages' : '/parent/messages')}>
        <MessageSquare size={24} />
      </div>

      {/* Modals */}
      <ConfirmPaymentModal
        isOpen={!!invoiceToPay}
        onClose={() => setInvoiceToPay(null)}
        invoice={invoiceToPay}
        paymentMethod={selectedMethodIndex !== null ? paymentMethods[selectedMethodIndex] : null}
        onConfirm={executePayment}
        isSubmitting={isPaying}
      />

      <PaymentHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        invoices={invoices}
        onDownloadReceipt={(id) => showToast(`Downloading receipt for ${id}...`)}
      />

      <StatementPreviewModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        lastPayment={lastPayment}
        outstandingBalance={outstandingBalance}
        onDownload={executeDownload}
      />

      {/* Add Method uses the generic Modal wrapper */}
      {isAddMethodModalOpen && (
        <Modal
          isOpen={isAddMethodModalOpen}
          onClose={() => setIsAddMethodModalOpen(false)}
          title="Add Payment Method"
        >
          <AddMethodForm
            parentId={parentId}
            onCancel={() => setIsAddMethodModalOpen(false)}
            onSuccess={handleAddMethodSuccess}
          />
        </Modal>
      )}

      {/* Add Additional Charge uses the generic Modal wrapper */}
      {isChargeModalOpen && (
        <Modal
          isOpen={isChargeModalOpen}
          onClose={() => setIsChargeModalOpen(false)}
          title="Add Additional Charge"
        >
          <AddChargeForm
            onCancel={() => setIsChargeModalOpen(false)}
            onSubmit={handleAddCharge}
          />
        </Modal>
      )}

      <Toast message={toastMessage} />
    </main>
  );
};
