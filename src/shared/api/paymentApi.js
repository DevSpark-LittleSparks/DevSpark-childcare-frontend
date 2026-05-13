import apiClient from './apiClient';

export const getPaymentsByParent = (parentId) =>
  apiClient.get(`/payments/parent/${parentId}`);

export const getPendingPayments = (parentId) =>
  apiClient.get(`/payments/parent/${parentId}/pending`);

export const getPaymentHistory = (parentId) =>
  apiClient.get(`/payments/parent/${parentId}/history`);

export const processPayment = (data) =>
  apiClient.post('/payments/process', data);
