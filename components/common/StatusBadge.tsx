// ─────────────────────────────────────────────────────────────
//  StatusBadge – Online Status Indicator Component
//  Wraps MUI Badge to show user online status with color coding.
// ─────────────────────────────────────────────────────────────

'use client';

import { styled } from '@mui/material/styles';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { UserStatus } from '@/lib/mock-data';
import { extendedPalette } from '@/theme';

// ── Constants ───────────────────────────────────────────────

const statusColorMap: Record<UserStatus, string> = {
    online: extendedPalette.status.online,
    offline: extendedPalette.status.offline,
    busy: extendedPalette.status.busy,
    away: extendedPalette.status.away,
};

// ── Styled Components ───────────────────────────────────────

const StyledBadge = styled(Badge, {
    shouldForwardProp: (prop) => prop !== 'status',
})<{ status: UserStatus }>(({ status }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: statusColorMap[status],
        color: statusColorMap[status],
        boxShadow: '0 0 0 2px #12152A',
        width: 12,
        height: 12,
        borderRadius: '50%',
        '&::after': status === 'online'
            ? {
                position: 'absolute' as const,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'statusRipple 1.8s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            }
            : {},
    },
    '@keyframes statusRipple': {
        '0%': { transform: 'scale(0.8)', opacity: 1 },
        '100%': { transform: 'scale(2.2)', opacity: 0 },
    },
}));

// ── Props ───────────────────────────────────────────────────

interface StatusBadgeProps extends BadgeProps {
    status: UserStatus;
}

// ── Component ───────────────────────────────────────────────

export default function StatusBadge({ status, children, ...props }: StatusBadgeProps) {
    return (
        <StyledBadge
            status={status}
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            {...props}
        >
            {children}
        </StyledBadge>
    );
}
