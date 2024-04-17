'use client';

import { Loader2, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/actions/createCheckoutSession';
import Stripe from 'stripe';
import { cartItems } from '@/drizzle/schema';
import { tickets } from '@/tickets';
import { useEffect, useState } from 'react';
import { CheckoutSessionPayload } from '@/types/stripe';
import { useFormState, useFormStatus } from 'react-dom';

function Btn() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full mt-5 flex justify-center">
      {!pending ? (
        <>
          <Lock className="mr-3" size={15} />
          <span>Checkout</span>
        </>
      ) : (
        <Loader2 className="animate-spin" />
      )}
    </Button>
  );
}

function CheckoutBtn({
  basketItems,
}: {
  basketItems: (typeof cartItems.$inferSelect)[];
}) {
  const [state, formAction] = useFormState(createCheckoutSession, null);

  let lineItems = basketItems.map((item) => ({
    quantity: item.quantity,
    price: tickets.find((ticket) => ticket.ticketId === item.ticketId)
      ?.stripePriceId,
  })) as Stripe.Checkout.SessionCreateParams.LineItem[];

  let payload: CheckoutSessionPayload = {
    lineItems,
  };

  return (
    <form action={formAction.bind(null, payload)}>
      <Btn />
    </form>
  );
}

export default CheckoutBtn;
