import { loadStripe } from '@stripe/stripe-js';
import { env } from '@/shared/config/env';

export const stripePromise = loadStripe(env.stripePublishableKey);
