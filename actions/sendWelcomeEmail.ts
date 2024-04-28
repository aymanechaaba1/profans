'use server';

import WelcomeEmail from '@/components/emails/WelcomeEmail';
import { users } from '@/drizzle/schema';
import resend from '@/lib/resend';
import { getUser } from '@/lib/utils';
import { upperFirst } from '@/utils/helpers';

export async function sendWelcomeEmail(user: typeof users.$inferSelect) {
  const emailData = await resend.emails.send({
    from: 'Profans <onboarding@resend.dev>',
    to: ['aymanechaaba1@gmail.com'],
    subject: `${upperFirst(user.firstname)}, Welcome to Profans!`,
    react: WelcomeEmail({ user }),
  });

  return emailData;
}
