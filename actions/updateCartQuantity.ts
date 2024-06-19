'use server';

import db from '@/drizzle';
import { cartItems } from '@/drizzle/schema';
import { TICKETS_LIMIT } from '@/utils/config';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getSumOrderItems } from './getSumOrderItems';
import { getSession } from './getSession';
import { getCartItemById } from './getCartItemById';
import { deleteCartItem } from './deleteCartItem';
import { getUser } from '@/lib/utils';

export async function updateCartQuantity(
  cartItemId: string,
  operation?: '+' | '-',
  newQty?: number
): Promise<{ success: boolean; message?: string }> {
  try {
    let query = await db.query.cartItems.findFirst({
      where: (cartItem, { eq }) => eq(cartItem.id, cartItemId),
      columns: {
        quantity: true,
      },
    });
    if (!query)
      return {
        success: false,
        message: 'quantity not found',
      };

    let { quantity } = query;

    if (operation === '-') {
      if (quantity === 1) {
        // delete cart item
        await deleteCartItem(cartItemId);
      } else if (quantity < 2)
        return {
          success: false,
        };
    }

    let user = await getUser();
    if (!user)
      return {
        success: false,
        message: 'session not found',
      };

    let cartItem = await getCartItemById(cartItemId);
    if (!cartItem)
      return {
        success: false,
        message: 'cart item not found',
      };

    let sum = await getSumOrderItems(user.id, cartItem.ticketId);
    let ticketsLeftToBuy = TICKETS_LIMIT - Number(sum || 0);

    if (
      operation === '+' &&
      (quantity < 1 ||
        quantity > TICKETS_LIMIT - 1 ||
        quantity > ticketsLeftToBuy)
    )
      return {
        success: false,
        message: 'you cannot add more',
      };

    let newCartItem = await db
      .update(cartItems)
      .set({
        ...(operation && {
          quantity: operation === '+' ? quantity + 1 : quantity - 1,
        }),
        ...(newQty && { quantity: newQty }),
      })
      .where(eq(cartItems.id, cartItemId))
      .returning();

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
