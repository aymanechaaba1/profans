import {
  Column,
  Heading,
  Hr,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';
import EmailTemplate from './EmailTemplate';
import { formatPrice } from '@/utils/helpers';
import { orders } from '@/drizzle/schema';

function DownloadTicketsEmail({
  firstname,
  order,
  message,
  urls,
}: {
  firstname: string;
  order: typeof orders.$inferSelect;
  message: string;
  urls: string[];
}) {
  return (
    <EmailTemplate>
      <Section className="border p-4">
        <Row className="">
          <Column>orderId</Column>
          <Column className="text-right">{order?.id}</Column>
        </Row>
        <Row className="my-2">
          <Column>Time</Column>
          <Column className="text-right">
            {new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              day: 'numeric',
              month: 'short',
            }).format(order?.createdAt!)}
          </Column>
        </Row>
        <Row className="">
          <Column>Total Paid</Column>
          <Column className="text-right font-semibold">
            {formatPrice(Number(order?.total || 0))}
          </Column>
        </Row>
      </Section>
      <Section className="">
        {urls?.map((url, i) => (
          <div key={i}>
            <Hr />
            <Link className="text-[10px] mt-2 block" href={url}>
              <span>{url}</span>
            </Link>
          </div>
        ))}
        <Text className="text-center">{message}</Text>
      </Section>
      <Hr />
      <Section>
        <Text className="text-[10px] text-center tracking-tight leading-0 text-muted-foreground">
          this email was sent because you securely purchased throught Profans
          online ticketing platform.
        </Text>
      </Section>
      <Hr />
    </EmailTemplate>
  );
}

export default DownloadTicketsEmail;
