import { useEffect, useState } from 'react';
import { chatApi } from '@/services/chatApi';

// Polls rather than reusing the STOMP connection - chatWebSocket.ts only
// supports one active subscriber at a time, and the sidebar badge needs to
// work even when the messaging page itself isn't mounted.
const POLL_INTERVAL_MS = 20000;

export const useUnreadMessageCount = (accountId) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!accountId) {
      setUnreadCount(0);
      return;
    }

    let isMounted = true;
    const fetchCount = () => {
      chatApi
        .getUnreadCount(accountId)
        .then((res) => {
          if (isMounted) setUnreadCount(typeof res.data === 'number' ? res.data : 0);
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
  }, [accountId]);

  return unreadCount;
};
