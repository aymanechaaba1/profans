'use server';

import QRCode from 'qrcode';

type Payload = {
  userId: string;
  orderId: string;
  ticketId: string;
  eventOptionId: string;
  orderItemTime: number;
  eventId: string;
};
export async function generateQrCode(payload: Payload) {
  const url = await QRCode.toDataURL(JSON.stringify(payload));
  return url;
}
