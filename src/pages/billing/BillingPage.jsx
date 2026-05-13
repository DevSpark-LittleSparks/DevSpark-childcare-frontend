import React, { useState } from 'react';
import { Download, MessageSquare } from 'lucide-react';

import { useInvoices } from '@/entities/invoice/model/useInvoices';
import { usePaymentMethods } from '@/entities/payment-method/model/usePaymentMethods';

import { BillingSummary } from '@/widgets/billing-summary/BillingSummary';
import { RecentInvoices } from '@/widgets/recent-invoices/RecentInvoices';
import { PaymentMethodsList } from '@/widgets/payment-methods-list/PaymentMethodsList';

import { AddMethodForm } from '@/features/add-payment-method/ui/AddMethodForm';
import { ConfirmPaymentModal } from '@/features/process-payment/ui/ConfirmPaymentModal';
import { PaymentHistoryModal } from '@/features/view-payment-history/ui/PaymentHistoryModal';
import { StatementPreviewModal } from '@/features/download-statement/ui/StatementPreviewModal';

import { Toast } from '@/shared/ui/Toast/Toast';
import { Modal } from '@/shared/ui/Modal/Modal';
import './BillingPage.css';


export const BillingPage = () => {
  const { invoices, outstandingBalance, lastPayment, markAsPaid } = useInvoices();
  const { paymentMethods, selectedMethodIndex, setSelectedMethodIndex, addMethod, removeMethod } = usePaymentMethods();

  const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const executePayment = (invoiceId) => {
    if (paymentMethods.length === 0 || selectedMethodIndex === null || !paymentMethods[selectedMethodIndex]) {
        setInvoiceToPay(null);
        showToast('Transaction failed: No payment method selected or added.');
        return;
    }

    setInvoiceToPay(null);
    showToast('Processing payment securely...');
    setTimeout(() => {
      markAsPaid(invoiceId);
      showToast(`Payment for ${invoiceId} successful!`);
    }, 1500);
  };

  const handleAddMethodSuccess = (newMethod) => {
    addMethod(newMethod);
    setIsAddMethodModalOpen(false);
    showToast('Payment method securely added via Stripe!');
  };

  const handleRemoveMethod = (indexToRemove) => {
    removeMethod(indexToRemove);
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

      <div className="fab" onClick={() => showToast('Opening chat...')}>
        <MessageSquare size={24} />
      </div>

      {/* Modals */}
      <ConfirmPaymentModal 
        isOpen={!!invoiceToPay}
        onClose={() => setInvoiceToPay(null)}
        invoice={invoiceToPay}
        paymentMethod={paymentMethods[selectedMethodIndex]}
        onConfirm={executePayment}
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
            onCancel={() => setIsAddMethodModalOpen(false)}
            onSuccess={handleAddMethodSuccess}
          />
        </Modal>
      )}

      <Toast message={toastMessage} />
    </main>
  );
};
