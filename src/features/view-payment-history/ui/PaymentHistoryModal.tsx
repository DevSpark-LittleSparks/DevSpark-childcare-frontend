import { Download } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal/Modal';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import type { Invoice } from '@/types/billing.types';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  onDownloadReceipt: (invoiceId: string) => void;
}

export const PaymentHistoryModal = ({ isOpen, onClose, invoices, onDownloadReceipt }: PaymentHistoryModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Payment History" 
      maxWidth="600px" 
      bodyStyle={{ overflowY: 'auto', paddingRight: '8px', maxHeight: '60vh' }}
    >
      <table className="data-table">
        <thead>
          <tr>
            <th>DATE</th>
            <th>INVOICE</th>
            <th>AMOUNT</th>
            <th>RECEIPT</th>
          </tr>
        </thead>
        <tbody>
          {invoices.filter(inv => inv.status === 'Paid').map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.date}</td>
              <td className="text-bold">{invoice.id}</td>
              <td className="text-bold">{formatCurrency(invoice.amount)}</td>
              <td>
                <button className="action-link" onClick={() => onDownloadReceipt(invoice.id)}>
                  <Download size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Download
                </button>
              </td>
            </tr>
          ))}
          {invoices.filter(inv => inv.status === 'Paid').length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No payment history found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="modal-actions" style={{ marginTop: '16px' }}>
        <button type="button" className="btn-outline" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};
