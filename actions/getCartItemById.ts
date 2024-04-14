'use server';

import db from '@/drizzle';
import { cartItems } from '@/drizzle/schema';

export async function getCartItemById(id: string) {
  const cartItem = await db.query.cartItems.findFirst({
    where: (cartItems, { eq }) => eq(cartItems.id, id),
  });
  return cartItem;
}
