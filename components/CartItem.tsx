import { cartItems, eventOptions, events, tickets } from '@/drizzle/schema';
import { Card, CardDescription } from './ui/card';
import Image from 'next/image';
import QuantityUnitPriceSubTotal from './QuantityUnitPriceSubTotal';
import db from '@/drizzle';
import { Trash2 } from 'lucide-react';
import { deleteCartItem } from '@/actions/deleteCartItem';
import { eq } from 'drizzle-orm';

async function CartItem({
  cartItem,
}: {
  cartItem: typeof cartItems.$inferSelect;
}) {
  const event = await db
    .select({
      eventName: events.name,
      thumbnail: events.thumbnail,
      eventDescription: events.description,
      option: eventOptions.name,
      price: eventOptions.price,
    })
    .from(events)
    .fullJoin(tickets, eq(events.id, tickets.eventId))
    .fullJoin(eventOptions, eq(tickets.optionId, eventOptions.id))
    .where(eq(tickets.id, cartItem.ticketId));

  return (
    <Card className="p-4">
      <div className="">
        <div className="flex justify-between items-start">
          {event[0].thumbnail && (
            <div className="w-1/2 mb-3">
              <Image
                priority
                src={event[0].thumbnail}
                alt={''}
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
          <div className="mb-2">
            <h3 className="scroll-m-20 tracking-tight font-semibold text-xl">
              {event[0].eventName}
            </h3>
            <CardDescription className="">
              {event[0].eventDescription}
            </CardDescription>
          </div>
          {/* option selected */}
          <div className="flex items-center gap-x-5 mb-3">
            <p className="font-medium text-sm tracking-tight">
              selected option:
            </p>
            <p className="text-sm tracking-tight">
              {event[0].option?.toUpperCase()}
            </p>
          </div>

          <div>
            {event[0].price && (
              <QuantityUnitPriceSubTotal
                quantity={cartItem.quantity}
                unitPrice={+event[0].price}
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
