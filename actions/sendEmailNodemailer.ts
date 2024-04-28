'use server';

import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

type Options = {
  from: string;
  to: string;
  subject: string;
  html: string;
};
export async function sendEmailNodemailer(options: Options) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.forwardemail.net',
    port: 465,
    secure: true,
    auth: {
      user: 'aymanechaaba1@gmail.com',
      pass: process.env.NODEMAILER_PASS,
    },
  });

  let res: SMTPTransport.SentMessageInfo;
  try {
    res = await transporter.sendMail(options);
  } catch (err) {
    return undefined;
  }

  return res;
}
