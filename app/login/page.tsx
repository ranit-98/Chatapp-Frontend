'use client';

import LoginPage from '@/components/auth/LoginPage';
import { useRouter } from 'next/navigation';

export default function LoginRoute() {
  const router = useRouter();

  return (
    <LoginPage
      onSwitchToRegister={() => router.push('/register')}
      onLogin={() => router.push('/chat')}
    />
  );
}
