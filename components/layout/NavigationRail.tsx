// ─────────────────────────────────────────────────────────────
//  NavigationRail – Left Icon Sidebar Navigation
//  Vertical icon strip for navigating main sections.
// ─────────────────────────────────────────────────────────────

'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Brightness4RoundedIcon from '@mui/icons-material/Brightness4Rounded';
import { currentUser } from '@/lib/mock-data';
import StatusBadge from '@/components/common/StatusBadge';
import {
  RailRoot,
  BrandLogoWrapper,
  NavListWrapper,
  NavItemContainer,
  IndicatorLine,
  CustomNavButton,
  StyledNavBadge,
  BottomActionsStack,
  UserAvatarWrapper,
} from '@/components/ui/navigation';

// ── Types ───────────────────────────────────────────────────

type NavSection = 'chats' | 'calls' | 'profile' | 'settings';

interface NavigationRailProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
}

// ── Constants ───────────────────────────────────────────────

const navItems: {
  id: NavSection;
  icon: typeof ChatBubbleRoundedIcon;
  label: string;
  badge?: number;
}[] = [
  { id: 'chats', icon: ChatBubbleRoundedIcon, label: 'Chats', badge: 9 },
  { id: 'calls', icon: CallRoundedIcon, label: 'Calls' },
  { id: 'profile', icon: PersonRoundedIcon, label: 'Profile' },
  { id: 'settings', icon: SettingsRoundedIcon, label: 'Settings' },
];

// ── Component ───────────────────────────────────────────────

export default function NavigationRail({ activeSection, onSectionChange }: NavigationRailProps) {
  return (
    <RailRoot>
      <BrandLogoWrapper>
        <ChatBubbleRoundedIcon sx={{ color: 'white', fontSize: 22 }} />
      </BrandLogoWrapper>

      <NavListWrapper>
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <Tooltip key={item.id} title={item.label} placement="right">
              <NavItemContainer>
                {isActive && <IndicatorLine />}
                <CustomNavButton isActive={isActive} onClick={() => onSectionChange(item.id)}>
                  {item.badge ? (
                    <StyledNavBadge badgeContent={item.badge} color="error">
                      <Icon fontSize="small" />
                    </StyledNavBadge>
                  ) : (
                    <Icon fontSize="small" />
                  )}
                </CustomNavButton>
              </NavItemContainer>
            </Tooltip>
          );
        })}
      </NavListWrapper>

      <BottomActionsStack>
        <Tooltip title="Theme" placement="right">
          <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
            <Brightness4RoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Logout" placement="right">
          <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box sx={{ mt: 1 }}>
          <StatusBadge status={currentUser.status}>
            <UserAvatarWrapper>
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </UserAvatarWrapper>
          </StatusBadge>
        </Box>
      </BottomActionsStack>
    </RailRoot>
  );
}
