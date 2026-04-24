import { useState } from 'react';

const initialMethods = [
  { type: 'VISA', name: 'Visa ending in 4242', expiry: 'Expires 8/28', styleClass: 'visa' },
  { type: 'BANK', name: 'Chase Checking ••••8821', expiry: 'Direct Debit', styleClass: 'bank' }
];

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState(initialMethods);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0);

  const addMethod = (newMethod) => {
    setPaymentMethods(prev => [...prev, newMethod]);
    if (selectedMethodIndex === null || paymentMethods.length === 0) {
      setSelectedMethodIndex(0);
    }
  };

  const removeMethod = (indexToRemove) => {
    const updatedMethods = paymentMethods.filter((_, index) => index !== indexToRemove);
    setPaymentMethods(updatedMethods);
    if (selectedMethodIndex === indexToRemove) {
      setSelectedMethodIndex(updatedMethods.length > 0 ? 0 : null);
    } else if (selectedMethodIndex > indexToRemove) {
      setSelectedMethodIndex(selectedMethodIndex - 1);
    }
  };

  return {
    paymentMethods,
    selectedMethodIndex,
    setSelectedMethodIndex,
    addMethod,
    removeMethod
  };
};
