import LoginForm from '@/components/LoginForm';
import { sql } from '@/drizzle/seed';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login to Tadakir.net Clone',
  description: 'Login to your account',
};

async function LoginPage() {
  return (
    <>
      <LoginForm />
    </>
  );
}

export default LoginPage;
