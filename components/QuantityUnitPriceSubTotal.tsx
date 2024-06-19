import { CircleHelp, Loader2, Minus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Input } from './ui/input';
import { formatPrice } from '@/utils/helpers';
import { toast } from 'sonner';
import { TICKETS_LIMIT } from '@/utils/config';
import { getSumOrderItems } from '@/actions/getSumOrderItems';
import { getCartItemByTicketId } from '@/actions/getCartItemByTicketId';
import { getCartItemById } from '@/actions/getCartItemById';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useSession from '@/hooks/useSession';
import { Separator } from './ui/separator';
import { getSession } from '@/actions/getSession';
import QuantityPicker from './cart/QuantityPicker';
import { getUser } from '@/lib/utils';

async function QuantityUnitPriceSubTotal({
  quantity,
  unitPrice,
  cartItemId,
}: {
  quantity: number;
  unitPrice: number;
  cartItemId: string;
}) {
  // const [price, setPrice] = useState<number>(unitPrice);
  // // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const session = useSession();

  // const [boughtTickets, setBoughtTickets] = useState<number>(0);
  // const [ticketsLeftToBuy, setTicketsLeftToBuy] = useState<number>(0);

  // useEffect(() => {
  //   getCartItemById(cartItemId)
  //     .then((cartItem) => {
  //       return (
  //         cartItem?.ticketId &&
  //         session.user &&
  //         getSumOrderItems(session.user.id, cartItem?.ticketId)
  //       );
  //     })
  //     .then((sum) => {
  //       setBoughtTickets(Number(sum || 0));
  //       setTicketsLeftToBuy(TICKETS_LIMIT - Number(sum || 0));
  //     })
  //     .catch((err) => {
  //       toast('something went wrong!');
  //     });

  // if (qty >= 1 && qty <= TICKETS_LIMIT && qty <= ticketsLeftToBuy) {
  //   updateCartQuantity(qty, cartItemId)
  //     .then(({ success, message }) => {})
  //     .catch((err) => {});
  // }
  // }, [qty]);

  let user = await getUser();

  let cartItem = await getCartItemById(cartItemId);
  let boughtTickets: number = 0;
  let ticketsLeftToBuy: number = 0;
  if (cartItem?.ticketId && user?.id) {
    let sum = await getSumOrderItems(user.id, cartItem.ticketId);
    boughtTickets = Number(sum || 0);
    ticketsLeftToBuy = TICKETS_LIMIT - Number(sum || 0);
  }

  // function increment() {
  //   setQty((prev) => prev + 1);
  // }

  // function decrement() {
  //   if (qty > 0) setQty((prev) => prev - 1);
  // }

  return (
    <>
      <div>
        <Separator className="mb-3" />
        <div className="space-y-2">
          <div className="flex items-center gap-x-3">
            Quantity{' '}
            <span className="text-xs text-red-500">
              (You bought {boughtTickets}, {ticketsLeftToBuy} left)
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <CircleHelp size={10} />
                </TooltipTrigger>
                <TooltipContent>
                  <small className="text-xs">
                    max number of tickets to buy
                  </small>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="">
            <QuantityPicker
              cartItemId={cartItemId}
              unitPrice={unitPrice}
              quantity={quantity}
              ticketsLeftToBuy={ticketsLeftToBuy}
            />
          </div>
        </div>
        <Separator className="" />
      </div>
    </>
  );
}

export default QuantityUnitPriceSubTotal;
