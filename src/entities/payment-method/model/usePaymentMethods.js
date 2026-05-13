import { useState, useEffect, useCallback } from 'react';
import { getCardsByParent, deleteCard as deleteCardApi } from '@/shared/api/cardApi';
import { PARENT_ID } from '@/shared/lib/constants';

const formatExpiry = (expDate) => {
  if (!expDate) return '';
  const d = Array.isArray(expDate)
    ? new Date(expDate[0], expDate[1] - 1, expDate[2])
    : new Date(expDate);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `Expires ${mm}/${yy}`;
};

const mapCard = (card) => ({
  id: card.cardDetailsId,
  type: card.cardType,
  name: `${card.cardType === 'VISA' ? 'Visa' : 'Mastercard'} ending in ${card.cardLast4}`,
  expiry: formatExpiry(card.expDate),
  styleClass: card.cardType === 'VISA' ? 'visa' : 'mastercard',
});

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCardsByParent(PARENT_ID);
      const cards = (response.data.data ?? []).map(mapCard);
      setPaymentMethods(cards);
      if (cards.length > 0) setSelectedMethodIndex(0);
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const addMethod = useCallback((newMethod) => {
    setPaymentMethods((prev) => {
      const updated = [...prev, newMethod];
      setSelectedMethodIndex(updated.length - 1);
      return updated;
    });
  }, []);

  const removeMethod = useCallback(async (indexToRemove) => {
    const cardToRemove = paymentMethods[indexToRemove];
    if (!cardToRemove?.id) return;
    await deleteCardApi(cardToRemove.id);
    setPaymentMethods((prev) => {
      const updated = prev.filter((_, i) => i !== indexToRemove);
      return updated;
    });
    setSelectedMethodIndex((prev) => {
      if (prev === indexToRemove) return paymentMethods.length > 1 ? 0 : null;
      if (prev > indexToRemove) return prev - 1;
      return prev;
    });
  }, [paymentMethods]);

  return {
    paymentMethods,
    selectedMethodIndex,
    setSelectedMethodIndex,
    addMethod,
    removeMethod,
    loading,
  };
};
