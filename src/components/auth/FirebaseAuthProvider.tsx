import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../../lib/firebase';
import { useAppDispatch } from '../../store';
import { setUser, setLoading } from '../../features/auth/model/authSlice';
import { apiClient } from '../../services/axiosInstance';

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    // 1. Listen for Firebase Auth State
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      if (fbUser) {
        try {
          // 2. Fetch latest profile info from OUR backend
          const res = await apiClient.get('/api/v1/auth/me');

          if (res.data.success) {
            const profile = res.data.data;
            dispatch(
              setUser({
                uid: fbUser.uid,
                email: profile.email,
                displayName: profile.fullName, // Use name from DB!
                photoURL: profile.profilePic, // Use pic from DB!
                role: profile.role,
              }),
            );
          } else {
            // Fallback to Firebase info if backend fail
            dispatch(
              setUser({
                uid: fbUser.uid,
                email: fbUser.email,
                displayName: fbUser.displayName || 'User',
                photoURL: fbUser.photoURL,
                role: null,
              }),
            );
          }
        } catch (err) {
          console.error('Failed to fetch user profile from backend:', err);
          // Fallback
          dispatch(
            setUser({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || 'User',
              photoURL: fbUser.photoURL,
              role: null,
            }),
          );
        }
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};
