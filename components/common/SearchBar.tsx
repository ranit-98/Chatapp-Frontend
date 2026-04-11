// ─────────────────────────────────────────────────────────────
//  SearchBar – Animated Search Input Component
//  A styled search field with icon and smooth focus animations.
// ─────────────────────────────────────────────────────────────

'use client';

import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/SearchRounded';
import { extendedPalette } from '@/theme';

// ── Styled Components ───────────────────────────────────────

const SearchRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFocused',
})<{ isFocused: boolean }>(({ isFocused }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '8px 16px',
  borderRadius: 12,
  background: isFocused ? 'rgba(108, 92, 231, 0.06)' : 'rgba(255, 255, 255, 0.03)',
  border: `1px solid ${isFocused ? 'rgba(108, 92, 231, 0.3)' : extendedPalette.glass.border}`,
  transition: 'all 0.25s ease',
  boxShadow: isFocused ? '0 0 0 3px rgba(108, 92, 231, 0.08)' : 'none',
}));

const SearchIconStyled = styled(SearchIcon, {
  shouldForwardProp: (prop) => prop !== 'isFocused',
})<{ isFocused: boolean }>(({ theme, isFocused }) => ({
  fontSize: 20,
  color: isFocused ? theme.palette.primary.main : theme.palette.text.secondary,
  transition: 'color 0.2s ease',
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  '& ::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 0.7,
  },
}));

// ── Props ───────────────────────────────────────────────────

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

// ── Component ───────────────────────────────────────────────

export default function SearchBar({ placeholder = 'Search...', value, onChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <SearchRoot isFocused={focused}>
      <SearchIconStyled isFocused={focused} />
      <StyledInput
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </SearchRoot>
  );
}
