// ─────────────────────────────────────────────────────────────
//  Theme Palette – Industry Standard Color Tokens
//  Centralized color definitions for the entire application.
// ─────────────────────────────────────────────────────────────

export const palette = {
  // ── Primary Brand Colors ──────────────────────────────────
  primary: {
    main: '#6C5CE7',
    light: '#A29BFE',
    dark: '#5A4BD1',
    contrastText: '#FFFFFF',
  },

  // ── Secondary Accent Colors ───────────────────────────────
  secondary: {
    main: '#00CEC9',
    light: '#55EFC4',
    dark: '#00B5B0',
    contrastText: '#FFFFFF',
  },

  // ── Surface & Background ─────────────────────────────────
  background: {
    default: '#0B0D17',
    paper: '#12152A',
  },

  // ── Text Colors ──────────────────────────────────────────
  text: {
    primary: '#EAEAFF',
    secondary: '#8B8DA3',
    disabled: '#4A4C5E',
  },

  // ── Status & Semantic Colors ─────────────────────────────
  success: {
    main: '#00B894',
    light: '#55EFC4',
    dark: '#009C7C',
  },
  error: {
    main: '#FF6B6B',
    light: '#FF8E8E',
    dark: '#E55555',
  },
  warning: {
    main: '#FDCB6E',
    light: '#FFEAA7',
    dark: '#E0B45C',
  },
  info: {
    main: '#74B9FF',
    light: '#A3D4FF',
    dark: '#5FA3E5',
  },

  // ── Divider ──────────────────────────────────────────────
  divider: 'rgba(138, 141, 163, 0.12)',
} as const;

// ── Extended Custom Palette Tokens ─────────────────────────
export const extendedPalette = {
  // Chat bubble colors
  chat: {
    outgoing: 'rgba(108, 92, 231, 0.15)',
    outgoingBorder: 'rgba(108, 92, 231, 0.35)',
    incoming: 'rgba(255, 255, 255, 0.04)',
    incomingBorder: 'rgba(255, 255, 255, 0.08)',
  },

  // Glassmorphism tokens
  glass: {
    background: 'rgba(18, 21, 42, 0.72)',
    border: 'rgba(255, 255, 255, 0.08)',
    hover: 'rgba(255, 255, 255, 0.05)',
    active: 'rgba(108, 92, 231, 0.12)',
  },

  // Gradient presets
  gradients: {
    primary: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
    secondary: 'linear-gradient(135deg, #00CEC9 0%, #55EFC4 100%)',
    accent: 'linear-gradient(135deg, #6C5CE7 0%, #00CEC9 100%)',
    surface: 'linear-gradient(180deg, rgba(18,21,42,0.95) 0%, rgba(11,13,23,1) 100%)',
    sidebar: 'linear-gradient(180deg, #12152A 0%, #0E1025 100%)',
    glow: 'radial-gradient(ellipse at 50% 0%, rgba(108,92,231,0.15) 0%, transparent 70%)',
  },

  // Online status
  status: {
    online: '#00B894',
    offline: '#636E72',
    busy: '#FF6B6B',
    away: '#FDCB6E',
  },

  // Shadows
  shadows: {
    card: '0 4px 24px rgba(0, 0, 0, 0.25)',
    elevated: '0 8px 32px rgba(0, 0, 0, 0.35)',
    glow: '0 0 40px rgba(108, 92, 231, 0.2)',
    input: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
} as const;
