'use server';

import ContactUsMessageEmail from '@/components/emails/ContactUsMessageEmail';
import resend from '@/lib/resend';
import {
  MESSAGE_MAX_LENGTH,
  MIN_LENGTH_FIRSTNAME,
  MIN_LENGTH_LASTNAME,
} from '@/utils/config';
import { z } from 'zod';
import type { CreateEmailResponse } from 'resend';
import { ContactUsFormState } from '@/types/forms/contact-us-form';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { headers } from 'next/headers';

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

  let emailData: CreateEmailResponse = {
    data: null,
    error: null,
  };
  try {
    emailData = {
      data: {
        id: 'l2k3l2',
      },
      error: null,
    };
    // emailData = await resend.emails.send({
    //   from: `Profans <onboarding@resend.dev>`, // contact@profans.com
    //   to: ['aymanechaaba1@gmail.com'],
    //   subject: `New Message from ${firstname} ${lastname} 💌`,
    //   react: ContactUsMessageEmail({
    //     firstname,
    //     lastname,
    //     email,
    //     phone,
    //     message,
    //   }),
    // });
  } catch (err) {
    return undefined;
  }

  return emailData;
}
