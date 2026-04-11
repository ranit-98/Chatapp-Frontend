// ─────────────────────────────────────────────────────────────
//  GlassCard – Glassmorphism Card Component
//  A reusable card with frosted-glass effect styling.
// ─────────────────────────────────────────────────────────────

'use client';

import { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { extendedPalette } from '@/theme';

// ── Styled Components ───────────────────────────────────────

const CardRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hoverable' && prop !== 'clickable',
})<{ hoverable?: boolean; clickable?: boolean }>(({ hoverable, clickable }) => ({
  background: extendedPalette.glass.background,
  backdropFilter: 'blur(16px)',
  border: `1px solid ${extendedPalette.glass.border}`,
  borderRadius: 12,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: clickable ? 'pointer' : 'default',
  ...(hoverable && {
    '&:hover': {
      borderColor: 'rgba(108, 92, 231, 0.3)',
      boxShadow: extendedPalette.shadows.card,
      transform: 'translateY(-2px)',
    },
  }),
}));

// ── Props ───────────────────────────────────────────────────

interface GlassCardProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
  hover?: boolean;
  onClick?: () => void;
}

// ── Component ───────────────────────────────────────────────

export default function GlassCard({ children, sx, hover = false, onClick }: GlassCardProps) {
  return (
    <CardRoot hoverable={hover} clickable={!!onClick} onClick={onClick} sx={sx}>
      {children}
    </CardRoot>
  );
}
