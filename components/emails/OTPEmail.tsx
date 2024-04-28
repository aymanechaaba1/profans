import { Hr, Section, Text } from '@react-email/components';
import EmailTemplate from './EmailTemplate';
import { DEFAULT_OTP_TIME } from '@/utils/config';

function OTPEmail({ code }: { code: string }) {
  return (
    <EmailTemplate>
      <Section>
        <Text className="text-center font-semibold tracking-tight scroll-m-20">
          OTP Authentication
        </Text>
        <Text className="text-center text-xs">
          Verification Code (valid for only {DEFAULT_OTP_TIME} minutes)
        </Text>
        <Text className="text-center text-3xl font-semibold tracking-tight scroll-m-20">
          {code}
        </Text>
      </Section>
      <Hr />
    </EmailTemplate>
  );
}

export default OTPEmail;
