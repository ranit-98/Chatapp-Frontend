import type { Metadata } from 'next';
import ThemeProvider from '@/providers/ThemeProvider';
import ReactQueryProvider from '@/providers/ReactQueryProvider';

export const metadata: Metadata = {
  title: 'NexaChat – Real-time Chat & Video Calling',
  description:
    'Enterprise-grade real-time chat application with secure messaging, WebRTC video calling, and end-to-end encryption.',
  keywords: 'chat, messaging, video calling, WebRTC, real-time, NexaChat',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ReactQueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
