import { metadata } from './../../../login/page';
import db from '@/drizzle';
import { cart, cartItems, orderItems, orders, tickets } from '@/drizzle/schema';
import stripe from '@/lib/stripe';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { Ticket } from '@/components/ticket';
import { getPdfBuffer } from '@/actions/getPdfBuffer';
import { uploadPdfToFirebase } from '@/actions/uploadPdfToFirebase';
import { StorageReference, getDownloadURL, ref } from 'firebase/storage';
import type Stripe from 'stripe';
import { getTickets } from '@/actions/getTickets';
import resend from '@/lib/resend';
import DownloadTicketsEmail from '@/components/emails/DownloadTicketsEmail';
import { upperFirst } from '@/utils/helpers';
import { MAIN_DOMAIN } from '@/utils/config';

export const dynamic = 'force-dynamic';

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

  let urls: string[] = [];
  let snapshotRefs: StorageReference[] = [];
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
        const [newOrder, lineItems, _tickets] = await Promise.all([
          db
            .insert(orders)
            .values({
              status: checkoutSessionCompleted.status,
              total: String(checkoutSessionCompleted.amount_total / 100),
              userId: user.id,
            })
            .returning(),
          stripe.checkout.sessions.listLineItems(checkoutSessionCompleted.id),
          getTickets(),
        ]);
        if (!newOrder) return;

        let items: (typeof orderItems.$inferSelect)[] = [];
        for (const [i, lineItem] of lineItems.data.entries()) {
          let item = await db
            .insert(orderItems)
            .values({
              orderId: newOrder[0].id,
              ticketId: _tickets.find(
                (ticket) => ticket.stripePriceId === lineItem?.price?.id
              )?.id!,
              quantity: lineItem.quantity || 0,
              total: (lineItem.amount_total / 100).toString(),
            })
            .returning();

          let ticket = await Ticket(item[0]);
          if (!ticket) return;

          let path = `/tickets/${user.id}/${item[0].orderId}_${item[0].ticketId}.pdf`;

          let pdfBuffer = await getPdfBuffer(ticket);
          let snapshot = await uploadPdfToFirebase({
            path,
            pdfBuffer,
          });
          let url = await getDownloadURL(snapshot.ref);
          urls.push(url);

          // loop over each ticket and update its stock
          // 1. ticketStock = ticketStock - cartItemQuantity
          let cartItem = user.cart.items[i];
          let itemTicket = await db.query.tickets.findFirst({
            where: (tickets, { eq }) => eq(tickets.id, cartItem.ticketId),
          });
          if (!itemTicket || !itemTicket.stock) return;

          await db
            .update(tickets)
            .set({
              stock: itemTicket.stock - cartItem.quantity,
            })
            .where(eq(tickets.id, cartItem.ticketId));
        }

        const [emailData, _cartItems] = await Promise.all([
          resend.emails.send({
            from: `Profans <noreply@${MAIN_DOMAIN}>`,
            to: user.email,
            subject: `${upperFirst(user.firstname)}, Download your Tickets`,
            react: DownloadTicketsEmail({
              firstname: user.firstname,
              order: newOrder[0],
              message: '',
              urls,
            }),
          }),
          db
            .delete(cartItems)
            .where(eq(cartItems.cartId, user.cart.id))
            .returning(),
        ]);

        revalidatePath('/', 'layout');
      } catch (err) {
        console.log(err);
      }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(JSON.stringify([snapshotRefs, urls]), {
    status: 200,
    statusText: 'SUCCESS CHECKOUT',
  });
}
