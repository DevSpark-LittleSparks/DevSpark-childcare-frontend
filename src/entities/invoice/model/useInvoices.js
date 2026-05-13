import { useState, useEffect, useCallback } from 'react';
import { getPaymentsByParent } from '@/shared/api/paymentApi';
import { PARENT_ID } from '@/shared/lib/constants';

const formatExpiry = (expDate) => {
  if (!expDate) return '';
  const d = Array.isArray(expDate)
    ? new Date(expDate[0], expDate[1] - 1, expDate[2])
    : new Date(expDate);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${yy}`;
};

const mapPayment = (p) => ({
  id: p.paymentId,
  displayId: `#INV-${(p.billingMonth ?? p.paymentId).replace(/\s+/g, '-')}`,
  date: p.billingMonth ?? '',
  description: `${p.billingMonth ?? ''} - ${p.parentName ?? ''}`,
  amount: p.amount ?? 0,
  status: p.status === 'PAYED' ? 'Paid' : 'Pending',
});

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPaymentsByParent(PARENT_ID);
      setInvoices((response.data.data ?? []).map(mapPayment));
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const outstandingBalance = invoices
    .filter((inv) => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const lastPayment = invoices.find((inv) => inv.status === 'Paid')?.amount ?? 0;

  return {
    invoices,
    outstandingBalance,
    lastPayment,
    loading,
    error,
    refresh: fetchInvoices,
  };
};
