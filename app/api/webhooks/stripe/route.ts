import { metadata } from './../../../login/page';
import db from '@/drizzle';
import { cartItems, orderItems, orders, tickets } from '@/drizzle/schema';
import stripe from '@/lib/stripe';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { tickets as TICKETS } from '@/tickets';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = headers().get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse(null, {
      status: 400,
      statusText: `Webhook Error`,
    });
  }

  switch (event.type) {
    case 'charge.succeeded':
      const chargeSucceeded = event.data.object;
      break;

    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;

      if (
        !checkoutSessionCompleted.customer_email ||
        !checkoutSessionCompleted.amount_total ||
        !checkoutSessionCompleted.status
      )
        return new Response('MISSIONG CHECKOUT SESSION DATA', {
          status: 400,
        });

      try {
        const user = await db.query.users.findFirst({
          where: (users, { eq }) =>
            eq(users.email, checkoutSessionCompleted.customer_email!),
          with: {
            cart: {
              with: {
                items: true,
              },
            },
          },
        });

        if (!user)
          return new Response('NO USER FOUND', {
            status: 404,
          });

        // add new order to db
        const newOrder = await db
          .insert(orders)
          .values({
            status: checkoutSessionCompleted.status,
            total: String(checkoutSessionCompleted.amount_total / 100),
            userId: user.id,
          })
          .returning();

        if (!newOrder) return;

        const lineItems = await stripe.checkout.sessions.listLineItems(
          checkoutSessionCompleted.id
        );

        lineItems.data.forEach(async (lineItem, i) => {
          await db.insert(orderItems).values({
            orderId: newOrder[0].id,
            ticketId: TICKETS.find(
              (ticket) => ticket.stripePriceId === lineItem?.price?.id
            )?.ticketId!,
            quantity: lineItem.quantity || 0,
          });
        });

        // loop over each ticket and update its stock
        // 1. ticketStock = ticketStock - cartItemQuantity
        user.cart.items.forEach(async (item) => {
          let ticket = await db.query.tickets.findFirst({
            where: (tickets, { eq }) => eq(tickets.id, item.ticketId),
          });

          if (!ticket) return;

          if (!ticket.stock)
            return new Response('TICKETS SOLD OUT', {
              status: 400,
            });

          await db
            .update(tickets)
            .set({
              stock: ticket.stock - item.quantity,
            })
            .where(eq(tickets.id, item.ticketId));
        });

        // clear cart
        await db.delete(cartItems);
        revalidatePath('/', 'layout');
      } catch (err) {
        console.log(err);
      }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(event.type, {
    status: 200,
  });
}
