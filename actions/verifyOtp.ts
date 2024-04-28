'use server';

import { DEFAULT_OTP_TIME } from '@/utils/config';
// import twofactor from 'node-2fa';
const twofactor = require('node-2fa');

export async function verifyOtp(secret: string, token: string) {
  const result = twofactor.verifyToken(secret, token, DEFAULT_OTP_TIME);
  return result;
}
