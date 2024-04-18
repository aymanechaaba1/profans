'use client';

import { Loader2, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { formatPrice } from '@/utils/helpers';
import { updateCartQuantity } from '@/actions/updateCartQuantity';
import { toast } from 'sonner';

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

  useEffect(() => {
    // update cart item qty on the database
    if (qty >= 1 && qty <= 3) {
      setIsLoading(true);
      updateCartQuantity(qty, cartItemId)
        .then(({ success, message }) => {
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    } else toast('min tickets is 1 and max is 3');
  }, [qty]);

  return (
    <div>
      <div>
        <small className="small">quantity</small>
        <div className="flex-items-center-gap-x-3">
          {!isLoading ? (
            <Input
              type="number"
              className="mt-3"
              value={qty}
              min={1}
              max={3}
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
