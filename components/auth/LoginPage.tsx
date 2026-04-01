// ─────────────────────────────────────────────────────────────
//  LoginPage – Premium Glassmorphism Login View
//  Industry-standard auth screen with animated entrance.
// ─────────────────────────────────────────────────────────────

'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthLogin } from '@/api/hooks/useAuth.hook';
import {
    AuthRoot,
    AuthCardWrapper,
    GradientBackgroundBlob,
    AuthLogoWrapper
} from '@/components/ui';

// ── Validation Schema ───────────────────────────────────────

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ── Props ───────────────────────────────────────────────────

interface LoginPageProps {
    onSwitchToRegister: () => void;
    onLogin: () => void;
}

// ── Component ───────────────────────────────────────────────

export default function LoginPage({ onSwitchToRegister, onLogin }: LoginPageProps) {
    const [showPassword, setShowPassword] = useState(false);

    // Auth Hook
    const { mutate, isPending } = useAuthLogin({
        onSuccessCallback: () => {
            onLogin();
        }
    });

    // Form Initialization
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        }
    });

    const onSubmit = (data: LoginFormData) => {
        // Exclude rememberMe from the API payload
        const { rememberMe, ...apiData } = data;
        mutate(apiData);
    };

    return (
        <AuthRoot>
            <GradientBackgroundBlob blobType="top" />
            <GradientBackgroundBlob blobType="bottom" />

            <AuthCardWrapper>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <AuthLogoWrapper>
                        <ChatBubbleRoundedIcon sx={{ color: 'white', fontSize: 28 }} />
                    </AuthLogoWrapper>
                    <Typography variant="h4" fontWeight={800} sx={{ mb: 1, textAlign: 'center' }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Log in to NexaChat to continue your conversations
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        placeholder="name@company.com"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailRoundedIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Box>
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockRoundedIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <FormControlLabel
                                control={<Checkbox size="small" {...register('rememberMe')} />}
                                label={<Typography variant="caption">Remember me</Typography>}
                            />
                            <Typography
                                variant="caption"
                                color="primary"
                                sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                            >
                                Forgot password?
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={isPending}
                        sx={{
                            height: 48,
                            borderRadius: 2,
                            fontSize: '1rem',
                            fontWeight: 600,
                        }}
                    >
                        {isPending ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
                        <Box sx={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                        <Typography variant="caption" color="text.secondary">
                            OR CONTINUE WITH
                        </Typography>
                        <Box sx={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<GoogleIcon />}
                            sx={{ py: 1.2, borderRadius: 2, borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                            Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<GitHubIcon />}
                            sx={{ py: 1.2, borderRadius: 2, borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                            GitHub
                        </Button>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                    Don&apos;t have an account?{' '}
                    <Box
                        component="span"
                        onClick={() => onSwitchToRegister()}
                        sx={{
                            color: 'primary.main',
                            fontWeight: 700,
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        Sign Up
                    </Box>
                </Typography>
            </AuthCardWrapper>
        </AuthRoot>
    );
}
