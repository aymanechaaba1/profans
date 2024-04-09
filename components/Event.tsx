'use client';

import { cartItems, eventOptions, events } from '@/drizzle/schema';
import { cn, formatPrice, getTeams, simulateLongTask } from '@/utils/helpers';
import Image from 'next/image';
import { ElementRef, MouseEvent, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { ExternalLink, Loader2 } from 'lucide-react';
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

function Event({ event }: { event: typeof events.$inferSelect }) {
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
  }, []);

  async function addTicketToCartHandler(e: MouseEvent<ElementRef<'button'>>) {
    if (!selectedOption.name) return toast('please select an option');

    // @ts-ignore
    let eventNames: Readonly<string, string[]> = event.options.map(
      (opt: any) => opt.name
    );
    // @ts-ignore
    let eventPrices = event.options.map((opt) => opt.price.toString());

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

      if (!user) return toast('no user found');
      if (!ticket) return toast('no ticket found');
      if (!ticket.stock) return toast('tickets sold out');

      let newCartItem: typeof cartItems.$inferInsert = {
        quantity,
        cartId: user.cart.id,
        ticketId: ticket.id,
      };

      const userTicketCart = await getCart(user.cart.id, ticket.id);

      if (userTicketCart?.items.length === 3)
        return toast("you can't add more than 3 tickets");

      // check if ticket exists in the users' cart items
      setIsLoading(true);

      const cartIt = await getCartItemByTicketId(ticket.id);

      if (cartIt) {
        // update quantity
        await updateCartQuantity(quantity + cartIt.quantity, cartIt.id);
        toast('quantity updated!', {
          action: {
            label: 'cart',
            onClick: () => {
              router.replace('/cart');
            },
          },
        });
      } else {
        const cartItem = await addCartItem(newCartItem);
        toast('new cart item added', {
          action: {
            label: 'cart',
            onClick: () => {
              router.replace('/cart');
            },
          },
        });
      }
      setIsLoading(false);
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
            <CardTitle className="mb-1">{event.name}</CardTitle>
            <p className="text-sm">{event.location}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="mt-1 text-gray-900 text-xs">
              {new Intl.DateTimeFormat('en-US', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }).format(event.time)}
            </p>
          </div>
          <div className="flex justify-between items-end">
            <Dialog>
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
                      {event.options.map((option) => {
                        return (
                          <SelectItem
                            key={option.id}
                            value={JSON.stringify({
                              id: option.id,
                              name: option.name,
                              price: option.price,
                            })}
                            className="flex"
                          >
                            {option.name.toUpperCase()}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <p>quantity</p>
                  <Input
                    type="number"
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
                    onClick={addTicketToCartHandler}
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
            <p
              className={cn('text-xs', {
                'text-red-500': totalSeconds / 3600 <= 24,
              })}
            >
              {!timerExpired
                ? `${days}d:${hours}h:${minutes}m:${seconds}s`
                : 'finished'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  );
}

export default Event;
