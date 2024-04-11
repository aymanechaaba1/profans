import { cartItems } from '@/drizzle/schema';
import type Stripe from 'stripe';

export type CheckoutSessionPayload = {
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
};
