import { getOrders } from '@/actions/geOrders';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { orderItems, orders } from '@/drizzle/schema';
import { formatId } from '@/lib/utils';
import { formatPrice } from '@/utils/helpers';
import TimeAgo from 'react-timeago';
import { FaDownload } from 'react-icons/fa';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import useSession from '@/hooks/useSession';
import { useRouter } from 'next/navigation';

function OrdersTable({
  userOrders,
}: {
  userOrders: Awaited<ReturnType<typeof getOrders>>;
}) {
  const session = useSession();
  const router = useRouter();

  return (
    <Table>
      <TableCaption>A list of your recent orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Order Id</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Event</TableHead>
          <TableHead className="">Ticket Id</TableHead>
          <TableHead className="">Option</TableHead>
          <TableHead className="">Quantity</TableHead>
          <TableHead className="">Unit Price</TableHead>
          <TableHead className="">Total</TableHead>
          <TableHead className="">Tickets</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userOrders.map((order, i) => (
          <TableRow key={order.orderId}>
            <TableCell>{formatId(order.orderId || '', 'ORD')}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>
              <TimeAgo date={order.time!} />
            </TableCell>
            <TableCell>{order.eventName}</TableCell>
            <TableCell>{formatId(order.ticketId || '')}</TableCell>
            <TableCell>{order.option?.toUpperCase()}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>{formatPrice(Number(order.unitPrice || 0))}</TableCell>
            <TableCell>{formatPrice(Number(order.total || 0))}</TableCell>
            <TableCell>
              <FaDownload
                className="text-center mx-auto text-slate-800 dark:text-slate-300 cursor-pointer"
                onClick={async () => {
                  if (!session || !session.user) return;
                  let path = `/tickets/${session.user.id}/${order.orderId}_${order.ticketId}_${i}.pdf`;
                  let url = await getDownloadURL(ref(storage, path));

                  const xhr = new XMLHttpRequest();
                  xhr.responseType = 'blob';
                  xhr.onload = (event) => {
                    const blob = xhr.response;
                    let blobUrl = window.URL.createObjectURL(blob);

                    let link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `ticket-${order.ticketId}`;

                    document.body.appendChild(link);

                    link.click();

                    window.URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(link);
                  };
                  xhr.open('GET', url);
                  xhr.send();
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default OrdersTable;
