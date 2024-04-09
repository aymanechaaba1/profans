import db from '@/drizzle';
import { columns } from './columns';
import { DataTable } from './data-table';
import { getSession } from '@/actions/getSession';

export default async function DemoPage() {
  const session = await getSession();

  let data;
  if (session && session.id)
    data = await db.query.orders.findMany({
      where: (orders, { eq }) => eq(orders.userId, session.id as string),
      orderBy: (orders, { desc }) => desc(orders.createdAt),
    });

  return (
    <div className="my-5">
      {data && (
        <>
          <h1 className="text-2xl mb-4 tracking-tight scroll-m-20">
            Your Orders
          </h1>
          <DataTable columns={columns} data={data} />
        </>
      )}
    </div>
  );
}
