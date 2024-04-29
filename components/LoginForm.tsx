'use client';

import { cn } from '@/utils/helpers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from './ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { sendOtp } from '@/actions/sendOtp';
import { setJWT } from '@/actions/setJWT';
import { checkUser } from '@/actions/checkUser';
import { validateEmail } from '@/actions/validateEmail';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { verifyOtp } from '@/actions/verifyOtp';
import { generateOTP } from '@/actions/generateOtp';
import Image from 'next/image';
import { generateQrCode } from '@/actions/generateQrCode';
import { DEFAULT_OTP_TIME } from '@/utils/config';
import { useTimer } from 'react-timer-hook';
import OTPTimer from './OTPTimer';
import useResendCode from '@/hooks/useResendCode';

export type LoginFormState = {
  ok: boolean;
  message?: string;
  id?: string;
  errors?: {
    email?: string[];
  };
};

function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="col-span-2 py-2 rounded-lg mt-4 flex justify-center"
      disabled={pending}
    >
      {pending ? (
        <Loader2
          className="animate-spin text-white dark:text-gray-900"
          size={15}
        />
      ) : (
        'login'
      )}
    </Button>
  );
}

function LoginForm() {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [qr, setQr] = useState<string>('');
  const [userId, setUserId] = useState('');
  const [showTimer, setShowTimer] = useState(false);
  const [email, setEmail] = useState<string>('');
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
  async function loginWithEmail(formData: FormData) {
    let email = formData.get('email') as string;
    const isValidEmail = await validateEmail(email);
    if (!isValidEmail) return toast('invalid email');

    const user = await checkUser(email);
    if (!user) return toast('no user with that email');
    if (showOtpInput) return;

    setUserId(user.id);
    setEmail(user.email);

    // send otp code
    const otp = await generateOTP();
    if (!otp) return;
    setSentOtp(otp);

    const url = await generateQrCode<string>(otp.secret.uri);
    setQr(url);

    const emailData = await sendOtp(user.email, otp.token.token);
    if (emailData?.id) {
      setShowOtpInput(true);
      setShowTimer(true);
    }

    // start timer
    start();
    setTries((prevTry) => prevTry + 1);
  }

  useEffect(() => {
    if (activeTab === 'email') {
      if (otpCode && otpCode.length === 6 && sentOtp) {
        verifyOtp(sentOtp.secret.secret, otpCode).then((verificationResult) => {
          if (!verificationResult) return toast('wrong otp!');

          // generate jwt
          let expiresIn = 24 * 60 * 60; // one day
          setJWT(userId, expiresIn)
            .then(() => {
              router.replace('/');
              toast('logged in');
            })
            .catch(() => {
              toast('something went wrong!');
            });
        });
      }
    }
  }, [activeTab, otpCode, sentOtp, userId]);

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
      <Tabs
        defaultValue={activeTab}
        onValueChange={(val) => setActiveTab(val as 'email' | 'phone')}
        className="w-full p-5 flex flex-col justify-center items-center gap-y-4"
      >
        <h1 className="font-semibold tracking-tight text-2xl scroll-m-20">
          Login to Your Account
        </h1>
        <TabsList className="mx-auto">
          <TabsTrigger value="email">email</TabsTrigger>
          <TabsTrigger value="phone" disabled>
            phone
          </TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <form
            action={loginWithEmail}
            className="grid items-center grid-cols-2 gap-x-4"
          >
            <label htmlFor="email">email</label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              className={cn('border rounded-lg py-1 px-3 dark:bg-gray-900')}
              placeholder="name@contact.ma"
            />
            {showOtpInput && (
              <div className="mt-4 col-span-2 flex flex-col justify-center items-center">
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  className="w-full mx-auto"
                  value={otpCode}
                  onChange={(val) => setOtpCode(val)}
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
                <p className="text-xs text-gray-800 dark:text-slate-200 mt-3 text-center">
                  Enter your one-time password. (valid for only{' '}
                  {DEFAULT_OTP_TIME} minutes)
                </p>
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
            {!showOtpInput && <LoginSubmitButton />}
          </form>
        </TabsContent>
        <TabsContent value="phone">
          {/* <form
            action={async (formData) => {
              const state = await loginWithPhone(formData);
            }}
            className="grid grid-cols-2 gap-x-3 items-center"
          >
            <PhoneNumberInput state={undefined} />
            <button
              type="submit"
              className="mt-4 rounded-lg bg-blue-500 py-1 px-4 text-white col-span-2"
            >
              login
            </button>
          </form> */}
        </TabsContent>
        <p className="text-xs col-span-2">
          don&apos;t have an account yet,{' '}
          <Link href={'/register'} className="font-bold">
            create one!
          </Link>
        </p>
      </Tabs>
    </div>
  );
}

export default LoginForm;
