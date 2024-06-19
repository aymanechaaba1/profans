'use client';

import { ElementRef, MouseEvent, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { getEventOptionsTickets } from '@/actions/getEventOptionsTickets';
import { Input } from './ui/input';
import { TICKETS_LIMIT } from '@/utils/config';
import { toast } from 'sonner';
import { getUpcomingEvents } from '@/actions/getUpcomingEvents';
import { z } from 'zod';
import { getTicket } from '@/actions/getTicket';
import useSession from '@/hooks/useSession';
import { getCartItemByTicketId } from '@/actions/getCartItemByTicketId';
import { getSumOrderItems } from '@/actions/getSumOrderItems';
import { cartItems } from '@/drizzle/schema';
import { addCartItem } from '@/actions/addCartItem';
import { useRouter } from 'next/navigation';
import { getMinPrice } from '@/actions/getMinPrice';
import { updateCartQuantity } from '@/actions/updateCartQuantity';

function BuyTicketDialog({
  event,
}: {
  event: Awaited<ReturnType<typeof getUpcomingEvents>>[0];
}) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [loadingEventOptions, setLoadingEventOptions] =
    useState<boolean>(false);
  const [selectedOption, setSelectOption] = useState<{
    id: string;
    name: string;
    price: number;
  }>({
    id: '',
    name: '',
    price: 0,
  });
  const [eventOptions, setEventOptions] = useState<
    Awaited<ReturnType<typeof getEventOptionsTickets>>
  >([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [ticket, setTicket] =
    useState<Awaited<ReturnType<typeof getTicket>>>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [expiredEvent, setExpiredEvent] = useState<boolean | undefined>(
    undefined
  );

  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    if (Date.now() > event.time.getTime()) {
      setExpiredEvent(true);
    }

    getEventOptionsTickets(event.id)
      .then((eventOptions) => {
        setLoadingEventOptions(true);
        setEventOptions(eventOptions);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingEventOptions(false));
  }, []);

  async function addTicketToCartHandler(e: MouseEvent<ElementRef<'button'>>) {
    if (!selectedOption.name) return toast('please select an option');

    let eventNames = event.options.map((opt) => opt.name) as [
      string,
      ...string[]
    ];
    let eventPrices = event.options.map((opt) => String(opt.price)) as [
      string,
      ...string[]
    ];

    let schema = z.object({
      name: z.enum(eventNames).default(eventNames[0]),
      price: z.enum(eventPrices),
      quantity: z.number().min(1),
    });

    const result = schema.safeParse({
      name: selectedOption.name,
      price: selectedOption.price.toString(),
      quantity,
    });

    if (!result.success) return toast('invalid input');

    try {
      const ticket = await getTicket(event.id, selectedOption.id);

      if (!user) return toast('you are not logged in');
      // if (expiredEvent) return toast('event expired');
      if (!ticket) return toast('no ticket found');
      setTicket(ticket);

      if (!ticket.stock) return toast('tickets sold out');

      const ticketCartItem = await getCartItemByTicketId(ticket.id);
      if (
        quantity > TICKETS_LIMIT ||
        ticketCartItem?.quantity === TICKETS_LIMIT
      )
        return toast(`${TICKETS_LIMIT} tickets max`);
      else if (quantity > ticket.stock) return toast('not enough tickets');

      let reachedLimit = false;
      const orderItemsQty = Number(
        (await getSumOrderItems(user.id, ticket.id)) || 0
      );
      if (orderItemsQty + quantity > TICKETS_LIMIT) {
        reachedLimit = true;
      }

      let ticketsLeftToBuy = TICKETS_LIMIT - orderItemsQty;

      if (reachedLimit)
        return toast(
          `You bought ${orderItemsQty}, only ${ticketsLeftToBuy} left`
        );

      let inTheCart = user.cart.items.find(
        (item: typeof cartItems.$inferSelect) => item.ticketId === ticket.id
      );

      if (inTheCart) {
        // just update quantity
        updateCartQuantity(inTheCart.id, undefined, quantity).then(
          ({ success, message }) => {
            if (message) toast(message);
            if (success) setShowDialog(false);
          }
        );
        return;
      }

      let newCartItem: typeof cartItems.$inferInsert = {
        quantity,
        cartId: user.cart.id,
        ticketId: ticket.id,
      };

      // check if ticket exists in the users' cart items
      setIsLoading(true);

      const cartItem = await addCartItem(newCartItem);
      toast('new cart item added', {
        action: {
          label: 'cart',
          onClick: () => {
            router.replace('/cart');
          },
        },
      });
      setIsLoading(false);
      setShowDialog(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    !expiredEvent && (
      <Dialog onOpenChange={setShowDialog} open={showDialog}>
        <DialogTrigger asChild>
          <Button className="text-sm tracking-tight scroll-m-20 mt-4">
            Buy Ticket
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Buy Ticket</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {loadingEventOptions ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Select
              onValueChange={(val) => {
                let obj = JSON.parse(val);
                setSelectOption({
                  id: obj.id,
                  name: obj.name,
                  price: +obj.price,
                });
              }}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  {/* @ts-ignore */}
                  {eventOptions.map(
                    ({ optionId, optionName, optionPrice, ticketStock }) => {
                      return (
                        <SelectItem
                          key={optionId}
                          value={JSON.stringify({
                            id: optionId,
                            name: optionName,
                            price: optionPrice,
                          })}
                          className="flex"
                          disabled={ticketStock === 0 ? true : false}
                        >
                          {optionName?.toUpperCase()}
                          {ticketStock === 0
                            ? '---SOLD OUT'
                            : `---${ticketStock} left`}
                        </SelectItem>
                      );
                    }
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <div className="space-y-2">
            <p>quantity</p>
            <Input
              type="number"
              // min={1}
              // max={3}
              value={quantity}
              onChange={(e) => {
                setQuantity(+e.target.value);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <small className="text-sm font-medium leading-none">price</small>
            <p>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(selectedOption.price || 0)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <small className="text-sm font-medium leading-none">total</small>
            <p>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(selectedOption.price * quantity)}
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={(e) => {
                if (quantity >= 1 && quantity <= TICKETS_LIMIT)
                  addTicketToCartHandler(e);
                else toast(`tickets: min 1, max ${TICKETS_LIMIT}`);
              }}
              type="submit"
              className="flex justify-center text-center"
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                'Add to Cart'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
}

export default BuyTicketDialog;
