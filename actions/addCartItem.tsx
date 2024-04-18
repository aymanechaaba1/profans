'use server';

import db from '@/drizzle';
import { cartItems, tickets } from '@/drizzle/schema';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function addCartItem(cartItem: typeof cartItems.$inferInsert) {
  try {
    const newCartItem = await db.insert(cartItems).values(cartItem).returning();
    revalidatePath('/');
    return newCartItem;
  } catch (err) {
    console.log(err);
  }
}
