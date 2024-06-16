'use client';

import { updateCartQuantity } from '@/actions/updateCartQuantity';
import { TICKETS_LIMIT } from '@/utils/config';
import { formatPrice } from '@/utils/helpers';
import { Loader2 } from 'lucide-react';
import React, {
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from 'react';
import { useFormState } from 'react-dom';

function QuantityPicker({
  cartItemId,
  unitPrice,
  quantity,
  ticketsLeftToBuy,
}: {
  cartItemId: string;
  unitPrice: number;
  quantity: number;
  ticketsLeftToBuy: number;
}) {
  const [optimisticData, setOptimisticData] = useOptimistic({
    qty: quantity,
    subTotal: quantity * unitPrice,
  });

  // if (
  //   quantity >= 1 &&
  //   quantity <= TICKETS_LIMIT &&
  //   quantity <= ticketsLeftToBuy
  // ) {
  //   setOptimisticSubTotal((unitPrice) => unitPrice * quantity);
  //   startTransition(async () => {
  //     await updateCartQuantity(quantity, cartItemId);
  //   });
  // }

  return (
    <div>
      <div className="flex items-center justify-between">
        <form action="">
          <button
            formAction={async () => {
              setOptimisticData(({ qty, subTotal }) => ({
                qty: qty - 1,
                subTotal: qty * unitPrice,
              }));
              let { success, message } = await updateCartQuantity(
                cartItemId,
                '-'
              );
              console.log(success);
              console.log(message);
            }}
            className="text-[1.5rem] cursor-pointer"
          >
            -
          </button>
        </form>
        <div className="font-bold">{optimisticData.qty}</div>

        <form action="">
          <button
            formAction={async () => {
              setOptimisticData(({ qty, subTotal }) => ({
                qty: qty + 1,
                subTotal: qty * unitPrice,
              }));
              let { success, message } = await updateCartQuantity(
                cartItemId,
                '+'
              );
              console.log(success);
              console.log(message);
            }}
            className="text-[1.5rem] cursor-pointer"
          >
            +
          </button>
        </form>
      </div>
      <div className="grid grid-cols-2 mt-5">
        <small className="small">Unit Price</small>
        <p className="text-right font-semibold">{formatPrice(unitPrice)}</p>
        <small className="small">SubTotal</small>
        <p className="text-right font-semibold">
          {formatPrice(optimisticData.qty * unitPrice)}
        </p>
      </div>
    </div>
  );
}

export default QuantityPicker;
