'use server';

import db from '@/drizzle';
import { claims } from '@/drizzle/schema';
import { getUser } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export const addClaim = async (
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; message: string }> => {
  let subject = formData.get('subject') as string;
  let message = formData.get('message') as string;
  if (!subject)
    return {
      success: false,
      message: 'please add a subject',
    };
  else if (!message)
    return {
      success: false,
      message: 'please add a message',
    };
  try {
    const user = await getUser();
    if (!user)
      return {
        success: false,
        message: 'no user found',
      };

    await db.insert(claims).values({
      subject,
      message,
      userId: user.id,
    });

    revalidatePath('/account');
    return {
      success: true,
      message: 'new claim added',
    };
  } catch (err) {
    return {
      success: false,
      message: 'something went wrong!',
    };
  }
};
