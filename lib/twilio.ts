import twilio from 'twilio';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN; // secret key
export const verifySid = process.env.TWILIO_VERIFY_SID;

const client = twilio(accountSid, authToken);

export default client;
