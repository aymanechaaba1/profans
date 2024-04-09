'use server';

import db from '@/drizzle';
import { cartItems } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateCartQuantity(newQty: number, cartItemId: string) {
  try {
    await db
      .update(cartItems)
      .set({
        quantity: newQty,
      })
      .where(eq(cartItems.id, cartItemId));
    revalidatePath('/cart');
  } catch (err) {
    return {
      success: false,
      message: 'something went wrong!',
    };
  }

  return {
    success: true,
    message: 'ticket quantity updated!',
  };
}
