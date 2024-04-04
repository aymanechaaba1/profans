import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';

function Timer({
  sec,
  setTimerRunning,
  onExpire,
}: {
  sec: number;
  onExpire?: () => void;
  setTimerRunning: Dispatch<SetStateAction<boolean>>;
}) {
  const [time, setTime] = useState<Date>(new Date());

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: time,
    onExpire,
  });

  useEffect(() => {
    setTimerRunning(isRunning);
    time.setSeconds(time.getSeconds() + sec);
    start();
  }, [time, isRunning]);
  return (
    <span className="text-sm">
      <span>{minutes}</span>
      <span>:</span>
      <span>{seconds}</span>
    </span>
  );
}

export default Timer;
