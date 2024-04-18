'use server';

import db from '@/drizzle';
import { cartItems } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteCartItem(id: string) {
  await db.delete(cartItems).where(eq(cartItems.id, id));
  revalidatePath('/cart');
}
