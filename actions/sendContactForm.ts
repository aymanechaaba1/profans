'use server';

import ContactUsMessageEmail from '@/components/emails/ContactUsMessageEmail';
import resend from '@/lib/resend';
import {
  MESSAGE_MAX_LENGTH,
  MIN_LENGTH_FIRSTNAME,
  MIN_LENGTH_LASTNAME,
} from '@/utils/config';
import { z } from 'zod';

const contactFormSchema = z.object({
  firstname: z.string().min(MIN_LENGTH_FIRSTNAME),
  lastname: z.string().min(MIN_LENGTH_LASTNAME),
  email: z.string().email(),
  phone: z.string().regex(new RegExp(/^\+(?:[0-9] ?){6,14}[0-9]$/)),
  message: z.string().max(MESSAGE_MAX_LENGTH),
});

export async function sendContactForm(prevState: any, formData: FormData) {
  let data = Object.fromEntries(formData.entries());
  const result = contactFormSchema.safeParse(data);

  if (!result.success)
    return {
      errors: result.error.flatten().fieldErrors,
    };

  let { firstname, lastname, email, phone, message } = result.data;

  let emailData: any = {
    data: null,
    error: null,
  };
  try {
    emailData = await resend.emails.send({
      from: `Profans <onboarding@resend.dev>`, // contact@profans.com
      to: ['aymanechaaba1@gmail.com'],
      subject: `New Message from ${firstname} ${lastname} 💌`,
      react: ContactUsMessageEmail({
        firstname,
        lastname,
        email,
        phone,
        message,
      }),
    });
  } catch (err) {
    return undefined;
  }

  return emailData;
}
