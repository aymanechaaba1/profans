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

function OrdersTable({
  userOrders,
}: {
  userOrders: Awaited<ReturnType<typeof getOrders>>;
}) {
  console.log(userOrders[0]);
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {userOrders.map((order) => (
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default OrdersTable;
