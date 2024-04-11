'use server';

import stripe from '@/lib/stripe';
import { getUrl, getUser } from '@/lib/utils';
import 'dotenv/config';
import { CheckoutSessionPayload } from '@/types/stripe';

export async function createCheckoutSession({
  payload,
}: {
  payload: CheckoutSessionPayload;
}) {
  const user = await getUser();

  if (!payload.lineItems.length)
    return {
      message: 'no items in your cart',
    };

  const session = await stripe.checkout.sessions.create({
    line_items: payload.lineItems,
    mode: 'payment',
    customer_email: user?.email,
    success_url: `${getUrl()}/orders`,
    cancel_url: `${getUrl()}/cart`,
    metadata: {
      ...(user && { userId: user.id }),
    },
  });
  return { session };
}
