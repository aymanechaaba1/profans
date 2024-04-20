'use client';

import { getUpcomingEvents } from '@/actions/getUpcomingEvents';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';

function EventTimer({
  event,
}: {
  event: Awaited<ReturnType<typeof getUpcomingEvents>>[0];
}) {
  const [timerExpired, setTimerExpired] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  let time = new Date();
  let timeLeft = event.time.getTime() - Date.now();
  time.setSeconds(time.getSeconds() + timeLeft / 1000);

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
    onExpire: () => setTimerExpired(true),
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <p
        className={cn('text-xs mt-3', {
          'text-red-500 font-semibold': totalSeconds / 3600 <= 24,
        })}
      >
        {!timerExpired
          ? `${days}d:${hours}h:${minutes}m:${seconds}s`
          : 'expired'}
      </p>
    )
  );
}

export default EventTimer;
