import { eventOptions, events } from '@/drizzle/schema';
import Event from './Event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUpcomingEvents } from '@/actions/getUpcomingEvents';
import { getPassedEvents } from '@/actions/getPassedEvents';

function Events({
  upcomingEvents,
  passedEvents,
}: {
  upcomingEvents: Awaited<ReturnType<typeof getUpcomingEvents>>;
  passedEvents: Awaited<ReturnType<typeof getPassedEvents>>;
}) {
  return (
    <>
      <h2 className="typography text-2xl font-semibold">Events</h2>
      <Tabs defaultValue="upcoming" className=" mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="passed">Passed</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="my-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-top gap-4">
            {upcomingEvents.map((event) => (
              <Event key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="passed">
          <div className="my-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-top gap-4">
            {passedEvents.map((event) => (
              <Event key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Events;
