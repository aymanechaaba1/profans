'use client';

import { Loader2, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/actions/createCheckoutSession';
import Stripe from 'stripe';
import { cartItems } from '@/drizzle/schema';
import { tickets } from '@/tickets';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { CheckoutSessionPayload } from '@/types/stripe';

function CheckoutBtn({
  basketItems,
}: {
  basketItems: (typeof cartItems.$inferSelect)[];
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {}, []);

  let lineItems = basketItems.map((item) => ({
    quantity: item.quantity,
    price: tickets.find((ticket) => ticket.ticketId === item.ticketId)
      ?.stripePriceId,
  })) as Stripe.Checkout.SessionCreateParams.LineItem[];

  let payload: CheckoutSessionPayload = {
    lineItems,
  };

  return (
    <form
      action={async (formData) => {
        // console.log(lineItems);
        setIsLoading(true);
        createCheckoutSession({ payload })
          .then(({ session, message }) => {
            if (message) toast(message);
            if (session?.url) router.push(session.url);
          })
          .catch((err) => toast('something went wrong!'))
          .finally(() => {
            setIsLoading(false);
          });
      }}
    >
      <Button className="w-full mt-5 flex justify-center">
        {!isLoading ? (
          <>
            <Lock className="mr-3" size={15} />
            <span>Checkout</span>
          </>
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
}

export default CheckoutBtn;
