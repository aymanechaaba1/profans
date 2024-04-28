'use server';

// import twofactor from 'node-2fa'
const twofactor = require('node-2fa');

export async function generateOTP() {
  const secret = twofactor.generateSecret({
    name: 'Profans',
    account: '',
  });
  const token = twofactor.generateToken(secret.secret); // valid for 10 minutes
  if (!secret || !token) return;

  return { secret, token };
}
