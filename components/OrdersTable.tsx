import { getOrders } from '@/actions/getOrders';
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
import { formatPrice, getPath } from '@/utils/helpers';
import TimeAgo from 'react-timeago';
import { FaEye } from 'react-icons/fa';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import useSession from '@/hooks/useSession';
import { useRouter } from 'next/navigation';
import { useToJpeg } from '@hugocxl/react-to-image';
import Ticket from './ticket/Ticket';
import { MouseEvent, MouseEventHandler, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function OrdersTable({
  userOrders,
}: {
  userOrders: Awaited<ReturnType<typeof getOrders>>;
}) {
  const session = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [qrUrl, setQrUrl] = useState<string>('');

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
          <TableHead className="text-right">QR</TableHead>
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
            {order.orderId && (
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <FaEye
                      className="text-right float-right mx-auto text-slate-800 dark:text-slate-300 cursor-pointer"
                      onClick={async (e) => {
                        if (!session.user || !order.orderId || !order.ticketId)
                          return;
                        let path = getPath(
                          session.user.id,
                          order.orderId,
                          order.ticketId
                        );

                        setLoading(true);
                        getDownloadURL(ref(storage, path))
                          .then((url) => {
                            setQrUrl(url);
                          })
                          .finally(() => {
                            setLoading(false);
                          });
                      }}
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-[300px]">
                    <DialogHeader></DialogHeader>
                    <div className="flex justify-center items-center">
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Image
                          src={qrUrl}
                          width={100}
                          height={100}
                          alt="qr"
                          className="object-cover w-full"
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default OrdersTable;
