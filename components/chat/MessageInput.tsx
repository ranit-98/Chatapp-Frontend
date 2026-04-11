'use client';

// ─────────────────────────────────────────────────────────────
//  MessageInput – Rich Composer with Previews & Edit Mode
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import EmojiPicker, { Theme as EmojiTheme, EmojiClickData } from 'emoji-picker-react';
import { extendedPalette } from '@/theme';
import { uploadChatFileFn } from '@/api/functions/chat.api';
import {
  InputRoot,
  ComposerWrapper,
  ReplyPreviewBar,
  RecordingOverlay,
  WaveformBar,
  PreviewStage,
  PreviewImage,
} from '@/components/ui';

import type { ChatMessage } from '@/typescript/types/chat.types';

// ── Props ────────────────────────────────────────────────────

interface MessageInputProps {
  onSend: (content: string, type?: ChatMessage['type'], repliedTo?: string) => void;
  onEdit: (messageId: string, content: string) => void;
  onTyping: (isTyping: boolean) => void;
  replyTo?: ChatMessage | null;
  editingMsg?: ChatMessage | null;
  onCancelReply?: () => void;
  onCancelEdit?: () => void;
}

// ── Component ────────────────────────────────────────────────

export default function MessageInput({
  onSend,
  onEdit,
  onTyping,
  replyTo,
  editingMsg,
  onCancelReply,
  onCancelEdit,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [attachment, setAttachment] = useState<{
    file: File;
    preview: string;
    type: ChatMessage['type'];
  } | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Sync message if editing
  useEffect(() => {
    if (editingMsg) {
      setMessage(editingMsg.content);
      setAttachment(null);
    } else {
      setMessage('');
    }
  }, [editingMsg]);

  const hasContent = message.trim().length > 0 || attachment !== null;

  const handleAction = useCallback(async () => {
    const trimmedMessage = message.trim();
    const canSend = trimmedMessage.length > 0 || attachment !== null;

    if (!canSend || isUploading) return;

    if (editingMsg) {
      onEdit(editingMsg._id, trimmedMessage);
      setMessage('');
      onCancelEdit?.();
      onTyping(false);
      return;
    }

    if (attachment) {
      setIsUploading(true);
      try {
        const res = await uploadChatFileFn(attachment.file);
        const url: string = res?.data?.data?.url ?? res?.data?.url ?? '';
        if (url) {
          onSend(url, attachment.type, replyTo?._id);
          setAttachment(null);
          setMessage(''); // Clear any text draft too
          onTyping(false);
        }
      } catch (err) {
        console.error('[MessageInput] Upload failed', err);
      } finally {
        setIsUploading(false);
      }
    } else if (trimmedMessage) {
      onSend(trimmedMessage, 'text', replyTo?._id);
      setMessage('');
      onTyping(false);
    }
  }, [
    message,
    attachment,
    isUploading,
    editingMsg,
    onEdit,
    onCancelEdit,
    onSend,
    onTyping,
    replyTo,
  ]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAction();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type: ChatMessage['type'] = file.type.startsWith('image/') ? 'image' : 'file';
    const preview = type === 'image' ? URL.createObjectURL(file) : '';

    setAttachment({ file, preview, type });
    e.target.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/ogg';

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const file = new File([blob], `voice-note-${Date.now()}.webm`, { type: mimeType });

        setIsUploading(true);
        try {
          const res = await uploadChatFileFn(file);
          const url: string = res?.data?.data?.url ?? res?.data?.url ?? '';
          if (url) onSend(url, 'audio', replyTo?._id);
        } finally {
          setIsUploading(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch (err) {
      console.error('[MessageInput] Microphone access denied', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach((t) => t.stop());
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  return (
    <InputRoot>
      <input ref={fileInputRef} type="file" hidden accept="*/*" onChange={handleFileSelect} />
      <input ref={imageInputRef} type="file" hidden accept="image/*" onChange={handleFileSelect} />

      {replyTo && (
        <ReplyPreviewBar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
            <ReplyRoundedIcon sx={{ fontSize: 16, color: 'primary.light', flexShrink: 0 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="caption"
                sx={{ color: 'primary.light', fontWeight: 600, display: 'block' }}
              >
                Replying
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {replyTo.type !== 'text' ? `📎 ${replyTo.type}` : replyTo.content}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={onCancelReply} sx={{ color: 'text.secondary', ml: 1 }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </ReplyPreviewBar>
      )}

      {editingMsg && (
        <ReplyPreviewBar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
            <EditRoundedIcon sx={{ fontSize: 16, color: 'secondary.main', flexShrink: 0 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="caption"
                sx={{ color: 'secondary.main', fontWeight: 600, display: 'block' }}
              >
                Editing Message
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={onCancelEdit} sx={{ color: 'text.secondary', ml: 1 }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </ReplyPreviewBar>
      )}

      {attachment && (
        <PreviewStage>
          {attachment.type === 'image' ? (
            <PreviewImage src={attachment.preview} alt="preview" />
          ) : (
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <InsertDriveFileRoundedIcon sx={{ color: 'primary.light' }} />
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {attachment.file.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {(attachment.file.size / 1024).toFixed(1)} KB
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setAttachment(null)} sx={{ color: '#FF7675' }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </PreviewStage>
      )}

      {isRecording ? (
        <ComposerWrapper isFocused>
          <RecordingOverlay>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#FF7675',
                animation: 'pulse 1s infinite',
                flexShrink: 0,
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.5, transform: 'scale(0.7)' },
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}
            >
              Recording {Math.floor(recordingSeconds / 60)}:
              {(recordingSeconds % 60).toString().padStart(2, '0')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, flex: 1 }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <WaveformBar key={i} index={i} />
              ))}
            </Box>
          </RecordingOverlay>
          <Tooltip title="Cancel">
            <IconButton onClick={cancelRecording} sx={{ color: '#FF7675' }}>
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Send Voice Note">
            <IconButton
              onClick={stopRecording}
              sx={{
                width: 40,
                height: 40,
                background: extendedPalette.gradients.primary,
                color: 'white',
                '&:hover': { filter: 'brightness(1.1)', transform: 'scale(1.05)' },
              }}
            >
              <StopRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ComposerWrapper>
      ) : (
        <ComposerWrapper isFocused={isFocused}>
          <Box sx={{ display: 'flex', gap: 0.25 }}>
            <Tooltip title="Emoji">
              <IconButton
                onClick={(e) => setEmojiAnchorEl(e.currentTarget)}
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: '#FDCB6E' } }}
              >
                <EmojiEmotionsRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Popover
              open={Boolean(emojiAnchorEl)}
              anchorEl={emojiAnchorEl}
              onClose={() => setEmojiAnchorEl(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              sx={{ mb: 2 }}
            >
              <EmojiPicker theme={EmojiTheme.DARK} onEmojiClick={handleEmojiClick} lazyLoadEmojis />
            </Popover>

            <Tooltip title="Attach File">
              <IconButton
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.light' } }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || !!editingMsg}
              >
                <AttachFileRoundedIcon fontSize="small" sx={{ transform: 'rotate(45deg)' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Send Image">
              <IconButton
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploading || !!editingMsg}
              >
                <ImageRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {isUploading ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5, pb: 0.5 }}>
              <CircularProgress size={16} sx={{ color: 'primary.main' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Uploading…
              </Typography>
            </Box>
          ) : (
            <InputBase
              multiline
              maxRows={4}
              placeholder="Type a message…"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                onTyping(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              sx={{ flex: 1, fontSize: '0.9rem', color: 'text.primary', pb: 0.5 }}
            />
          )}

          {hasContent ? (
            <Tooltip title={editingMsg ? 'Update Message' : 'Send Message'}>
              <IconButton
                onClick={handleAction}
                sx={{
                  width: 40,
                  height: 40,
                  background: editingMsg
                    ? 'linear-gradient(135deg, #00CEC9, #0984E3)'
                    : extendedPalette.gradients.primary,
                  color: 'white',
                  transition: 'all 0.2s ease',
                  '&:hover': { filter: 'brightness(1.1)', transform: 'scale(1.05)' },
                }}
              >
                {editingMsg ? (
                  <SendRoundedIcon fontSize="small" />
                ) : (
                  <SendRoundedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Voice Note">
              <IconButton
                onClick={startRecording}
                disabled={isUploading}
                sx={{
                  width: 40,
                  height: 40,
                  background: 'rgba(108, 92, 231, 0.1)',
                  color: 'primary.main',
                  '&:hover': { background: 'rgba(108, 92, 231, 0.2)', transform: 'scale(1.05)' },
                }}
              >
                <MicRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </ComposerWrapper>
      )}
    </InputRoot>
  );
}
