import { getOrders } from '@/actions/getOrders';
import { orderItems } from '@/drizzle/schema';

function Ticket({
  ref,
  orderItem,
}: {
  ref: (domNode: HTMLDivElement) => void;
  orderItem: Awaited<ReturnType<typeof getOrders>>[0];
}) {
  return (
    <div ref={ref} className="hidden">
      <h1>Hello World</h1>
      <p className="text-xs text-red-500">this is a paragraph</p>
    </div>
  );
}

export default Ticket;
