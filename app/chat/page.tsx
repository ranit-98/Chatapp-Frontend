// ─────────────────────────────────────────────────────────────
//  Home Page – App Entry Point with Auth Flow
//  Routes between Auth screens and Chat Layout.
// ─────────────────────────────────────────────────────────────

'use client';

import { useState } from 'react';
import LoginPage from '@/components/auth/LoginPage';
import RegisterPage from '@/components/auth/RegisterPage';
import ChatLayout from '@/components/layout/ChatLayout';

type AuthView = 'login' | 'register';

export default function Home() {

  return <ChatLayout />;
}
