// ─────────────────────────────────────────────────────────────
//  ProfilePanel – User Profile View & Edit Panel
//  Displays current user profile with avatar, bio, and
//  contact details in a modern card layout.
// ─────────────────────────────────────────────────────────────

'use client';

import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { extendedPalette } from '@/theme';
import { useUserUpdateProfile } from '@/api/hooks/useUser.hook';
import { baseUrlMedia } from '@/api/endpoints';
import { IUserProfile } from '@/typescript/interfaces/user.interface';
import GlassCard from '@/components/common/GlassCard';

// ── Validation Schema ───────────────────────────────────────

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ── Props ───────────────────────────────────────────────────

interface ProfilePanelProps {
    userData?: IUserProfile;
}

// ── Component ───────────────────────────────────────────────

export default function ProfilePanel({ userData }: ProfilePanelProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate, isPending } = useUserUpdateProfile({
        onSuccessCallback: () => {
            setIsEditing(false);
            setPreviewImage(null);
            setSelectedFile(null);
        }
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: userData?.name || '',
            email: userData?.email || '',
        }
    });

    // Reset form when userData is fetched or changed
    useEffect(() => {
        if (userData) {
            reset({
                name: userData.name,
                email: userData.email,
            });
        }
    }, [userData, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = (data: ProfileFormData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        if (selectedFile) {
            formData.append('avatar', selectedFile);
        }
        mutate(formData);
    };

    const handleCancel = () => {
        reset();
        setPreviewImage(null);
        setSelectedFile(null);
        setIsEditing(false);
    };

    const avatarUrl = previewImage ||
        (userData?.avatar ? `${baseUrlMedia}${userData.avatar}` : null);

    return (
        <Box
            sx={{
                width: 340,
                minWidth: 340,
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: extendedPalette.gradients.sidebar,
                borderRight: `1px solid ${extendedPalette.glass.border}`,
                overflowY: 'auto',
            }}
        >
            {/* Header */}
            <Box sx={{ px: 2.5, pt: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Profile
                </Typography>
                {!isEditing && (
                    <Tooltip title="Edit Profile">
                        <IconButton
                            onClick={() => setIsEditing(true)}
                            size="small"
                            sx={{ color: 'primary.light' }}
                        >
                            <EditRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Avatar Section */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 4,
                    position: 'relative',
                }}
            >
                {/* Background glow */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(108,92,231,0.12) 0%, transparent 70%)',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                    }}
                />

                <Box sx={{ position: 'relative' }}>
                    <Avatar
                        src={avatarUrl || undefined}
                        sx={{
                            width: 100,
                            height: 100,
                            background: extendedPalette.gradients.accent,
                            fontSize: '2rem',
                            fontWeight: 700,
                            border: '3px solid rgba(108, 92, 231, 0.4)',
                            boxShadow: extendedPalette.shadows.glow,
                        }}
                    >
                        {!avatarUrl && userData?.name?.[0]}
                    </Avatar>

                    {isEditing && (
                        <>
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <Tooltip title="Change Avatar">
                                <IconButton
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{
                                        position: 'absolute',
                                        bottom: -4,
                                        right: -4,
                                        width: 32,
                                        height: 32,
                                        background: extendedPalette.gradients.primary,
                                        color: 'white',
                                        '&:hover': {
                                            background: extendedPalette.gradients.primary,
                                            filter: 'brightness(1.1)',
                                        },
                                        boxShadow: extendedPalette.shadows.card,
                                    }}
                                >
                                    <CameraAltRoundedIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Box>

                <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
                    {userData?.name || 'User'}
                </Typography>
            </Box>

            <Divider sx={{ mx: 2.5 }} />

            {/* Profile Content */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Box sx={{ px: 2.5, py: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {isEditing ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                {...register('name')}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                placeholder="Your Name"
                                variant="outlined"
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Email Address"
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                placeholder="your@email.com"
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    ) : (
                        <>
                            <GlassCard sx={{ px: 2.5, py: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '12px',
                                            background: 'rgba(108, 92, 231, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <PersonRoundedIcon sx={{ color: 'primary.light', fontSize: 20 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Full Name
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {userData?.name || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </GlassCard>

                            <GlassCard sx={{ px: 2.5, py: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '12px',
                                            background: 'rgba(0, 206, 201, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <EmailRoundedIcon sx={{ color: 'secondary.light', fontSize: 20 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Email
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {userData?.email || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </GlassCard>
                        </>
                    )}
                </Box>

                {/* Edit Button */}
                <Box sx={{ px: 2.5, pb: 3, mt: 'auto' }}>
                    {isEditing ? (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={handleCancel}
                                disabled={isPending}
                                startIcon={<CancelRoundedIcon />}
                                sx={{ py: 1.2, borderRadius: 2 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                fullWidth
                                type="submit"
                                disabled={isPending}
                                startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <SaveRoundedIcon />}
                                sx={{ py: 1.2, borderRadius: 2 }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    ) : (
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => setIsEditing(true)}
                            startIcon={<EditRoundedIcon />}
                            sx={{ py: 1.5, borderRadius: 3 }}
                        >
                            Edit Profile
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
