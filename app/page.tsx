import { generateQrCode } from '@/actions/generateQrCode';
import { getPdfBuffer } from '@/actions/getPdfBuffer';
import { uploadPdfToFirebase } from '@/actions/uploadPdfToFirebase';
import { Ticket } from '@/components/ticket';
import TicketLayout from '@/components/ticket/TicketLayout';
import { Button } from '@/components/ui/button';
import db from '@/drizzle';
import { redirect } from 'next/navigation';

export default async function Home() {
  return (
    <div className="space-y-4">
      <TicketLayout />
    </div>
  );
}
