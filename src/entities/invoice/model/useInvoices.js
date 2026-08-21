import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/services/axiosInstance';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const mapPayment = (payment) => {
  const [year, month] = payment.billingMonth.split('-');
  const monthLabel = MONTH_LABELS[Number(month) - 1];
  return {
    id: `#PAY-${payment.paymentId.slice(0, 8).toUpperCase()}`,
    paymentId: payment.paymentId,
    date: `${monthLabel} 01, ${year}`,
    description: payment.description || `${monthLabel} ${year} — Billing`,
    amount: payment.amount,
    status: payment.status === 'PAYED' ? 'Paid' : 'Pending',
  };
};

export const useInvoices = (parentId) => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = useCallback(async () => {
    if (!parentId) {
      setInvoices([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/api/v1/payments/parent/${parentId}`);
      setInvoices((res.data?.data ?? []).map(mapPayment));
    } catch (err) {
      setError('Unable to load invoices right now.');
    } finally {
      setIsLoading(false);
    }
  }, [parentId]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) return;
      await fetchInvoices();
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchInvoices]);

  const outstandingBalance = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const lastPayment = invoices.find(inv => inv.status === 'Paid')?.amount || 0;

  return {
    invoices,
    refetch: fetchInvoices,
    outstandingBalance,
    lastPayment,
    isLoading,
    error,
  };
};
