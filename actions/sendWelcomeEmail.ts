'use server';

import WelcomeEmail from '@/components/emails/WelcomeEmail';
import { users } from '@/drizzle/schema';
import resend from '@/lib/resend';
import { getUser } from '@/lib/utils';
import { MAIN_DOMAIN } from '@/utils/config';
import { upperFirst } from '@/utils/helpers';

export async function sendWelcomeEmail(user: typeof users.$inferSelect) {
  const emailData = await resend.emails.send({
    from: `Profans <welcome@${MAIN_DOMAIN}>`,
    to: user.email,
    subject: `${upperFirst(user.firstname)}, Welcome to Profans!`,
    react: WelcomeEmail({ user }),
  });

  return emailData;
}
