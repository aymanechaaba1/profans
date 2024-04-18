'use server';

import db from '@/drizzle';
import { cartItems } from '@/drizzle/schema';

export async function getCartItemByTicketId(ticketId: string) {
  const cartItem = await db.query.cartItems.findFirst({
    where: (cartItems, { eq }) => eq(cartItems.ticketId, ticketId),
  });
  return cartItem;
}
