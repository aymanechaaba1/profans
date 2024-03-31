'use client';

import PhoneNumberInput from './PhoneNumberInput';
import { signup } from '@/actions/signup';
import { MouseEvent, MouseEventHandler, useEffect, useState } from 'react';
import { cn } from '@/utils/helpers';
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
import db from '@/drizzle/seed';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { Label } from './ui/label';
import { useTimer } from 'react-timer-hook';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

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

function SendOtpSubmitBtn({
  handler,
}: {
  handler: MouseEventHandler<HTMLButtonElement>;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={handler}
      className="col-span-2 bg-blue-500 text-white py-2 rounded-lg"
    >
      {pending ? 'sending otp...' : 'next'}
    </button>
  );
}

function SignupSubmitBtn({ isRunning }: { isRunning?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="col-span-2 bg-blue-500 text-white py-2 rounded-lg flex justify-center items-center"
    >
      {pending ? (
        <Loader2 className="animate-spin my-1" size={15} color="white" />
      ) : (
        'signup'
      )}
    </button>
  );
}

function SignUpForm() {
  const [cities, setCities] = useState<City[] | undefined>(undefined);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showResendCodeBtn, setShowResendCodeBtn] = useState(false);
  const [sentOtp, setSentOtp] = useState('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [validOtp, setValidOtp] = useState<boolean | undefined>(false);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState<boolean | undefined>(undefined);
  const [formState, setFormState] = useState<SignUpFormState>();
  const router = useRouter();
  const [tries, setTries] = useState(0);

  const time = new Date();
  time.setSeconds(time.getSeconds() + 10);
  const { seconds, minutes, isRunning, start, restart } = useTimer({
    expiryTimestamp: time,
    onExpire: () => {},
    autoStart: false,
  });

  useEffect(() => {
    time.setSeconds(time.getSeconds() + 60);

    getCities();
    if (otpCode.length === 6) {
      if (otpCode === sentOtp) {
        setValidOtp(true);
      }
    }

    if (formState) {
      formState.message && toast(formState.message);
      formState.ok && router.replace('/');
    }
  }, [formState, otpCode, sentOtp, validOtp, isRunning]);

  async function getCities() {
    const res = await fetch(
      'https://parseapi.back4app.com/classes/List_of_Morroco_cities?order=asciiname',
      {
        headers: {
          'X-Parse-Application-Id': '2ZOfB60kP39M5kE4WynRqyP7lNGKZ9MB8fVWqAM9', // This is the fake app's application id
          'X-Parse-Master-Key': 'Qq7lEIoEEzRris3IM6POE5ewvYuzACVyA6VKtiVb', // This is the fake app's readonly master key
        },
      }
    );

    if (!res.ok) throw new Error(`something went wrong!`);

    const data: MoroccanCitiesResponse = await res.json();
    setCities(data.results);
  }

  async function userExits(email: string) {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    return !!user?.email;
  }

  async function emailFormHandler(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    e.preventDefault();
    let emailFormSchema = z.object({
      email: z.string().email(),
    });

    let result = emailFormSchema.safeParse({ email });

    if (!result.success) {
      setValidEmail(false);
    } else {
      setValidEmail(true);
      let { email } = result.data;

      try {
        // check if new user
        const user = await userExits(email);

        if (user) return toast('user already exists');

        // send otp
        const sendingResult = await sendOtp(email);
        if (sendingResult?.messageId) {
          setSentOtp(sendingResult.otp);
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
  }

  return (
    <div className="">
      <form className="grid grid-cols-2 items-center my-5 space-y-4">
        <Label htmlFor="email">email</Label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          className={cn('border rounded-lg py-1 px-3', {
            'border-red-500': validEmail === false,
            'border-green-500': validEmail,
          })}
          placeholder="name@contact.ma"
        />
        {showOTPInput && !validOtp && (
          <div className="space-y-2 col-span-2">
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
            <div className="text-sm text-gray-800">
              Enter your one-time password.
            </div>
            {showTimer && (
              <>
                <span>didn&apos;t receive the code?</span>
                <button
                  disabled={isRunning}
                  className="font-medium ml-2 mr-4"
                  onClick={async (e) => {
                    e.preventDefault();
                    // if number of tries is 3, return and show a message of 'you reached max number of tries'
                    if (tries === 3)
                      return toast('you reached max number of tries');

                    const newSendingResult = await sendOtp(email);
                    if (newSendingResult?.messageId)
                      setSentOtp(newSendingResult.otp);
                    setTries((prevTry) => prevTry + 1);
                    new Promise((resolve, reject) => {
                      resolve('timer restarted');
                    }).then((val) => restart(time));
                  }}
                >
                  try again after
                </button>
                <span className="text-sm">
                  <span>{minutes}</span>
                  <span>:</span>
                  <span>{seconds}</span>
                </span>
              </>
            )}
          </div>
        )}
        {!validOtp && <SendOtpSubmitBtn handler={emailFormHandler} />}
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
              'border border-red-500': false,
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
              'border border-red-500': false,
            })}
          />
          <Label htmlFor="lastname">lastname</Label>
          <input
            type="text"
            name="lastname"
            autoComplete="off"
            className={cn('border rounded-lg py-1 px-3', {
              'border border-red-500': false,
            })}
          />
          <Label htmlFor="cin">cin</Label>
          <input
            type="text"
            name="cin"
            autoComplete="off"
            className={cn('border rounded-lg py-1 px-3', {
              'border border-red-500': false,
            })}
          />
          <Label htmlFor="birthdate">birthdate</Label>
          <input
            type="date"
            name="birthdate"
            className={cn('border rounded-lg py-1 px-3', {
              'border border-red-500': false,
            })}
          />
          <Label htmlFor="city">city</Label>
          <select
            name="city"
            className={cn('border rounded-lg py-1 px-3', {
              'border border-red-500': false,
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
          <PhoneNumberInput state={undefined} />
          <SignupSubmitBtn isRunning={isRunning} />
        </form>
      )}
      <p className="mt-4 text-sm col-span-2">
        already have an account,{' '}
        <Link href={'/login'} className="font-bold">
          login!
        </Link>
      </p>
    </div>
  );
}

export default SignUpForm;
