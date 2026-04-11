// ─────────────────────────────────────────────────────────────
//  CallsPanel – Call History & Quick Dial Panel
//  Shows recent call logs with direction indicators and
//  quick call actions.
// ─────────────────────────────────────────────────────────────

'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded';
import CallReceivedRoundedIcon from '@mui/icons-material/CallReceivedRounded';
import CallMissedRoundedIcon from '@mui/icons-material/CallMissedRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import { callLogs, CallLog } from '@/lib/mock-data';
import StatusBadge from '@/components/common/StatusBadge';
import {
  CallsRoot,
  CallItemWrapper,
  CallAvatar,
  CallInfo,
  CallActions,
  QuickDialAvatar,
} from '@/components/ui';

const directionIcons = {
  incoming: CallReceivedRoundedIcon,
  outgoing: CallMadeRoundedIcon,
  missed: CallMissedRoundedIcon,
};

const directionColors = {
  incoming: '#00B894',
  outgoing: '#74B9FF',
  missed: '#FF6B6B',
};

const avatarColors = [
  'linear-gradient(135deg, #6C5CE7, #A29BFE)',
  'linear-gradient(135deg, #00CEC9, #55EFC4)',
  'linear-gradient(135deg, #FF6B6B, #FDCB6E)',
  'linear-gradient(135deg, #74B9FF, #A29BFE)',
  'linear-gradient(135deg, #00B894, #55EFC4)',
  'linear-gradient(135deg, #E17055, #FDCB6E)',
];

export default function CallsPanel() {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('');

  const renderCallItem = (call: CallLog, index: number) => {
    const DirectionIcon = directionIcons[call.direction];
    const dirColor = directionColors[call.direction];

    return (
      <CallItemWrapper key={call.id}>
        <StatusBadge status={call.user.status}>
          <CallAvatar bg={avatarColors[index % avatarColors.length]}>
            {getInitials(call.user.name)}
          </CallAvatar>
        </StatusBadge>

        <CallInfo>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: call.direction === 'missed' ? 'error.main' : 'text.primary',
            }}
          >
            {call.user.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <DirectionIcon sx={{ fontSize: 14, color: dirColor }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {call.direction === 'missed' ? 'Missed' : call.duration}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              •
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {call.timestamp}
            </Typography>
          </Box>
        </CallInfo>

        <CallActions>
          <Tooltip title="Voice Call">
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'secondary.main', background: 'rgba(0, 206, 201, 0.1)' },
              }}
            >
              <CallRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video Call">
            <IconButton
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main', background: 'rgba(108, 92, 231, 0.1)' },
              }}
            >
              <VideocamRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CallActions>
      </CallItemWrapper>
    );
  };

  return (
    <CallsRoot>
      {/* Header */}
      <Box sx={{ px: 2.5, pt: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Calls
          </Typography>
          <Tooltip title="New Call">
            <IconButton
              sx={{
                background: 'rgba(0, 206, 201, 0.1)',
                color: 'secondary.main',
                '&:hover': { background: 'rgba(0, 206, 201, 0.2)' },
              }}
            >
              <PhoneInTalkRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Quick Dial */}
      <Box sx={{ px: 2.5, mb: 1 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
          Quick Dial
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            mt: 1.5,
            overflowX: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {callLogs.slice(0, 4).map((call, idx) => (
            <Box
              key={call.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                minWidth: 60,
              }}
            >
              <QuickDialAvatar bg={avatarColors[idx % avatarColors.length]}>
                {getInitials(call.user.name)}
              </QuickDialAvatar>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: '0.68rem', textAlign: 'center' }}
              >
                {call.user.name.split(' ')[0]}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ mx: 2.5 }} />

      {/* Call History */}
      <Box sx={{ flex: 1, overflowY: 'auto', pt: 2, pb: 4 }}>
        <Box sx={{ px: 2.5, mb: 1 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
            Recent Calls
          </Typography>
        </Box>
        {callLogs.map((call, idx) => renderCallItem(call, idx))}
      </Box>
    </CallsRoot>
  );
}
