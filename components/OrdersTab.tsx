import { orderItems, orders } from '@/drizzle/schema';
import OrdersTable from './OrdersTable';
import { TabsContent } from '@radix-ui/react-tabs';
import { getOrders } from '@/actions/getOrders';

function OrdersTab({
  userOrders,
}: {
  userOrders: Awaited<ReturnType<typeof getOrders>>;
}) {
  return (
    <TabsContent value="orders">
      <OrdersTable userOrders={userOrders} />
    </TabsContent>
  );
}

export default OrdersTab;
