'use server';

import { z } from 'zod';

export async function validateEmail(email: string) {
  const emailSchema = z.string().email();

  let result = emailSchema.safeParse(email);

  if (!result.success) {
    return false;
  }

  return true;
}
