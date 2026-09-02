import React from 'react';
import { Modal } from '@/shared/ui/Modal/Modal';
import { formatCurrency } from '@/shared/lib/formatCurrency';

export const ConfirmPaymentModal = ({ isOpen, onClose, invoice, paymentMethod, onConfirm, isSubmitting }) => {
  if (!isOpen || !invoice) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Payment" maxWidth="400px">
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>You are about to pay</p>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
          {formatCurrency(invoice.amount)}
        </div>
        <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', textAlign: 'left', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Invoice</span>
            <span style={{ fontWeight: 500 }}>{invoice.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Description</span>
            <span style={{ fontWeight: 500 }}>{invoice.description}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Payment Method</span>
            <span style={{ fontWeight: 500 }}>
              {paymentMethod ? paymentMethod.name : 'None Selected'}
            </span>
          </div>
        </div>
      </div>

      <div className="modal-actions" style={{ justifyContent: 'space-between' }}>
        <button type="button" className="btn-outline" onClick={onClose} disabled={isSubmitting} style={{ flex: 1, justifyContent: 'center' }}>
          Cancel
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => onConfirm(invoice)}
          disabled={isSubmitting}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Payment'}
        </button>
      </div>
    </Modal>
  );
};
