import { eventOptions, events } from '@/drizzle/schema';
import Event from './Event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function Events({ data }: { data: (typeof events.$inferSelect)[] }) {
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
            {data.map((event) => (
              <Event key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="passed">passed events</TabsContent>
      </Tabs>
    </>
  );
}

export default Events;
