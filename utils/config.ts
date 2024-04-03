export const alg = 'HS256';
export const secret = process.env.AUTH_SECRET;
export const key = new TextEncoder().encode(secret);
export const expiresIn = 60 * 60; // in s
