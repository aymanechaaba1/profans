import { formatPrice } from '@/utils/helpers';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';
import Link from 'next/link';
import { Clock, MapPin, Send } from 'lucide-react';
import { getUpcomingEvents } from '@/actions/getUpcomingEvents';
import { getMinPrice } from '@/actions/getMinPrice';
import BuyTicketDialog from './BuyTicketDialog';
import EventTimer from './EventTimer';

async function Event({
  event,
}: {
  event: Awaited<ReturnType<typeof getUpcomingEvents>>[0];
}) {
  const minPrice = await getMinPrice(event.id);
  let expiredEvent = Date.now() > event.time.getTime();

  return (
    <Card className="rounded-lg">
      {event.thumbnail && (
        <div className="w-full h-40 mb-3">
          <Image
            priority
            src={event.thumbnail}
            width={100}
            height={100}
            alt={event.name}
            className="w-full h-full object-cover object-center rounded-t-lg"
          />
        </div>
      )}
      <CardContent>
        <div className="mb-1">
          <div className="flex items-start justify-between">
            <div className="mb-3 space-y-2">
              <CardTitle className="">{event.name}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </div>
            <Link prefetch={false} href={`/events/${event.id}`}>
              <Send size={18} />
            </Link>
          </div>
          <div className="flex items-center gap-x-2">
            <MapPin size={13} />
            <p className="text-sm">{event.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <Clock size={13} />
          <p className="text-gray-900 dark:text-slate-100 text-xs">
            {new Intl.DateTimeFormat('en-US', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }).format(event.time)}
          </p>
        </div>
        <BuyTicketDialog event={event} />
        {!expiredEvent && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs mt-2 text-center">
                <span className="mr-1">starts at</span>
                <span className="font-semibold">
                  {formatPrice(Number(minPrice || 0))}
                </span>
              </p>
            </div>
            <EventTimer event={event} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Event;
