import { users } from '@/drizzle/schema';
import EmailTemplate from './EmailTemplate';
import { Button, Text } from '@react-email/components';
import { getUrl, upperFirst } from '@/utils/helpers';

function WelcomeEmail({ user }: { user: typeof users.$inferSelect }) {
  return (
    <EmailTemplate>
      <Text className="text-center">
        Welcome{' '}
        <strong>
          {upperFirst(user.firstname)} {upperFirst(user.lastname)}
        </strong>
        ,
      </Text>
      <Text className="text-center text-xs tracking-tight">
        MOMENTS YOU DON&apos;T WANNA MISS 🎉😍
      </Text>
      <Button
        href={`${getUrl('/events')}`}
        className="bg-gray-900 text-white text-center rounded-lg px-4 py-2 text-sm font-semibold tracking-tight scroll-m-20 mx-auto block max-w-[100px] cursor-pointer"
      >
        Explore Events
      </Button>
    </EmailTemplate>
  );
}

export default WelcomeEmail;
