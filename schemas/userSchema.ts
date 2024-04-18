import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  gender: z.enum(['male', 'female']),
  firstname: z.string().min(2).trim(),
  lastname: z.string().min(2).trim(),
  cin: z.string().regex(new RegExp(/^[a-zA-Z].*/)),
  birthdate: z.coerce.date(),
  city: z.string(),
  calling_code: z.string().regex(new RegExp(/^\+\d{1,3}$/)),
  phone: z
    .string()
    .regex(new RegExp(/^(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/)),
  email: z.string().trim().email(),
});
