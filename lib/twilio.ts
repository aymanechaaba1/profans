import twilio from 'twilio';

const accountSid = 'ACd01eed3e4c1fe985511e39a40749a8c0';
const authToken =
  process.env.TWILIO_TOKEN || '412304255e19e1dc8b653c09943009ea'; // secret key
export const verifySid = 'VAebe1a38ec48b7b0541cea274c75392e9';

const client = twilio(accountSid, authToken);

export default client;
