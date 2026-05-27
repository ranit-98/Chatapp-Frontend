//===============================================>
// this is for stun server configuration
//===============================================>

export const ICE_SERVERS = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
};

//===============================================>
// this is for video call media constraints
//===============================================>

export const MEDIA_CONSTRAINTS = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user',
  },
  audio: true,
};

//===============================================>
// this is for audio call media constraints
//===============================================>

export const AUDIO_ONLY_CONSTRAINTS = {
  video: false,
  audio: true,
};
