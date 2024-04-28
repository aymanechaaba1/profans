import { generateQrCode } from '@/actions/generateQrCode';
import db from '@/drizzle';
import { eventOptions, orderItems } from '@/drizzle/schema';
import { formatId } from '@/lib/utils';
import { formatPrice } from '@/utils/helpers';

type Payload = {
  userId: string;
  orderId: string;
  ticketId: string;
  eventOptionId: string;
  orderItemTime: number;
  eventId: string;
};

export const Ticket = async (orderItem: typeof orderItems.$inferSelect) => {
  const data = await db.query.orderItems.findFirst({
    where: (orderItems, { eq, and }) =>
      and(
        eq(orderItems.orderId, orderItem.orderId),
        eq(orderItems.ticketId, orderItem.ticketId)
      ),
    with: {
      order: {
        with: {
          user: true,
        },
      },
      ticket: {
        with: {
          eventOption: {
            with: {
              event: true,
            },
          },
        },
      },
    },
  });
  if (!data) return;

  const qrCodeUrl = await generateQrCode<Payload>({
    userId: data.order.user.id,
    orderId: orderItem.orderId,
    ticketId: orderItem.ticketId,
    eventOptionId: data.ticket.eventOption.id,
    orderItemTime: orderItem.createdAt?.getTime() || Date.now(),
    eventId: data.ticket.eventId || '',
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <title>Ticket ${orderItem.orderId}</title>
    </head>
    <body>
      <div class="flex flex-col justify-between w-full p-4 rounded-lg">
      
        <header class="flex items-start justify-between mb-3">
          <div class="space-y-1">
            <p class="text-xs tracking-tight scroll-m-20">
              <span>orderId:</span>
              <span class="font-semibold">${formatId(orderItem.orderId)}</span>
            </p>
            <p class="text-xs tracking-tight scroll-m-20">
              <span>Quantity:</span>
              <span class="font-semibold">${orderItem.quantity}</span>
            </p>
            <p class="text-xs text-left tracking-tight scroll-m-20">
              <span>ticketId:</span>
              <span class="font-semibold">${formatId(orderItem.ticketId)}</span>
            </p>
            <p class="text-xs text-left mb-2 tracking-tight scroll-m-20">
              <span>Option:</span>
              <span class="font-semibold">
                ${data.ticket.eventOption.name.toUpperCase()}
              </span>
            </p>
          </div>
          <div>
            <p class="text-xs text-right tracking-tight scroll-m-20">
              ${new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              }).format(new Date(orderItem.createdAt || Date.now()))}
            </p>
          </div>
        </header>

        <main class="flex-1 flex items-start justify-between">
          <img
            src="${data.ticket.eventOption.event.thumbnail || ''}"
            alt="${data.ticket.eventOption.name}"
            class="w-[200px] h-[100px] object-cover rounded-lg my-4"
          />
          <div class="space-y-2">
            <div>
              <p class="font-semibold tracking-tight scroll-m-20 text-right">
                ${data.ticket.eventOption.event.name}
              </p>
              <p class="font-semibold tracking-tight scroll-m-20 text-right">
              ${data.ticket.eventOption.event.location}
            </p>
              <p class="text-xs text-slate-400 tracking-tight scroll-m-20 text-right">
                ${data.ticket.eventOption.event.description}
              </p>
              <p class="text-xs text-slate-500 tracking-tight scroll-m-20 my-2 text-right">
                At:
                <span>
                  ${new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                  }).format(data.ticket.eventOption.event.time)}
                </span>
              </p>
            </div>
            <div>
              <p class="font-semibold tracking-tight scroll-m-20 text-right">
                ${data.order.user.firstname} ${data.order.user.lastname}
              </p>
              <p class="text-xs text-slate-400 tracking-tight scroll-m-20 text-right">
                ${data.order.user.email}
              </p>
            </div>
          </div>
        </main>
       
        <footer class="flex items-center justify-between flex-row-reverse">
          <p class="text-sm mt-4 tracking-tight scroll-m-20 font-semibold text-slate-600">
            ${formatPrice(Number(data.ticket.eventOption.price || 0))}
          </p>
          <img src=${qrCodeUrl} class="w-[100px]" alt="qrcode" />
        </footer>
      </div>
    </body>
    </html>
`;
};
