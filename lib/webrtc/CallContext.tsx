'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useCallSession } from './useCallSession';
import { socketService } from '@/lib/socket/socket.service';

import { usePresence } from '@/lib/socket/socket.hooks';

type CallContextType = ReturnType<typeof useCallSession>;

const CallContext = createContext<CallContextType | null>(null);

export function CallProvider({ children }: { children: ReactNode }) {
    // Global presence sync (online/offline)
    usePresence();

    // Keep realtime features connected while the authenticated chat route is mounted.
    useEffect(() => {
        if (!socketService.isConnected()) {
            console.log('🔄 [CallProvider] Initializing chat socket connection');
            socketService.connect();
        } else {
            console.log('✅ [CallProvider] Socket already connected');
        }

        return () => {
            socketService.disconnect();
        };
    }, []);

    const callSession = useCallSession();

    // Debug logging for state changes
    useEffect(() => {
        if (callSession.callStatus !== 'idle') {
            console.log('📊 [CallProvider] Call status changed:', callSession.callStatus, {
                callType: callSession.callType,
                remoteUser: callSession.remoteUser?.name,
            });
        }
    }, [callSession.callStatus, callSession.callType, callSession.remoteUser?.name]);

    return (
        <CallContext.Provider value={callSession}>
            {children}
        </CallContext.Provider>
    );
}

export function useCall() {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error('useCall must be used within a CallProvider');
    }
    return context;
}
