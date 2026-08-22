import { apiClient } from './axiosInstance';

export const alertsApi = {
  sendAlert: (payload) => apiClient.post('/api/v1/auth/admin/broadcast', payload),
  getRecipients: () => apiClient.get('/api/v1/auth/admin/alert-recipients'),
  getSentAlerts: () => apiClient.get('/api/v1/notifications/sent'),
  getMyAlerts: (firebaseUid, role) =>
    apiClient.get(`/api/v1/notifications/my-alerts/${firebaseUid}`, { params: { role } }),
  markAlertRead: (alertId, firebaseUid) =>
    apiClient.put(`/api/v1/notifications/${alertId}/read`, null, { params: { userId: firebaseUid } }),
};
