import { generateOTP } from '@/actions/generateOtp';
import { sendOtp } from '@/actions/sendOtp';
import { DEFAULT_RESEND_OTP_TRIES } from '@/utils/config';
import React, { MouseEvent, useState } from 'react';
import { toast } from 'sonner';

function useResendCode(
  to: string,
  isRunning: boolean,
  time: Date,
  restart: (newExpiryTimestamp: Date, autoStart?: boolean | undefined) => void
) {
  const [tries, setTries] = useState<number>(0);
  const [sentOtp, setSentOtp] =
    useState<Awaited<ReturnType<typeof generateOTP>>>(undefined);

  async function resendCode(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    e.preventDefault();
    // if number of tries is 3, return and show a message of 'you reached max number of tries'

    if (tries === DEFAULT_RESEND_OTP_TRIES || isRunning) return;

    const newOtp = await generateOTP();
    if (!newOtp) return;
    setSentOtp(newOtp);

    const newEmailData = await sendOtp(to, newOtp.token.token);
    setTries((prevTry) => prevTry + 1);
    new Promise((resolve, reject) => {
      resolve('timer restarted');
    }).then((val) => restart(time));
  }

  return { resendCode, tries, setTries, sentOtp, setSentOtp };
}

export default useResendCode;
