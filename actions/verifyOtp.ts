'use server';

import client, { verifySid } from '@/lib/twilio';

export async function verifyOtp(phone: string, code: string) {
  try {
    // verify code
    const verification_check = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code });

    return verification_check;
  } catch (err) {
    console.log(err);
    return err;
  }
}
