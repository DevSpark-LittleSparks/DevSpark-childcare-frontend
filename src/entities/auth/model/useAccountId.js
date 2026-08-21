import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiClient } from '@/services/axiosInstance';
import { selectUser, setUser } from '@/features/auth/model/authSlice';

// Role-agnostic version of useParentId - resolves the logged-in user's
// backend Account.accountId (needed as the chat identity for any role,
// unlike parentId which only exists for parents).
export const useAccountId = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const accountId = user?.accountId ?? null;

  useEffect(() => {
    if (!user || user.accountId) return;

    let isMounted = true;

    const fetchAccountId = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.get('/api/v1/auth/me');
        if (!isMounted) return;
        const fetchedAccountId = res.data?.data?.accountId ?? null;
        dispatch(setUser({ ...user, accountId: fetchedAccountId }));
      } catch (err) {
        if (!isMounted) return;
        setError('Unable to resolve your account.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAccountId();
    return () => {
      isMounted = false;
    };
  }, [user, dispatch]);

  return { accountId, isLoading, error };
};
