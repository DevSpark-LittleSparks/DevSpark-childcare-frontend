import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { env } from '@/shared/config/env';

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
};

export const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
