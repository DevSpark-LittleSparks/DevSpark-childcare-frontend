import { formatCurrency } from '@/shared/lib/formatCurrency';
import type { Invoice } from '@/types/billing.types';

interface RecentInvoicesProps {
  invoices: Invoice[];
  onPayNow: (invoice: Invoice) => void;
  onViewHistory: () => void;
}

export const RecentInvoices = ({ invoices, onPayNow, onViewHistory }: RecentInvoicesProps) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">Recent Invoices</h2>
        <button className="btn-outline" onClick={onViewHistory}>
          View Full History
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>INVOICE ID</th>
            <th>DATE</th>
            <th>DESCRIPTION</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="text-bold">{invoice.id}</td>
              <td>{invoice.date}</td>
              <td>{invoice.description}</td>
              <td className="text-bold">{formatCurrency(invoice.amount)}</td>
              <td>
                <span className={`status-badge ${invoice.status === 'Paid' ? 'status-paid' : 'status-pending'}`}>
                  {invoice.status}
                </span>
              </td>
              <td>
                {invoice.status === 'Pending' ? (
                  <button className="action-link" onClick={() => onPayNow(invoice)}>
                    Pay Now
                  </button>
                ) : (
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Paid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
