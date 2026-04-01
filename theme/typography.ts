// ─────────────────────────────────────────────────────────────
//  Theme Typography – Industry Standard Type Scale
//  Uses Inter font family with a coherent type hierarchy.
// ─────────────────────────────────────────────────────────────

import { TypographyVariantsOptions } from "@mui/material";



export const typography: TypographyVariantsOptions = {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',

    h1: {
        fontSize: '2.25rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
    },
    h2: {
        fontSize: '1.875rem',
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: '-0.015em',
    },
    h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
    },
    h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.35,
    },
    h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
    },
    h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.45,
    },
    subtitle1: {
        fontSize: '0.9375rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.005em',
    },
    subtitle2: {
        fontSize: '0.8125rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.01em',
    },
    body1: {
        fontSize: '0.9375rem',
        fontWeight: 400,
        lineHeight: 1.6,
    },
    body2: {
        fontSize: '0.8125rem',
        fontWeight: 400,
        lineHeight: 1.55,
    },
    caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0.02em',
    },
    overline: {
        fontSize: '0.6875rem',
        fontWeight: 600,
        lineHeight: 1.5,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
    },
    button: {
        fontSize: '0.875rem',
        fontWeight: 600,
        lineHeight: 1.5,
        letterSpacing: '0.02em',
        textTransform: 'none',
    },
};
