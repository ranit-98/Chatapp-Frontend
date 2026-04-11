'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // The middleware will handle redirects based on 'access_token' cookie.
    // This is a fallback to ensure we land on login if not redirected.
    router.replace('/login');
  }, [router]);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0B0D17',
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}
