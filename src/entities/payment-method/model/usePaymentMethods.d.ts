import type { PaymentMethod } from '@/types/billing.types';

export function usePaymentMethods(parentId: string | null): {
  paymentMethods: PaymentMethod[];
  selectedMethodIndex: number | null;
  setSelectedMethodIndex: (index: number | null) => void;
  addMethod: () => Promise<void>;
  removeMethod: (cardDetailsId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};
