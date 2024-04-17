'use server';

import stripe from '@/lib/stripe';
import { getUrl, getUser } from '@/lib/utils';
import 'dotenv/config';
import { CheckoutSessionPayload } from '@/types/stripe';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(
  prevState: any,
  payload: CheckoutSessionPayload
) {
  let message: string = '';

  const user = await getUser();

  if (!payload.lineItems.length) message = 'no items in your cart';

  const session = await stripe.checkout.sessions.create({
    line_items: payload.lineItems,
    mode: 'payment',
    customer_email: user?.email,
    success_url: `${getUrl()}/account`,
    cancel_url: `${getUrl()}/cart`,
    metadata: {
      ...(user && { userId: user.id }),
    },
  });
  if (session && session.url) redirect(session.url);
}
