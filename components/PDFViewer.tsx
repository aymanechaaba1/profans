'use client';

import dynamic from 'next/dynamic';

const ClientPdf = dynamic(() => import('./ticket/TicketLayout'), {
  ssr: false,
});

export default ClientPdf;
