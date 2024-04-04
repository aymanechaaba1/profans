'use server';

import { generateOTP } from './generateOtp';
import nodemailer from 'nodemailer';

type ReturnResponse = {
  otp: string;
  messageId: string;
};
export async function sendOtp(
  email: string
): Promise<ReturnResponse | undefined> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'aymanechaaba1@gmail.com',
      pass: process.env.NODEMAILER_PASS || 'ozvo hrxc eahj rgeg', // secret key
    },
  });

  const otp = await generateOTP();

  try {
    const res = await transporter.sendMail({
      from: '"Tadakir.net Clone" <aymanechaaba1@gmail.com>',
      to: email,
      subject: 'OTP for Authentication',
      text: `Your OTP for authentication is: ${otp}`,
    });
    return { otp, messageId: res.messageId };
  } catch (err) {
    console.log(err);
    return undefined;
  }
}
