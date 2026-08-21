export const env = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  },
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081",
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_REPLACE_ME_NOT_A_REAL_KEY",
};