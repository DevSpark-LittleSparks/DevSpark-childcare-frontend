export type InvoiceStatus = 'Paid' | 'Pending';

export interface Invoice {
  id: string;
  paymentId: string;
  // Absent right after creating an ad-hoc charge, before the invoice list
  // is refetched from the backend (which always includes it).
  date?: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
}

export interface PaymentMethod {
  cardDetailsId: string;
  type: string;
  name: string;
  expiry: string;
  styleClass: string;
}

export interface MonthlyRevenueEntry {
  month: string;
  revenue: number;
}

export interface YearlyRevenueEntry {
  year: number;
  revenue: number;
}

export interface PaymentStatusEntry {
  status: InvoiceStatus;
  count: number;
  amount: number;
}
