import React from 'react';
import { Download } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal/Modal';
import { formatCurrency } from '@/shared/lib/formatCurrency';

export const StatementPreviewModal = ({ isOpen, onClose, lastPayment, outstandingBalance, onDownload }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Statement" maxWidth="500px">
      <div className="statement-preview" style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Sprouty Child Care</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>123 Learning Lane</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>Statement</p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Mar 2026</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '12px 0', marginBottom: '16px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Bill To:</p>
          <p style={{ margin: 0, fontWeight: 500 }}>Sarah Jenkins</p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Child: Leo Jenkins</p>
        </div>
        <table style={{ width: '100%', fontSize: '0.875rem', marginBottom: '16px', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 0', color: 'var(--text-secondary)' }}>Previous Balance</td>
              <td style={{ padding: '4px 0', textAlign: 'right' }}>{formatCurrency(lastPayment)}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 0', color: 'var(--text-secondary)' }}>Recent Payments</td>
              <td style={{ padding: '4px 0', textAlign: 'right', color: 'var(--success-text)' }}>-{formatCurrency(lastPayment)}</td>
            </tr>
            <tr>
              <td style={{ padding: '4px 0', color: 'var(--text-secondary)', fontWeight: 500 }}>New Charges (March)</td>
              <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 500 }}>{formatCurrency(20000)}</td>
            </tr>
            <tr>
              <td style={{ padding: '12px 0 0', fontWeight: 700, borderTop: '1px solid var(--border-color)' }}>Total Amount Due</td>
              <td style={{ padding: '12px 0 0', textAlign: 'right', fontWeight: 700, borderTop: '1px solid var(--border-color)', color: 'var(--primary-teal)' }}>{formatCurrency(outstandingBalance)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="modal-actions">
        <button type="button" className="btn-outline" onClick={onClose}>
          Close
        </button>
        <button type="button" className="btn-primary" onClick={onDownload}>
          <Download size={18} /> Download PDF
        </button>
      </div>
    </Modal>
  );
};
