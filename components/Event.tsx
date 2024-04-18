'use client';

import { cartItems, eventOptions, events } from '@/drizzle/schema';
import { cn, formatPrice, getTeams, simulateLongTask } from '@/utils/helpers';
import Image from 'next/image';
import { ElementRef, MouseEvent, use, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import Link from 'next/link';
import { Clock, ExternalLink, Loader2, MapPin, Send } from 'lucide-react';
import { useTimer } from 'react-timer-hook';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from './ui/input';
import { z } from 'zod';
import { toast } from 'sonner';
import useSession from '@/hooks/useSession';
import { getTicket } from '@/actions/getTicket';
import { addCartItem } from '@/actions/addCartItem';
import { getCart } from '@/actions/getCart';
import { getCartItemByTicketId } from '@/actions/getCartItemByTicketId';
import { updateCartQuantity } from '@/actions/updateCartQuantity';
import { useRouter } from 'next/navigation';
import { TICKETS_LIMIT } from '@/utils/config';
import { getEventOptionsTickets } from '@/actions/getEventOptionsTickets';
import { getEvent } from '@/actions/getEvent';
import { getSumOrderItems } from '@/actions/getSumOrderItems';
import { getMinPrice } from '@/actions/getMinPrice';
import { getUpcomingEvents } from '@/actions/getUpcomingEvents';

function Event({
  event,
}: {
  event: Awaited<ReturnType<typeof getUpcomingEvents>>[0];
}) {
  const [timerExpired, setTimerExpired] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedOption, setSelectOption] = useState<{
    id: string;
    name: string;
    price: number;
  }>({
    id: '',
    name: '',
    price: 0,
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [ticket, setTicket] =
    useState<Awaited<ReturnType<typeof getTicket>>>(undefined);
  const [expiredEvent, setExpiredEvent] = useState<boolean | undefined>(
    undefined
  );
  const [eventOptions, setEventOptions] = useState<
    Awaited<ReturnType<typeof getEventOptionsTickets>>
  >([]);
  const [loadingEventOptions, setLoadingEventOptions] =
    useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number>(0);

  let time = new Date();
  let timeLeft = event.time.getTime() - Date.now();
  time.setSeconds(time.getSeconds() + timeLeft / 1000);

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: time,
    onExpire: () => setTimerExpired(true),
  });
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    if (Date.now() > event.time.getTime()) {
      setExpiredEvent(true);
    }

    Promise.all([getEventOptionsTickets(event.id), getMinPrice(event.id)])
      .then(([eventOptions, minPrice]) => {
        setLoadingEventOptions(true);
        setEventOptions(eventOptions);
        setMinPrice(Number(minPrice));
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

      const orderItemsQty = Number((await getSumOrderItems(ticket.id)) || 0);
      console.log(orderItemsQty);
      if (orderItemsQty + quantity > TICKETS_LIMIT) {
        reachedLimit = true;
      }

      let ticketsLeftToBuy = TICKETS_LIMIT - orderItemsQty;

      if (reachedLimit)
        return toast(
          `You bought ${orderItemsQty}, only ${ticketsLeftToBuy} left`
        );

      let inTheCart = user.cart.items.find(
        (item) => item.ticketId === ticket.id
      );

      if (inTheCart) {
        // just update quantity
        updateCartQuantity(quantity, inTheCart.id).then(
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
    isClient && (
      <Card className="rounded-lg">
        {event.thumbnail && (
          <div className="w-full h-40 mb-3">
            <Image
              priority
              src={event.thumbnail}
              width={100}
              height={100}
              alt={event.name}
              className="w-full h-full object-cover object-center rounded-t-lg"
            />
          </div>
        )}
        <CardContent>
          <div className="mb-1">
            <div className="flex items-start justify-between">
              <div className="mb-3 space-y-2">
                <CardTitle className="">{event.name}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </div>
              <Link href={`/events/${event.id}`}>
                <Send size={18} />
              </Link>
            </div>
            <div className="flex items-center gap-x-2">
              <MapPin size={13} />
              <p className="text-sm">{event.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <Clock size={13} />
            <p className="text-gray-900 text-xs">
              {new Intl.DateTimeFormat('en-US', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }).format(event.time)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            {!expiredEvent && (
              <div>
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
                              ({
                                optionId,
                                optionName,
                                optionPrice,
                                ticketStock,
                              }) => {
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
                      <small className="text-sm font-medium leading-none">
                        price
                      </small>
                      <p>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(selectedOption.price || 0)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <small className="text-sm font-medium leading-none">
                        total
                      </small>
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
                <p className="text-xs mt-2 text-center">
                  starts at{' '}
                  <span className="font-semibold">{formatPrice(minPrice)}</span>
                </p>
              </div>
            )}
            <p
              className={cn('text-xs mt-3', {
                'text-red-500 font-semibold': totalSeconds / 3600 <= 24,
              })}
            >
              {!expiredEvent
                ? `${days}d:${hours}h:${minutes}m:${seconds}s`
                : 'expired'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  );
}

export default Event;
