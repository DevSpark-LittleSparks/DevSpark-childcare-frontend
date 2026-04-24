import { useState } from 'react';

const initialInvoices = [
  { id: '#INV-2026-002', date: 'Mar 01, 2026', description: 'March - Leo', amount: 20000.00, status: 'Pending' },
  { id: '#INV-2026-001', date: 'Feb 01, 2026', description: 'February - Leo', amount: 20000.00, status: 'Paid' },
  { id: '#INV-2025-012', date: 'Jan 01, 2026', description: 'January - Leo', amount: 20000.00, status: 'Paid' },
  { id: '#INV-2025-011', date: 'Dec 01, 2025', description: 'December - Leo', amount: 19500.00, status: 'Paid' },
  { id: '#INV-2025-010', date: 'Nov 01, 2025', description: 'November - Leo', amount: 19500.00, status: 'Paid' },
  { id: '#INV-2025-009', date: 'Oct 01, 2025', description: 'October - Leo', amount: 19500.00, status: 'Paid' },
];

export const useInvoices = () => {
  const [invoices, setInvoices] = useState(initialInvoices);

  const markAsPaid = (id) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status: 'Paid' } : inv
    ));
  };

  const outstandingBalance = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const lastPayment = invoices.find(inv => inv.status === 'Paid')?.amount || 0;

  return {
    invoices,
    markAsPaid,
    outstandingBalance,
    lastPayment
  };
};
