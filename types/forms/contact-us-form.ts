import type { CreateEmailResponse } from 'resend';

export type ContactUsFormState =
  | CreateEmailResponse
  | {
      errors: {
        firstname?: string[] | undefined;
        lastname?: string[] | undefined;
        email?: string[] | undefined;
        phone?: string[] | undefined;
        message?: string[] | undefined;
      };
    }
  | null
  | undefined;
