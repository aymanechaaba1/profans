'use server';

import db from '@/drizzle';

export async function getCart(cartId: string, ticketId?: string) {
  const cart = await db.query.cart.findFirst({
    where: (cart, { eq }) => eq(cart.id, cartId),
    with: {
      items: {
        ...(ticketId && {
          where: (items, { eq }) => eq(items.ticketId, ticketId),
        }),
      },
    },
  });
  return cart;
}
