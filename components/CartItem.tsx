import { cartItems } from '@/drizzle/schema';
import { Card } from './ui/card';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getEvent } from '@/actions/getEvent';
import { toast } from 'sonner';
import { getEventOption } from '@/actions/getEventOption';
import { Input } from './ui/input';
import QuantityUnitPriceSubTotal from './QuantityUnitPriceSubTotal';
import { getTicket } from '@/actions/getTicket';
import db from '@/drizzle';
import { Trash2 } from 'lucide-react';
import { deleteCartItem } from '@/actions/deleteCartItem';

async function CartItem({
  cartItem,
}: {
  cartItem: typeof cartItems.$inferSelect;
}) {
  const [event, option] = await Promise.all([
    await getEvent(undefined, cartItem.ticketId),
    await getEventOption(cartItem.ticketId),
  ]);

  return (
    <Card className="p-4">
      <div className="">
        <div className="flex justify-between items-start">
          {event?.thumbnail && (
            <div className="w-1/2 mb-3">
              <Image
                priority
                src={event.thumbnail}
                alt={event.name}
                width={100}
                height={100}
                className="object-cover w-full rounded-lg"
              />
            </div>
          )}
          <form
            action={async (formData: FormData) => {
              'use server';
              // delete cart item
              await deleteCartItem(cartItem.id);
            }}
          >
            <button type="submit">
              <Trash2 className="cursor-pointer" />
            </button>
          </form>
        </div>
        <div>
          <h3 className="scroll-m-20 tracking-tight font-semibold text-xl mb-2">
            {event?.name}
          </h3>
          {/* option selected */}
          <div className="flex items-center gap-x-5 mb-3">
            <p className="font-medium text-sm tracking-tight">
              selected option:
            </p>
            <p className="text-sm tracking-tight">
              {option[0]?.name?.toUpperCase()}
            </p>
          </div>

          <div>
            {option[0].price && (
              <QuantityUnitPriceSubTotal
                quantity={cartItem.quantity}
                unitPrice={+option[0].price}
                cartItemId={cartItem.id}
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CartItem;
