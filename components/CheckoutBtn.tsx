'use client';

import { Loader2, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/actions/createCheckoutSession';
import Stripe from 'stripe';
import { cartItems } from '@/drizzle/schema';
import { useEffect, useState } from 'react';
import { CheckoutSessionPayload } from '@/types/stripe';
import { useFormState, useFormStatus } from 'react-dom';
import { getTickets } from '@/actions/getTickets';

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
  tickets,
  basketItems,
}: {
  tickets: Awaited<ReturnType<typeof getTickets>>;
  basketItems: (typeof cartItems.$inferSelect)[];
}) {
  const [state, formAction] = useFormState(createCheckoutSession, null);
  console.log(tickets);

  let lineItems = basketItems.map((item) => {
    let ticket = tickets.find((ticket) => ticket.id === item.ticketId);
    if (!ticket || !ticket.stripePriceId) return;

    return {
      quantity: item.quantity,
      price: ticket.stripePriceId,
    };
  }) as Stripe.Checkout.SessionCreateParams.LineItem[];

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
