import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'aymanechaaba1@gmail.com',
    pass: 'ozvo hrxc eahj rgeg', // secret key
  },
});
