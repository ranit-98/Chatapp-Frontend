// ─────────────────────────────────────────────────────────────
//  MUI Theme Provider – Client-Side Theme Wrapper
//  Wraps the application with MUI's ThemeProvider and CssBaseline.
// ─────────────────────────────────────────────────────────────

'use client';

import { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/theme';

interface Props {
  children: ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
