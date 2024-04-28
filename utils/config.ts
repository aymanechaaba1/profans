export const alg = 'HS256';
export const secret = process.env.AUTH_SECRET;
export const key = new TextEncoder().encode(secret);
export const expiresIn = 24 * 60 * 60; // in s
export const TICKETS_LIMIT: number = 3;
export const MODE: 'dev' | 'prev' | 'prod' = 'prod';
export const MESSAGE_MAX_LENGTH = 250;
export const MIN_LENGTH_FIRSTNAME = 3;
export const MIN_LENGTH_LASTNAME = 3;
export const LOGO_URL =
  'https://firebasestorage.googleapis.com/v0/b/tadakirnet-clone-ae832.appspot.com/o/tadakirnet-clone%20logo2.png?alt=media&token=1518680c-5586-4e8f-a44a-d8fb1aadf408';
export const APP_URL = 'https://tadakirnet-clone.vercel.app';
export const DEFAULT_OTP_TIME = 10; // in minutes
