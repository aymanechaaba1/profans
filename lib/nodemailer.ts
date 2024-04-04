import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'aymanechaaba1@gmail.com',
    pass: process.env.NODEMAILER_PASS, // secret key
  },
});
