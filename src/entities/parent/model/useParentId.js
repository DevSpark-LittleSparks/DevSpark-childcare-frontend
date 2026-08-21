import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiClient } from '@/services/axiosInstance';
import { selectUser, setUser } from '@/features/auth/model/authSlice';

export const useParentId = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isParent = user?.role?.toLowerCase() === 'parent';
  const parentId = isParent ? user?.parentId ?? null : null;

  useEffect(() => {
    if (!isParent || user?.parentId) return;

    let isMounted = true;

    const fetchParentId = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.get('/api/v1/auth/me');
        if (!isMounted) return;
        const fetchedParentId = res.data?.data?.parentId ?? null;
        dispatch(setUser({ ...user, parentId: fetchedParentId }));
      } catch (err) {
        if (!isMounted) return;
        setError('Unable to resolve your parent profile.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchParentId();
    return () => {
      isMounted = false;
    };
  }, [isParent, user, dispatch]);

  return { parentId, isLoading, error };
};
