import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/services/axiosInstance';

const mapCard = (card) => ({
  cardDetailsId: card.cardDetailsId,
  type: card.cardType,
  name: `${card.cardHolderName ?? 'Card'} •••• ${card.cardLast4}`,
  expiry: card.expDate
    ? `Expires ${String(new Date(card.expDate).getMonth() + 1).padStart(2, '0')}/${String(new Date(card.expDate).getFullYear()).slice(-2)}`
    : 'No expiry on file',
  styleClass: (card.cardType ?? 'unknown').toLowerCase(),
});

export const usePaymentMethods = (parentId) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCards = useCallback(async () => {
    if (!parentId) {
      setPaymentMethods([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/api/v1/cards/parent/${parentId}`);
      const methods = (res.data?.data ?? []).map(mapCard);
      setPaymentMethods(methods);
      setSelectedMethodIndex(methods.length > 0 ? 0 : null);
    } catch (err) {
      setError('Unable to load payment methods right now.');
    } finally {
      setIsLoading(false);
    }
  }, [parentId]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) return;
      await fetchCards();
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchCards]);

  const addMethod = async () => {
    await fetchCards();
  };

  const removeMethod = async (cardDetailsId) => {
    await apiClient.delete(`/api/v1/cards/${cardDetailsId}`);
    await fetchCards();
  };

  return {
    paymentMethods,
    selectedMethodIndex,
    setSelectedMethodIndex,
    addMethod,
    removeMethod,
    isLoading,
    error,
  };
};
