'use client';

import { CircleHelp, Loader2, Minus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Input } from './ui/input';
import { formatPrice } from '@/utils/helpers';
import { updateCartQuantity } from '@/actions/updateCartQuantity';
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

function QuantityUnitPriceSubTotal({
  quantity,
  unitPrice,
  cartItemId,
}: {
  quantity: number;
  unitPrice: number;
  cartItemId: string;
}) {
  const [qty, setQty] = useState<number>(quantity);
  const [price, setPrice] = useState<number>(unitPrice);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const session = useSession();

  const [boughtTickets, setBoughtTickets] = useState<number>(0);
  const [ticketsLeftToBuy, setTicketsLeftToBuy] = useState<number>(0);

  useEffect(() => {
    getCartItemById(cartItemId)
      .then((cartItem) => {
        return (
          cartItem?.ticketId &&
          session.user &&
          getSumOrderItems(session.user.id, cartItem?.ticketId)
        );
      })
      .then((sum) => {
        setBoughtTickets(Number(sum || 0));
        setTicketsLeftToBuy(TICKETS_LIMIT - Number(sum || 0));
      })
      .catch((err) => {
        toast('something went wrong!');
      });

    if (qty >= 1 && qty <= TICKETS_LIMIT && qty <= ticketsLeftToBuy) {
      setIsLoading(true);
      updateCartQuantity(qty, cartItemId)
        .then(({ success, message }) => {
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [qty]);

  return (
    <div>
      <div>
        <div className="flex items-center gap-x-3">
          quantity{' '}
          <span className="text-xs text-red-500">
            (you bought {boughtTickets}, {ticketsLeftToBuy} left)
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <CircleHelp size={10} />
              </TooltipTrigger>
              <TooltipContent>
                <small className="text-xs">
                  max number of tickets to buy is 3
                </small>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex-items-center-gap-x-3">
          {!isLoading ? (
            <Input
              type="number"
              className="mt-3"
              value={qty}
              min={1}
              max={ticketsLeftToBuy}
              onChange={(e) => {
                setQty(+e.target.value);
              }}
            />
          ) : (
            <Loader2 size={18} className="animate-spin mt-2" />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 mt-5">
        <small className="small">unit price</small>
        <p className="text-right font-semibold">{formatPrice(price)}</p>
        <small className="small">subtotal</small>
        <p className="text-right font-semibold">{formatPrice(price * qty)}</p>
      </div>
    </div>
  );
}

export default QuantityUnitPriceSubTotal;
