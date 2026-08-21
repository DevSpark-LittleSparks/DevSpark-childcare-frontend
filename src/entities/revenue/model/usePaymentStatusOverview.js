import { useEffect, useState } from 'react';
import { apiClient } from '@/services/axiosInstance';

export const usePaymentStatusOverview = () => {
  const [statusOverview, setStatusOverview] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStatusOverview = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.get('/api/v1/payments/status-overview');
        if (!isMounted) return;
        setStatusOverview(res.data?.data ?? []);
      } catch (err) {
        if (!isMounted) return;
        setError(
          err?.response?.status === 403
            ? 'You do not have permission to view payment status data.'
            : 'Unable to load payment status data right now.'
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStatusOverview();
    return () => {
      isMounted = false;
    };
  }, []);

  return { statusOverview, isLoading, error };
};
