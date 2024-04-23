'use client';

import { ElementRef, useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { unknown, z } from 'zod';
import { cn } from '@/lib/utils';
import { sendContactForm } from '@/actions/sendContactForm';
import { Button } from './ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import {
  MAX_LENGTH,
  MIN_LENGTH_FIRSTNAME,
  MIN_LENGTH_LASTNAME,
} from '@/utils/config';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function SubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className="flex items-center justify-center col-span-3"
      type="submit"
    >
      {pending ? <Loader2 className="animate-spin" /> : 'Send'}
    </Button>
  );
}

function ContactUsForm() {
  const [firstname, setFirstname] = useState<string>('');
  const [validFirstname, setValidFirstname] = useState<boolean | undefined>(
    undefined
  );
  const [lastname, setLastname] = useState<string>('');
  const [validLastname, setValidLastname] = useState<boolean | undefined>(
    undefined
  );
  const [email, setEmail] = useState<string>('');
  const [validEmail, setValidEmail] = useState<boolean | undefined>(undefined);
  const [phone, setPhone] = useState<string>('');
  const [validPhone, setValidPhone] = useState<boolean | undefined>(undefined);
  const [message, setMessage] = useState<string>('');
  const [validMessage, setValidMessage] = useState<boolean | undefined>(
    undefined
  );
  const [state, formAction] = useFormState(sendContactForm, null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const formRef = useRef<ElementRef<'form'>>(null);

  useEffect(() => {
    if (firstname === '') setValidFirstname(undefined);
    else {
      let firstnameSchema = z.string().min(MIN_LENGTH_FIRSTNAME);
      let firstnameResult = firstnameSchema.safeParse(firstname);
      setValidFirstname(firstnameResult.success);
    }

    if (lastname === '') setValidLastname(undefined);
    else {
      let lastnameSchema = z.string().min(MIN_LENGTH_LASTNAME);
      let lastnameResult = lastnameSchema.safeParse(lastname);
      setValidLastname(lastnameResult.success);
    }

    if (email === '') setValidEmail(undefined);
    else {
      let emailSchema = z.string().email();
      let emailResult = emailSchema.safeParse(email);
      setValidEmail(emailResult.success);
    }

    if (phone === '') setValidPhone(undefined);
    else {
      let phoneSchema = z
        .string()
        .regex(new RegExp(/^\+(?:[0-9] ?){6,14}[0-9]$/));
      let phoneResult = phoneSchema.safeParse(phone);
      setValidPhone(phoneResult.success);
    }

    if (message.length <= MAX_LENGTH) setValidMessage(true);
    else setValidMessage(false);

    // @ts-ignore
    if (state?.id) {
      setFirstname('');
      setLastname('');
      setPhone('');
      setEmail('');
      setMessage('');
      toast('message sent');
      // @ts-ignore
      state.id = '';
      setShowModal(false);
    }
  }, [firstname, lastname, email, phone, message, state]);

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <p className="text-right profans-link cursor-pointer">Contact Us</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            We&apos;ll be in touch with you very soon.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} className="grid gap-4 py-4" action={formAction}>
          <Label htmlFor="firstname" className="">
            First Name
          </Label>
          <Input
            name="firstname"
            value={firstname}
            onChange={(e) => {
              setFirstname(e.target.value);
            }}
            className={cn('col-span-3', {
              'border-red-500': validFirstname === false,
              'border-green-500': validFirstname,
            })}
            autoComplete="off"
          />

          <Label htmlFor="lastname">Last Name</Label>
          <Input
            name="lastname"
            value={lastname}
            onChange={(e) => {
              setLastname(e.target.value);
            }}
            className={cn('col-span-3', {
              'border-red-500': validLastname === false,
              'border-green-500': validLastname,
            })}
            autoComplete="off"
          />

          <Label htmlFor="email" className="">
            Email Address
          </Label>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className={cn('col-span-3', {
              'border-red-500': validEmail === false,
              'border-green-500': validEmail,
            })}
            autoComplete="off"
          />

          <Label htmlFor="phone" className="">
            Phone Number
          </Label>
          <Input
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={cn('col-span-3', {
              'border-red-500': validPhone === false,
              'border-green-500': validPhone,
            })}
            autoComplete="off"
          />

          <Label htmlFor="message" className="">
            Message
          </Label>
          <Textarea
            name="message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            // maxLength={MAX_LENGTH}
            className="col-span-3"
          />
          <small
            className={cn(
              'text-xs text-right col-span-3 text-muted-foreground tracking-tight leading-0'
            )}
          >
            <span
              className={cn('', {
                'text-red-500': message.length > MAX_LENGTH,
              })}
            >
              {message.length}
            </span>
            -{MAX_LENGTH}
          </small>
          <SubmitBtn />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ContactUsForm;
