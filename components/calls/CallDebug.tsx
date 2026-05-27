'use client';

import React, { useState } from 'react';
import { useCall } from '@/lib/webrtc/CallContext';

export default function CallDebug() {
  const state = useCall();
  const [testCount, setTestCount] = useState(0);

  if (process.env.NODE_ENV !== 'development') return null;

  const handleTestIncoming = () => {
    console.log('🧪 [CallDebug] Testing incoming call - Attempt:', testCount + 1);
    setTestCount((c) => c + 1);

    // Call with proper typing for RTCSessionDescriptionInit
    const mockOffer: RTCSessionDescriptionInit = {
      type: 'offer',
      sdp: 'mock_sdp_data',
    };

    state.handleIncomingCall({
      from: 'test-user-' + Date.now(),
      offer: mockOffer,
      type: 'video',
      callerName: 'Test Caller',
      callerAvatar: 'https://via.placeholder.com/150',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        left: 10,
        zIndex: 10001,
        background: 'rgba(0,0,0,0.95)',
        color: '#00FF00',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '11px',
        fontFamily: 'monospace',
        pointerEvents: 'auto',
        border: '1px solid #00FF00',
        maxWidth: '200px',
      }}
    >
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>DEBUG INFO</div>
      <div>
        Status: <span style={{ color: '#FFFF00' }}>{state.callStatus}</span>
      </div>
      <div>Type: {state.callType || 'null'}</div>
      <div>Remote ID: {state.remoteUserId?.slice(0, 8) || 'null'}</div>
      <div>Remote User: {state.remoteUser?.name || 'null'}</div>
      <div>Local: {state.localStream ? 'Yes' : 'No'}</div>
      <div>Remote: {state.remoteStream ? 'Yes' : 'No'}</div>
      <button
        onClick={handleTestIncoming}
        style={{
          marginTop: '8px',
          background: state.callStatus === 'incoming' ? '#FF6B6B' : '#6C5CE7',
          color: 'white',
          border: 'none',
          padding: '6px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
          fontSize: '10px',
          fontWeight: 'bold',
        }}
      >
        Test Incoming ({testCount})
      </button>
    </div>
  );
}
