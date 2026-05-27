// ─────────────────────────────────────────────────────────────
//  Home Page – App Entry Point with Auth Flow
//  Routes between Auth screens and Chat Layout.
// ─────────────────────────────────────────────────────────────

'use client';

import ChatLayout from '@/components/layout/ChatLayout';
import { CallProvider } from '@/lib/webrtc/CallContext';

export default function Home() {
  return (
    <CallProvider>
      <ChatLayout />
    </CallProvider>
  );
}
