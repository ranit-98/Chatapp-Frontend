// ─────────────────────────────────────────────────────────────
//  RegisterPage – Secure Authentication Signup UI
//  Industry-standard registration form with glassmorphism.
// ─────────────────────────────────────────────────────────────

'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthRegister } from '@/api/hooks/useAuth.hook';
import {
    AuthRoot,
    AuthCardWrapper,
    GradientBackgroundBlob,
    AuthLogoWrapper
} from '@/components/ui';

// ── Validation Schema ───────────────────────────────────────

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    terms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

// ── Props ───────────────────────────────────────────────────

interface RegisterPageProps {
    onSwitchToLogin: () => void;
    onRegister: () => void;
}

// ── Component ───────────────────────────────────────────────

export default function RegisterPage({ onSwitchToLogin, onRegister }: RegisterPageProps) {
    const [showPassword, setShowPassword] = useState(false);

    // Auth Hook
    const { mutateAsync:RegistrationMutation, isPending } = useAuthRegister({
        onSuccessCallback: () => {
            onRegister();
        }
    });

    // Form Initialization
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            terms: false,
        }
    });

    const onSubmit = (data: RegisterFormData) => {
        // Exclude terms from the API payload
        const { terms, ...apiData } = data;
        RegistrationMutation(apiData);
    };

    return (
        <AuthRoot>
            <GradientBackgroundBlob blobType="top" />
            <GradientBackgroundBlob blobType="bottom" />

            <AuthCardWrapper>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <AuthLogoWrapper>
                        <ChatBubbleRoundedIcon sx={{ color: 'white', fontSize: 28 }} />
                    </AuthLogoWrapper>
                    <Typography variant="h4" fontWeight={800} sx={{ mb: 1, textAlign: 'center' }}>
                        Create Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Join NexaChat and experience real-time messaging
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        placeholder="John Doe"
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonRoundedIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

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

                    <FormControlLabel
                        control={<Checkbox size="small" {...register('terms')} />}
                        label={
                            <Typography variant="caption" sx={{ color: errors.terms ? 'error.main' : 'text.secondary' }}>
                                I agree to the Terms of Service and Privacy Policy
                            </Typography>
                        }
                    />
                    {errors.terms && (
                        <Typography variant="caption" color="error" sx={{ mt: -1.5, ml: 4 }}>
                            {errors.terms.message}
                        </Typography>
                    )}

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
                            mt: 1,
                        }}
                    >
                        {isPending ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                    </Button>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                    Already have an account?{' '}
                    <Box
                        component="span"
                        onClick={onSwitchToLogin}
                        sx={{
                            color: 'primary.main',
                            fontWeight: 700,
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        Log In
                    </Box>
                </Typography>
            </AuthCardWrapper>
        </AuthRoot>
    );
}
