import { formatCurrency } from '@/shared/lib/formatCurrency';

interface BillingSummaryProps {
  outstandingBalance: number;
  lastPayment: number;
}

export const BillingSummary = ({ outstandingBalance, lastPayment }: BillingSummaryProps) => {
  return (
    <div className="summary-cards">
      <div className="card">
        <h3 className="card-title">Outstanding Balance</h3>
        <div className="card-amount outstanding">{formatCurrency(outstandingBalance)}</div>
        <p className="card-subtitle">Due by Mar 5, 2026</p>
      </div>
      <div className="card">
        <h3 className="card-title">Last Payment</h3>
        <div className="card-amount last-payment">{formatCurrency(lastPayment)}</div>
        <p className="card-subtitle">Processed on Feb 1, 2026</p>
      </div>
    </div>
  );
};
