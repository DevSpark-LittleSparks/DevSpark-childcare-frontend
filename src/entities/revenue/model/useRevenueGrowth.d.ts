import type { MonthlyRevenueEntry, YearlyRevenueEntry } from '@/types/billing.types';

export function useRevenueGrowth(): {
  monthlyRevenue: MonthlyRevenueEntry[];
  yearlyRevenue: YearlyRevenueEntry[];
  isLoading: boolean;
  error: string | null;
};
