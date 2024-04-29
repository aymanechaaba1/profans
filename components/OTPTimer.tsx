'use client';

import { MouseEvent } from 'react';

function OTPTimer({
  isRunning,
  minutes,
  seconds,
  resendCode,
}: {
  isRunning: boolean;
  minutes: number;
  seconds: number;
  resendCode: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
}) {
  return (
    <div className="flex items-center mt-2">
      <span className="text-xs">didn&apos;t receive the code?</span>
      <button
        type="button"
        disabled={isRunning}
        className="font-medium ml-2 mr-4 text-xs"
        onClick={resendCode}
      >
        try again after
      </button>
      <span className="text-xs">
        <span>{`${minutes}`.padStart(2, '0')}</span>
        <span>:</span>
        <span>{`${seconds}`.padStart(2, '0')}</span>
      </span>
    </div>
  );
}

export default OTPTimer;
