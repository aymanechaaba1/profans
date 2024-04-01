import SignUpForm from '@/components/SignUpForm';
import { sql } from '@/drizzle/seed';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signup to Tadakir.net Clone',
  description: 'Create your account',
};

async function RegisterPage() {
  const [helloSql] = await sql(`SELECT NOW();`);
  console.log('register-page', helloSql);

  return (
    <>
      <SignUpForm />
    </>
  );
}

export default RegisterPage;
