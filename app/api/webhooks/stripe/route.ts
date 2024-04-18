import { metadata } from './../../../login/page';
import db from '@/drizzle';
import { cart, cartItems, orderItems, orders, tickets } from '@/drizzle/schema';
import stripe from '@/lib/stripe';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { tickets as TICKETS } from '@/tickets';
import { Ticket } from '@/components/ticket';
import { getPdfBuffer } from '@/actions/getPdfBuffer';
import { uploadPdfToFirebase } from '@/actions/uploadPdfToFirebase';
import { getUser } from '@/lib/utils';
import { sendToEmail } from '@/actions/sendToEmail';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret!);
  } catch (err) {
    return new NextResponse(`Webhook Error`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;

      if (
        !checkoutSessionCompleted.customer_email ||
        !checkoutSessionCompleted.amount_total ||
        !checkoutSessionCompleted.status
      )
        return new NextResponse(null, {
          status: 400,
          statusText: 'MISSIONG CHECKOUT SESSION DATA',
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
          return new NextResponse(null, {
            status: 404,
            statusText: 'NO USER FOUND',
          });

        // add new order to db
        const [newOrder, lineItems] = await Promise.all([
          db
            .insert(orders)
            .values({
              status: checkoutSessionCompleted.status,
              total: String(checkoutSessionCompleted.amount_total / 100),
              userId: user.id,
            })
            .returning(),
          stripe.checkout.sessions.listLineItems(checkoutSessionCompleted.id),
        ]);

        // if (!newOrder) return;

        // let items: (typeof orderItems.$inferSelect)[] = [];
        // await Promise.all(
        //   lineItems.data.map(async (lineItem) => {
        //     items = await db
        //       .insert(orderItems)
        //       .values({
        //         orderId: newOrder[0].id,
        //         ticketId: TICKETS.find(
        //           (ticket) => ticket.stripePriceId === lineItem?.price?.id
        //         )?.ticketId!,
        //         quantity: lineItem.quantity || 0,
        //         total: (lineItem.amount_total / 100).toString(),
        //       })
        //       .returning();
        //   })
        // );

        // // loop over each ticket and update its stock
        // // 1. ticketStock = ticketStock - cartItemQuantity
        // user.cart.items.forEach(async (item) => {
        //   let ticket = await db.query.tickets.findFirst({
        //     where: (tickets, { eq }) => eq(tickets.id, item.ticketId),
        //   });

        //   if (!ticket) return;

        //   if (!ticket.stock)
        //     return new NextResponse(null, {
        //       status: 400,
        //       statusText: 'TICKETS SOLD OUT',
        //     });

        //   await db
        //     .update(tickets)
        //     .set({
        //       stock: ticket.stock - item.quantity,
        //     })
        //     .where(eq(tickets.id, item.ticketId));
        // });

        // // clear cart
        // await db.delete(cartItems).where(eq(cartItems.cartId, user.cart.id));
        // revalidatePath('/', 'layout');

        // // send tickets pdf
        // await sendTickets(
        //   {
        //     id: user.id,
        //     email: user.email,
        //     firstname: user.firstname,
        //   },
        //   items
        // );
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

async function sendTickets(
  user: {
    id: string;
    email: string;
    firstname: string;
  },
  items: (typeof orderItems.$inferSelect)[]
) {
  let urls: string[] = [];

  for (const item of items) {
    for (let i = 0; i < item.quantity; i++) {
      let ticket = await Ticket(item);
      if (!ticket) return;

      let pdfBuffer = await getPdfBuffer(ticket);
      let path = `/tickets/${user.id}/${item.orderId}_${item.ticketId}_${i}.pdf`;
      await uploadPdfToFirebase({
        path,
        pdfBuffer,
      });
      let url = await getDownloadURL(ref(storage, path));
      urls.push(url);
    }
  }

  await sendToEmail({
    to: user.email,
    subject: `${user.firstname}, Download Your Tickets`,
    text: `Links: \n ${urls.join('\n\n')}`,
  });
}
