'use server';

import OTPEmail from '@/components/emails/OTPEmail';
import { CreateEmailResponse } from 'resend';
import resend from '@/lib/resend';

export async function sendOtp(otp: string) {
  let emailResult: CreateEmailResponse;
  try {
    emailResult = await resend.emails.send({
      from: 'Profans <onboarding@resend.dev>',
      to: ['aymanechaaba1@gmail.com'],
      subject: 'OTP for Authentication',
      react: OTPEmail({ code: otp }),
    });
  } catch (err) {
    return undefined;
  }

  return emailResult.data;
}
