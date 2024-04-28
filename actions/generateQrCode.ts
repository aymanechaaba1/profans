'use server';

import QRCode from 'qrcode';

export async function generateQrCode<Payload>(payload: Payload) {
  const url = await QRCode.toDataURL(JSON.stringify(payload));
  return url;
}
