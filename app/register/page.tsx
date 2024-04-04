import SignUpForm from '@/components/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signup to Tadakir.net Clone',
  description: 'Create your account',
};

async function RegisterPage() {
  return (
    <>
      <SignUpForm />
    </>
  );
}

export default RegisterPage;
