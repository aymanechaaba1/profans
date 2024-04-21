import LoginForm from '@/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login to Tadakir.net Clone',
  description: 'Login to your account',
};

async function LoginPage() {
  return (
    <div className="container">
      <LoginForm />
    </div>
  );
}

export default LoginPage;
