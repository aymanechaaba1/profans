import LoginForm from '@/components/LoginForm';
import { cn } from '@/utils/helpers';
import { Metadata } from 'next';
import { useState } from 'react';

export const metadata: Metadata = {
  title: 'Login to Tadakir.net Clone',
  description: 'Login to your account',
};

function LoginPage() {
  return (
    <>
      <LoginForm />
    </>
  );
}

export default LoginPage;
