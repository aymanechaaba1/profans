import twilio from 'twilio';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN; // secret key
export const verifySid = 'VAebe1a38ec48b7b0541cea274c75392e9';

const client = twilio(accountSid, authToken);

export default client;
