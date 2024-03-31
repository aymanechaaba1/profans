'use server';

import speakeasy from 'speakeasy';

export async function generateOTP() {
  const otp = speakeasy.totp({
    secret: speakeasy.generateSecret().base32,
    digits: 6,
  });

  return otp;
}
