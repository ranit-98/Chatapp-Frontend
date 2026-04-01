// ─────────────────────────────────────────────────────────────
//  SettingsPanel – Application Settings Panel
//  Categorized settings with toggle switches and action links.
// ─────────────────────────────────────────────────────────────

'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import GlassCard from '@/components/common/GlassCard';
import {
    SettingsRoot,
    SectionLabel,
    SettingActionRow,
    SettingIconWrapper,
    SettingTextGroup
} from '@/components/ui';

// ── Internal Components ─────────────────────────────────────

interface SettingToggleProps {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}

function SettingToggle({ icon, iconBg, label, description, checked, onChange }: SettingToggleProps) {
    return (
        <SettingActionRow>
            <SettingIconWrapper bg={iconBg}>{icon}</SettingIconWrapper>
            <SettingTextGroup>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>
            </SettingTextGroup>
            <Switch checked={checked} onChange={onChange} color="primary" />
        </SettingActionRow>
    );
}

interface SettingLinkProps {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    description: string;
    danger?: boolean;
}

function SettingLink({ icon, iconBg, label, description, danger }: SettingLinkProps) {
    return (
        <SettingActionRow danger={danger} clickable>
            <SettingIconWrapper bg={iconBg}>{icon}</SettingIconWrapper>
            <SettingTextGroup>
                <Typography variant="body2" sx={{ fontWeight: 500, color: danger ? 'error.main' : 'text.primary' }}>
                    {label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>
            </SettingTextGroup>
            <ChevronRightRoundedIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
        </SettingActionRow>
    );
}

// ── Main Component ──────────────────────────────────────────

export default function SettingsPanel() {
    const [notifications, setNotifications] = useState(true);
    const [sounds, setSounds] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <SettingsRoot>
            {/* Header */}
            <Box sx={{ px: 2.5, pt: 3, pb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Settings
                </Typography>
            </Box>

            {/* Notifications */}
            <Box sx={{ px: 2.5 }}>
                <SectionLabel>Notifications</SectionLabel>
                <GlassCard sx={{ px: 2 }}>
                    <SettingToggle
                        icon={<NotificationsRoundedIcon sx={{ color: '#A29BFE', fontSize: 20 }} />}
                        iconBg="rgba(108, 92, 231, 0.1)"
                        label="Push Notifications"
                        description="Receive message alerts"
                        checked={notifications}
                        onChange={() => setNotifications(!notifications)}
                    />
                    <Divider />
                    <SettingToggle
                        icon={<VolumeUpRoundedIcon sx={{ color: '#55EFC4', fontSize: 20 }} />}
                        iconBg="rgba(0, 206, 201, 0.1)"
                        label="Message Sounds"
                        description="Play sounds for new messages"
                        checked={sounds}
                        onChange={() => setSounds(!sounds)}
                    />
                </GlassCard>
            </Box>

            {/* Appearance */}
            <Box sx={{ px: 2.5 }}>
                <SectionLabel>Appearance</SectionLabel>
                <GlassCard sx={{ px: 2 }}>
                    <SettingToggle
                        icon={<DarkModeRoundedIcon sx={{ color: '#FDCB6E', fontSize: 20 }} />}
                        iconBg="rgba(253, 203, 110, 0.1)"
                        label="Dark Mode"
                        description="Use dark color scheme"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                    />
                    <Divider />
                    <SettingLink
                        icon={<PaletteRoundedIcon sx={{ color: '#74B9FF', fontSize: 20 }} />}
                        iconBg="rgba(116, 185, 255, 0.1)"
                        label="Chat Wallpaper"
                        description="Customize chat background"
                    />
                    <Divider />
                    <SettingLink
                        icon={<LanguageRoundedIcon sx={{ color: '#A29BFE', fontSize: 20 }} />}
                        iconBg="rgba(108, 92, 231, 0.1)"
                        label="Language"
                        description="English (US)"
                    />
                </GlassCard>
            </Box>

            {/* Privacy & Security */}
            <Box sx={{ px: 2.5 }}>
                <SectionLabel>Privacy & Security</SectionLabel>
                <GlassCard sx={{ px: 2 }}>
                    <SettingLink
                        icon={<LockRoundedIcon sx={{ color: '#00B894', fontSize: 20 }} />}
                        iconBg="rgba(0, 184, 148, 0.1)"
                        label="Privacy"
                        description="Last seen, profile photo, status"
                    />
                    <Divider />
                    <SettingLink
                        icon={<KeyRoundedIcon sx={{ color: '#FDCB6E', fontSize: 20 }} />}
                        iconBg="rgba(253, 203, 110, 0.1)"
                        label="Two-Step Verification"
                        description="Add extra security to your account"
                    />
                    <Divider />
                    <SettingLink
                        icon={<BlockRoundedIcon sx={{ color: '#FF6B6B', fontSize: 20 }} />}
                        iconBg="rgba(255, 107, 107, 0.1)"
                        label="Blocked Contacts"
                        description="Manage blocked users"
                    />
                </GlassCard>
            </Box>

            {/* Storage & Data */}
            <Box sx={{ px: 2.5 }}>
                <SectionLabel>Storage & About</SectionLabel>
                <GlassCard sx={{ px: 2 }}>
                    <SettingLink
                        icon={<StorageRoundedIcon sx={{ color: '#74B9FF', fontSize: 20 }} />}
                        iconBg="rgba(116, 185, 255, 0.1)"
                        label="Storage & Data"
                        description="Manage storage usage"
                    />
                    <Divider />
                    <SettingLink
                        icon={<InfoRoundedIcon sx={{ color: '#A29BFE', fontSize: 20 }} />}
                        iconBg="rgba(108, 92, 231, 0.1)"
                        label="About"
                        description="Version 1.0.0"
                    />
                </GlassCard>
            </Box>

            {/* Danger Zone */}
            <Box sx={{ px: 2.5, mb: 4 }}>
                <SectionLabel sx={{ color: 'error.main' }}>Danger Zone</SectionLabel>
                <GlassCard sx={{ px: 2, border: '1px solid rgba(255, 107, 107, 0.15)' }}>
                    <SettingLink
                        icon={<DeleteForeverRoundedIcon sx={{ color: '#FF6B6B', fontSize: 20 }} />}
                        iconBg="rgba(255, 107, 107, 0.1)"
                        label="Delete Account"
                        description="Permanently delete your account"
                        danger
                    />
                </GlassCard>
            </Box>
        </SettingsRoot>
    );
}
