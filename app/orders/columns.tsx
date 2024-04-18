'use client';

import { orders } from '@/drizzle/schema';
import { createOrderId } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import TimeAgo from 'react-timeago';

export const columns: ColumnDef<typeof orders.$inferSelect>[] = [
  {
    accessorKey: 'id',
    header: 'Order N֯',
    cell: ({ row }) => {
      const formatted = `${row.getValue('id')}`.slice(0, 4);
      return <div className="">{`ORD-${formatted}`}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      return (
        <div className="">
          {<TimeAgo date={row.getValue('createdAt') as Date} />}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(row.getValue('total')));
      return <div className="">{formatted}</div>;
    },
  },
];
