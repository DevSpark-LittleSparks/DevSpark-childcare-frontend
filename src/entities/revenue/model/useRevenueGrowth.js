import { useEffect, useState } from 'react';
import { apiClient } from '@/services/axiosInstance';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatMonthLabel = (billingMonth) => {
  const [year, month] = billingMonth.split('-');
  return `${MONTH_LABELS[Number(month) - 1]} ${year}`;
};

export const useRevenueGrowth = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [yearlyRevenue, setYearlyRevenue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRevenue = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [monthlyRes, yearlyRes] = await Promise.all([
          apiClient.get('/api/v1/payments/revenue/monthly'),
          apiClient.get('/api/v1/payments/revenue/yearly'),
        ]);

        if (!isMounted) return;

        setMonthlyRevenue(
          (monthlyRes.data?.data ?? []).map((entry) => ({
            month: formatMonthLabel(entry.month),
            revenue: entry.revenue,
          }))
        );
        setYearlyRevenue(
          (yearlyRes.data?.data ?? []).map((entry) => ({
            year: entry.year,
            revenue: entry.revenue,
          }))
        );
      } catch (err) {
        if (!isMounted) return;
        setError(
          err?.response?.status === 403
            ? 'You do not have permission to view revenue data.'
            : 'Unable to load revenue data right now.'
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRevenue();
    return () => {
      isMounted = false;
    };
  }, []);

  return { monthlyRevenue, yearlyRevenue, isLoading, error };
};
