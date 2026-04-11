'use client';

import RegisterPage from '@/components/auth/RegisterPage';
import { useRouter } from 'next/navigation';

export default function RegisterRoute() {
  const router = useRouter();

  return (
    <RegisterPage
      onSwitchToLogin={() => router.push('/login')}
      onRegister={() => router.push('/chat')}
    />
  );
}
