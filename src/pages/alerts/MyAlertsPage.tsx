import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell, AlertTriangle } from 'lucide-react';
import { alertsApi } from '@/services/alertsApi';
import { selectUser } from '@/features/auth/model/authSlice';
import type { AlertItem } from '@/types/alerts.types';

import '@/pages/billing/BillingPage.css';
import './MyAlertsPage.css';

export const MyAlertsPage = () => {
  const user = useSelector(selectUser);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAlerts = () => {
    if (!user?.uid || !user?.role) return;
    setIsLoading(true);
    alertsApi
      .getMyAlerts(user.uid, user.role)
      .then((res) => setAlerts(res.data?.data ?? []))
      .catch(() => setAlerts([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, user?.role]);

  const handleOpen = (alert: AlertItem) => {
    if (alert.isRead || !user?.uid) return;
    alertsApi
      .markAlertRead(alert.id, user.uid)
      .then(() => {
        setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, isRead: true } : a)));
      })
      .catch(() => {});
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Alerts</h1>
          <p className="page-description">Notifications and announcements from the center.</p>
        </div>
      </div>

      <div className="section-container">
        {isLoading && <p className="card-subtitle">Loading alerts...</p>}
        {!isLoading && alerts.length === 0 && <p className="card-subtitle">No alerts yet.</p>}

        {!isLoading && alerts.length > 0 && (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-item ${alert.isRead ? '' : 'alert-item-unread'}`}
                onClick={() => handleOpen(alert)}
              >
                <div className="alert-item-icon">
                  {alert.priority === 'HIGH' ? <AlertTriangle size={18} /> : <Bell size={18} />}
                </div>
                <div className="alert-item-body">
                  <div className="alert-item-header">
                    <span className="alert-item-title">{alert.title}</span>
                    {alert.priority === 'HIGH' && <span className="alert-item-priority">High Priority</span>}
                  </div>
                  <p className="alert-item-text">{alert.body}</p>
                  <span className="alert-item-time">
                    {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : ''}
                  </span>
                </div>
                {!alert.isRead && <span className="alert-item-dot" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
