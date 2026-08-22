import { useEffect, useState } from 'react';
import { alertsApi } from '@/services/alertsApi';

// Polls rather than pushing over websocket - alerts are infrequent broadcasts,
// so a lightweight interval is enough to keep the sidebar badge fresh.
const POLL_INTERVAL_MS = 30000;

export const useUnreadAlertCount = (firebaseUid, role) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!firebaseUid || !role) {
      setUnreadCount(0);
      return;
    }

    let isMounted = true;
    const fetchCount = () => {
      alertsApi
        .getMyAlerts(firebaseUid, role)
        .then((res) => {
          if (!isMounted) return;
          const alerts = res.data?.data ?? [];
          setUnreadCount(alerts.filter((a) => !a.isRead).length);
        })
        .catch(() => {
          // Silent - a failed poll just leaves the last known count showing.
        });
    };

    fetchCount();
    const interval = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [firebaseUid, role]);

  return unreadCount;
};
