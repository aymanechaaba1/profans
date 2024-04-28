import { Column, Hr, Row, Text } from '@react-email/components';
import EmailTemplate from './EmailTemplate';
import { upperFirst } from '@/utils/helpers';

type Props = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  message: string;
};

function ContactUsMessageEmail({
  firstname,
  lastname,
  email,
  phone,
  message,
}: Props) {
  return (
    <EmailTemplate>
      <Text className="tracking-tight leading-0 scroll-m-20">
        New Message from{' '}
        {firstname && lastname && (
          <strong>
            {upperFirst(firstname)} {upperFirst(lastname)} 💌
          </strong>
        )}
      </Text>
      <Row className="mb-2">
        <Column className="text-sm">Email</Column>
        <Column className="text-right text-sm font-semibold">{email}</Column>
      </Row>
      <Row>
        <Column className="text-sm">Phone</Column>
        <Column className="text-right text-sm font-semibold">{phone}</Column>
      </Row>
      <Hr />
      <Text className="text-sm  font-semibold -mb-2">Message:</Text>
      <Text className="text-sm leading-0 tracking-tight">{message}</Text>
      <Hr />
    </EmailTemplate>
  );
}

export default ContactUsMessageEmail;
