'use client';

import PhoneNumberInput from './PhoneNumberInput';
import { signup } from '@/actions/signup';
import { MouseEvent, MouseEventHandler, useEffect, useState } from 'react';
import { cn, getCities } from '@/utils/helpers';
import { City, MoroccanCitiesResponse } from '@/types/moroccan-cities';
import { toast } from 'sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { z } from 'zod';
import { sendOtp } from '@/actions/sendOtp';
import db from '@/drizzle';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { Label } from './ui/label';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { checkUser } from '@/actions/checkUser';
import { validateEmail } from '@/actions/validateEmail';
import { Button } from './ui/button';
import { sendWelcomeEmail } from '@/actions/sendWelcomeEmail';
import { generateOTP } from '@/actions/generateOtp';
import { generateQrCode } from '@/actions/generateQrCode';
import { verifyOtp } from '@/actions/verifyOtp';
import { DEFAULT_OTP_TIME } from '@/utils/config';
import OTPTimer from './OTPTimer';
import { useTimer } from 'react-timer-hook';
import useResendCode from '@/hooks/useResendCode';

export type SignUpFormState = {
  ok: boolean;
  message?: string;
  errors?: {
    gender?: string[];
    firstname?: string[];
    lastname?: string[];
    cin?: string[];
    birthdate?: string[];
    city?: string[];
    phone?: string[];
    email?: string[];
  };
};

const initState: SignUpFormState = {
  ok: false,
  message: '',
  errors: {
    gender: undefined,
    firstname: undefined,
    lastname: undefined,
    cin: undefined,
    birthdate: undefined,
    city: undefined,
    phone: undefined,
    email: undefined,
  },
};

function SendOtpSubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="col-span-2 py-2 rounded-lg flex justify-center"
    >
      {pending ? (
        <Loader2
          className="animate-spin my-1 text-white dark:text-gray-900"
          size={15}
        />
      ) : (
        'next'
      )}
    </Button>
  );
}

function SignupSubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="col-span-2 py-2 rounded-lg flex justify-center items-center"
    >
      {pending ? (
        <Loader2 className="animate-spin my-1" size={15} color="white" />
      ) : (
        'signup'
      )}
    </Button>
  );
}

function SignUpForm() {
  const [cities, setCities] = useState<City[] | undefined>(undefined);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showResendCodeBtn, setShowResendCodeBtn] = useState(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [validOtp, setValidOtp] = useState<boolean | undefined>(false);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState<boolean | undefined>(undefined);
  const [formState, setFormState] = useState<SignUpFormState>();
  const router = useRouter();
  const time = new Date();
  time.setSeconds(time.getSeconds() + DEFAULT_OTP_TIME * 60);
  const { seconds, minutes, isRunning, start, restart } = useTimer({
    expiryTimestamp: time,
    onExpire: () => {},
    autoStart: false,
  });

  const { resendCode, setTries, sentOtp, setSentOtp } = useResendCode(
    email,
    isRunning,
    time,
    restart
  );

  useEffect(() => {
    getCities().then((data) => setCities(data.results));
    if (otpCode && otpCode.length === 6 && sentOtp) {
      verifyOtp(sentOtp.secret.secret, otpCode).then((verificationResult) => {
        if (!verificationResult) return toast('wrong otp!');
        setValidOtp(true);
      });
    }

    if (formState) {
      formState.message && toast(formState.message);
      formState.ok && router.replace('/');
    }
  }, [formState, otpCode, sentOtp, validOtp]);

  async function emailFormHandler(email: string) {
    const validEmail = await validateEmail(email);
    if (!validEmail) return toast('invalid email');
    if (showOTPInput) return;

    setValidEmail(true);

    try {
      // check if new user
      const user = await checkUser(email);
      if (user) return toast('user already exists');

      // send otp code
      const otp = await generateOTP();
      if (!otp) return;

      const url = await generateQrCode<string>(otp.secret.uri);

      setSentOtp(otp);
      const emailData = await sendOtp(email, otp.token.token);
      if (emailData?.id) {
        setShowOTPInput(true);
        setShowTimer(true);
      }

      // start timer
      start();
      setTries((prevTry) => prevTry + 1);
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  return (
    <div className="flex flex-col-reverse border rounded-lg shadow-lg">
      <div
        className="bg-cover bg-center h-[400px] flex justify-center items-center p-5"
        style={{
          backgroundImage:
            "url('https://firebasestorage.googleapis.com/v0/b/tadakirnet-clone-ae832.appspot.com/o/login%2Faditya-chinchure-ZhQCZjr9fHo-unsplash.jpg?alt=media&token=ca80ff84-5285-435b-a194-c57f0021e1ca')",
        }}
      >
        <h1 className="text-white text-4xl font-semibold tracking-tight scroll-m-20 text-center mix-blend-overlay">
          Moments You Don&apos;t Wanna Miss
        </h1>
      </div>
      <div className="w-full flex flex-col justify-center items-center p-5">
        <h1 className="font-semibold tracking-tight text-2xl scroll-m-20">
          Create your Account
        </h1>
        <form
          action={async (formData) => {
            let email = formData.get('email') as string;
            emailFormHandler(email);
            setEmail(email);
          }}
          className="grid grid-cols-2 items-center my-5 space-y-4"
        >
          <Label htmlFor="email">email</Label>
          <input
            type="email"
            name="email"
            autoComplete="off"
            className={cn(
              'border rounded-lg py-1 px-3 !mt-0 dark:bg-gray-900',
              {
                'border-red-500': validEmail === false,
                'border-green-500': validEmail,
              }
            )}
            placeholder="name@contact.ma"
          />
          {showOTPInput && !validOtp && (
            <div className="space-y-2 col-span-2 mx-auto flex flex-col justify-center items-center">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                className=""
                value={otpCode}
                onChange={(value) => {
                  setOtpCode(value);
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <div className="text-xs text-gray-800 dark:text-slate-200 text-center">
                Enter your one-time password. (valid for only {DEFAULT_OTP_TIME}{' '}
                minutes)
              </div>
              {showTimer && (
                <OTPTimer
                  isRunning={isRunning}
                  minutes={minutes}
                  seconds={seconds}
                  resendCode={resendCode}
                />
              )}
            </div>
          )}
          {!validOtp && !showOTPInput && <SendOtpSubmitBtn />}
        </form>
        {validOtp && (
          <form
            action={async (formData: FormData) => {
              const state = await signup(null, formData, email);
              setFormState(state);
            }}
            className="grid grid-cols-2 gap-y-4"
          >
            <Label htmlFor="gender">gender</Label>
            <select
              name="gender"
              className={cn(`border py-1 px-3 rounded-lg`, {
                'border border-red-500': formState?.errors?.gender,
              })}
            >
              <option value="" disabled>
                please select a gender
              </option>
              <option value="male">male</option>
              <option value={'female'}>female</option>
            </select>
            <Label htmlFor="firstname">firstname</Label>
            <input
              type="text"
              name="firstname"
              autoComplete="off"
              className={cn('border rounded-lg py-1 px-3', {
                'border border-red-500': formState?.errors?.firstname,
              })}
            />
            <Label htmlFor="lastname">lastname</Label>
            <input
              type="text"
              name="lastname"
              autoComplete="off"
              className={cn('border rounded-lg py-1 px-3', {
                'border border-red-500': formState?.errors?.lastname,
              })}
            />
            <Label htmlFor="cin">cin</Label>
            <input
              type="text"
              name="cin"
              autoComplete="off"
              className={cn('border rounded-lg py-1 px-3', {
                'border border-red-500': formState?.errors?.cin,
              })}
            />
            <Label htmlFor="birthdate">birthdate</Label>
            <input
              type="date"
              name="birthdate"
              className={cn('border rounded-lg py-1 px-3', {
                'border border-red-500': formState?.errors?.birthdate,
              })}
            />
            <Label htmlFor="city">city</Label>
            <select
              name="city"
              className={cn('border rounded-lg py-1 px-3', {
                'border border-red-500': formState?.errors?.city,
              })}
            >
              <option value="" disabled>
                please select a city
              </option>
              {cities?.map((city, i) => (
                <option key={i} value={city.name.toLowerCase()}>
                  {city.name}
                </option>
              ))}
            </select>
            <PhoneNumberInput state={formState} />
            <SignupSubmitBtn />
          </form>
        )}
        <p className="text-xs col-span-2 mt-4">
          <span className="mr-1">already have an account,</span>
          <Link href={'/login'} className="font-bold">
            login!
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpForm;
