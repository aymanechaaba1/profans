import { APP_URL, LOGO_URL } from '@/utils/config';
import {
  Tailwind,
  Button,
  Html,
  Head,
  Container,
  Body,
  Section,
  Img,
  Heading,
  Text,
  Link,
} from '@react-email/components';
import { ReactNode } from 'react';

function EmailTemplate({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  let today = new Date();

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-slate-100/50 font-sans">
          <Container className="bg-white shadow-sm">
            <Section className="py-2">
              <Img src={LOGO_URL} width="100" className="mx-auto" />
            </Section>
            {children}
            <Section>
              <Text className="text-[11px] text-center max-w-[400px] mx-auto">
                <span>
                  This message was produced and distributed by Profans, Inc.
                  &#169;
                  {today.getFullYear()}, All rights reserved. View our
                </span>
                <Link href={APP_URL} className="ml-1 underline">
                  privacy policy
                </Link>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default EmailTemplate;
