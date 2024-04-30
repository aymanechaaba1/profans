import { getOrders } from '@/actions/getOrders';
import { formatId } from '@/lib/utils';
import { formatPrice } from '@/utils/helpers';
import { Hr } from '@react-email/components';
import Image from 'next/image';
import React from 'react';
import { Separator } from './ui/separator';

function TicketPreview({
  order,
  qrUrl,
}: {
  order: Awaited<ReturnType<typeof getOrders>>[0];
  qrUrl: string;
}) {
  return (
    <div className="space-y-2">
      <div>
        <small className="text-[10px] uppercase text-center block">
          {order.time?.toUTCString()}
        </small>
      </div>
      <Separator />
      <div className="">
        <small className="text-[10px] uppercase text-center block font-semibold">
          ORD-{formatId(order.orderId!)}
        </small>
        <small className="text-[10px] uppercase text-center block font-semibold">
          TICK-{`${formatId(order.ticketId!)}`}
        </small>
      </div>
      <Separator />
      <div>
        <h1 className="text-center tracking-tight font-semibold scroll-m-20">
          {order.eventName}
        </h1>
        <p className="text-center text-sm uppercase tracking-tight font-medium">
          <span className="">{order.option}</span>
        </p>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-x-3">
        <p className="text-right text-sm">Unit Price:</p>
        <p className="font-semibold text-left text-sm">
          {formatPrice(Number(order.unitPrice))}
        </p>
        <p className="text-right text-sm ">Qty:</p>
        <p className="font-semibold text-left text-sm">{order.quantity}</p>
        <p className="text-right text-sm ">Total:</p>
        <p className="font-semibold text-left text-sm">
          {formatPrice(Number(order.total))}
        </p>
      </div>
      <Image
        src={qrUrl}
        width={100}
        height={100}
        alt="qr"
        className="object-cover w-full"
      />
    </div>
  );
}

export default TicketPreview;
