'use server';

import OTPEmail from '@/components/emails/OTPEmail';
import resend from '@/lib/resend';
import { MAIN_DOMAIN } from '@/utils/config';

export async function sendOtp(to: string, otp: string) {
  let emailResult: any;
  try {
    emailResult = await resend.emails.send({
      from: `Profans <noreply@${MAIN_DOMAIN}>`,
      to,
      subject: 'OTP for Authentication',
      react: OTPEmail({ code: otp }),
    });
  } catch (err) {
    return undefined;
  }

  return emailResult.data;
}
