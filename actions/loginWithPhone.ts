'use server';

import db from '@/drizzle/seed';
import client, { verifySid } from '@/lib/twilio';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
import { z } from 'zod';

const emailFormSchema = z.object({
  calling_code: z.string().regex(new RegExp(/^\+\d{1,3}$/)),
  phone: z.string().regex(new RegExp(/^(\d{3}|[(]?[0-9]+[)])?([ ]?[0-9])+$/)),
});

export async function loginWithPhone(formData: FormData) {
  let data = Object.fromEntries(formData.entries());
  let message: string = '';
  let verificationStatus: VerificationInstance | undefined;

  // validate phone
  let result = emailFormSchema.safeParse(data);

  if (!result.success) {
    message = 'invalid phone';
    return { message };
  }

  let phone = `${result.data.calling_code}${result.data.phone}`;

  try {
    // check user
    let user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.phone, phone),
      columns: {
        phone: true,
      },
    });

    if (!user?.phone) {
      message = "user doesn't exist";
      return { message };
    }

    // send sms verification code
    const verification = await client.verify.v2
      .services(verifySid!)
      .verifications.create({ to: phone, channel: 'sms' });
    verificationStatus = verification;
  } catch (err) {
    console.log(err);
    message = 'something went wrong!';
  } finally {
    return { phone, message, verificationStatus };
  }
}
